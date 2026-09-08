/**
 * strip-c2pa.mjs — quita la metadata C2PA de las imágenes servidas.
 *
 * Uso:
 *   node tools/strip-c2pa.mjs            limpia public/
 *   node tools/strip-c2pa.mjs --check    solo informa; sale 1 si queda alguna
 *   node tools/strip-c2pa.mjs --dry-run  muestra qué tocaría, sin escribir
 *
 * Qué es y por qué estorba
 * ------------------------
 * Las capturas generadas por herramientas de IA traen un manifiesto C2PA
 * (procedencia del archivo). En un asset servido al navegador no aporta nada y
 * pesa ~5 KB por imagen, un 10 % del archivo.
 *
 * Cómo se quita sin recomprimir
 * -----------------------------
 * Un WebP es un contenedor RIFF: cabecera `RIFF <tam> WEBP` y luego chunks
 * `FourCC <tam> <payload>` alineados a byte par. En estos archivos el
 * manifiesto va en un chunk propio `C2PA` DETRÁS del `VP8` con los píxeles:
 *
 *     RIFF ... WEBP | VP8 (53.206 B) | C2PA (5.759 B)
 *
 * Así que basta con soltar ese chunk y corregir el tamaño que declara la
 * cabecera RIFF. Los píxeles no se tocan: no hay recompresión ni pérdida.
 *
 * De paso queda un archivo MÁS conforme al estándar que el original: el formato
 * simple (solo `VP8`) no admite chunks extra — para llevar metadata haría falta
 * la cabecera extendida `VP8X` con sus flags. Los decodificadores ignoran lo que
 * no entienden, por eso se veían bien igual.
 *
 * Para SVG el caso es otro (`<metadata>` en el XML) y lo cubre sync-brand.mjs.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = dirname(dirname(fileURLToPath(import.meta.url)));
const RAIZ = join(BASE, 'public');

const args = process.argv.slice(2);
const soloCheck = args.includes('--check');
const dryRun = args.includes('--dry-run');

/** Recorre un directorio y devuelve las rutas de las imágenes. */
function imagenes(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...imagenes(p));
    else if (/\.webp$/i.test(e.name)) out.push(p);
  }
  return out;
}

/** Lista los chunks de un WebP RIFF: [{ cc, inicio, total }]. */
function chunks(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const out = [];
  let off = 12;
  while (off + 8 <= buf.length) {
    const cc = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    const total = 8 + size + (size % 2); // los chunks se alinean a byte par
    if (total <= 8 || off + total > buf.length) return null; // archivo raro: no tocar
    out.push({ cc, inicio: off, total });
    off += total;
  }
  return off === buf.length ? out : null;
}

/** Devuelve el buffer sin los chunks C2PA, o null si no había ninguno. */
function limpiar(buf) {
  const cs = chunks(buf);
  if (!cs) return null;
  const sobra = cs.filter((c) => c.cc === 'C2PA');
  if (!sobra.length) return null;

  const partes = [buf.subarray(0, 12)];
  for (const c of cs) {
    if (c.cc !== 'C2PA') partes.push(buf.subarray(c.inicio, c.inicio + c.total));
  }
  const out = Buffer.concat(partes);
  out.writeUInt32LE(out.length - 8, 4); // el RIFF declara el tamaño sin "RIFF"+tam
  return out;
}

const afectadas = [];
for (const ruta of imagenes(RAIZ)) {
  const buf = readFileSync(ruta);
  const out = limpiar(buf);
  if (out) afectadas.push({ ruta, antes: buf.length, despues: out.length, out });
}

if (soloCheck) {
  if (afectadas.length) {
    console.error(`Hay ${afectadas.length} imagen(es) con metadata C2PA:`);
    for (const a of afectadas) console.error('  · ' + relative(BASE, a.ruta).replace(/\\/g, '/'));
    console.error('\nCorre: npm run strip-c2pa');
    process.exit(1);
  }
  console.log('Ninguna imagen de public/ arrastra metadata C2PA.');
  process.exit(0);
}

if (!afectadas.length) {
  console.log('Nada que limpiar: ninguna imagen de public/ tiene C2PA.');
  process.exit(0);
}

let ahorro = 0;
for (const a of afectadas) {
  if (!dryRun) writeFileSync(a.ruta, a.out);
  const quitado = a.antes - a.despues;
  ahorro += quitado;
  const pct = ((quitado / a.antes) * 100).toFixed(0);
  console.log(
    `  ${relative(BASE, a.ruta).replace(/\\/g, '/')}  ` +
      `${(a.antes / 1024).toFixed(1)} -> ${(a.despues / 1024).toFixed(1)} KB  (-${pct} %)`,
  );
}

const sufijo = dryRun ? '  (--dry-run: no se escribió nada)' : '';
console.log(`\n${afectadas.length} imagen(es), ${(ahorro / 1024).toFixed(1)} KB menos${sufijo}`);
