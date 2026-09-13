// Genera los WebP de la seccion "En sitio" de /casos a partir de las fotos
// originales que los clientes nos mandan.
//
//   npm run fotos-casos            regenera lo que falte o este desactualizado
//   npm run fotos-casos -- --todo  regenera todo aunque este al dia
//
// Las fuentes viven fuera del repo, en _suitehub-marketing/casos/, y cada
// entrada de src/data/instalaciones.json dice de que archivo sale cada imagen
// en su bloque "origen". El repo solo guarda los WebP ya optimizados.
//
// No hay cwebp ni ImageMagick en la maquina: se dibuja en un canvas de
// Chromium y se exporta con toDataURL. Ver tools/strip-c2pa.mjs para la
// metadata que hay que quitar si alguna imagen viene de un generador.
//
// Playwright se carga solo cuando hay algo que convertir y a proposito no es
// dependencia del proyecto: el deploy corre "npm ci" en cada push y no tiene
// por que bajarse un navegador para publicar. Si falta: npm i -D playwright
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const ORIGENES = join(RAIZ, '..', '_suitehub-marketing', 'casos');
const PUBLICO = join(RAIZ, 'public');
const FICHA = join(RAIZ, 'src', 'data', 'instalaciones.json');

// Las fotos se sirven a 1400 px de ancho: la tarjeta nunca pasa de ~470 px
// y con eso alcanza para pantallas de densidad doble.
const FOTO = { ancho: 1400, calidad: 0.82 };
const LOGO = { ancho: 512, calidad: 0.92 };

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const todo = process.argv.includes('--todo');

// La seccion "En sitio" promete fotos reales, asi que una imagen generada por un
// modelo no puede entrar aunque se vea bien. El manifiesto C2PA lo dice: los
// generadores firman con digitalSourceType = trainedAlgorithmicMedia.
//
// Este es el unico punto donde se puede revisar. Despues de convertir a WebP,
// "npm run strip-c2pa" borra ese manifiesto para no servir 5 KB de sobra por
// archivo, y con el se va la prueba.
function buscaC2PA(b) {
  if (b.readUInt32BE(0) === 0x89504e47) {
    let p = 8;
    while (p + 8 <= b.length) {
      const l = b.readUInt32BE(p);
      const t = b.toString('ascii', p + 4, p + 8);
      if (t === 'caBX') return b.subarray(p + 8, p + 8 + l);
      if (t === 'IEND') break;
      p += 12 + l;
    }
    return null;
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    const trozos = [];
    let p = 2;
    while (p + 4 <= b.length) {
      if (b[p] !== 0xff) { p++; continue; }
      const marca = b[p + 1];
      if (marca === 0xd9 || marca === 0xda) break;
      const l = b.readUInt16BE(p + 2);
      if (marca === 0xeb) trozos.push(b.subarray(p + 4, p + 2 + l));
      p += 2 + l;
    }
    return trozos.length ? Buffer.concat(trozos) : null;
  }
  if (b.toString('ascii', 0, 4) === 'RIFF') {
    let p = 12;
    while (p + 8 <= b.length) {
      const t = b.toString('ascii', p, p + 4);
      const l = b.readUInt32LE(p + 4);
      if (t === 'C2PA') return b.subarray(p + 8, p + 8 + l);
      p += 8 + l + (l % 2);
    }
  }
  return null;
}

function generadaPorIA(bytes) {
  const cab = buscaC2PA(bytes);
  if (!cab) return null;
  const s = cab.toString('latin1');
  if (!/trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia/.test(s)) return null;
  const agente = s.match(/dname([A-Za-z0-9.\-]{3,30})gversion/);
  return agente ? agente[1].replace(/^i/, '') : 'un generador de imagenes';
}

const instalaciones = JSON.parse(readFileSync(FICHA, 'utf8'));
const pendientes = [];
const avisos = [];

for (const sitio of instalaciones) {
  if (!sitio.origen) {
    avisos.push(`${sitio.slug}: sin bloque "origen", no se puede regenerar`);
    continue;
  }
  for (const [campo, ajustes] of [['foto', FOTO], ['logo', LOGO]]) {
    const origen = join(ORIGENES, sitio.origen[campo]);
    const destino = join(PUBLICO, sitio[campo]);
    if (!existsSync(origen)) {
      avisos.push(`${sitio.slug}: falta el original ${sitio.origen[campo]}`);
      continue;
    }
    const alDia = existsSync(destino) && statSync(destino).mtimeMs >= statSync(origen).mtimeMs;
    if (alDia && !todo) continue;
    pendientes.push({ sitio, campo, origen, destino, ajustes });
  }
}

if (!pendientes.length) {
  console.log(`Nada que hacer: las ${instalaciones.length} instalaciones ya tienen su WebP al dia.`);
} else {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('Hace falta Playwright para convertir las imagenes. Instalalo con:\n\n  npm i -D playwright\n');
    process.exit(1);
  }

  // El navegador propio de Playwright no esta instalado: se usa el Edge del sistema.
  const navegador = await chromium.launch({ channel: 'msedge' });
  const pagina = await navegador.newPage();

  for (const { sitio, campo, origen, destino, ajustes } of pendientes) {
    const bytes = readFileSync(origen);

    const generador = generadaPorIA(bytes);
    if (generador) {
      avisos.push(`${sitio.slug}: ${sitio.origen[campo]} la genero ${generador}, no una camara. No entra en "En sitio".`);
      continue;
    }

    const [ancho, alto, base64] = await pagina.evaluate(
      async ([datos, tipo, calidad, anchoMax]) => {
        const img = new Image();
        img.src = `data:${tipo};base64,` + datos;
        await img.decode();
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > anchoMax) {
          h = Math.round((h * anchoMax) / w);
          w = anchoMax;
        }
        const lienzo = document.createElement('canvas');
        lienzo.width = w;
        lienzo.height = h;
        const ctx = lienzo.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        return [w, h, lienzo.toDataURL('image/webp', calidad).split(',')[1]];
      },
      [bytes.toString('base64'), TIPOS[extname(origen).toLowerCase()], ajustes.calidad, ajustes.ancho],
    );

    mkdirSync(dirname(destino), { recursive: true });
    const buf = Buffer.from(base64, 'base64');
    writeFileSync(destino, buf);
    console.log(
      `${(sitio.slug + '/' + campo).padEnd(24)} ${String(ancho + 'x' + alto).padEnd(10)} ` +
        `${String(Math.round(buf.length / 1024)).padStart(4)} KB  (origen ${Math.round(bytes.length / 1024)} KB)`,
    );

    // El alto declarado en el HTML evita que la tarjeta salte al cargar.
    if (campo === 'logo' && (sitio.logoW !== ancho || sitio.logoH !== alto)) {
      avisos.push(`${sitio.slug}: el logo mide ${ancho}x${alto}, pero instalaciones.json dice ${sitio.logoW}x${sitio.logoH}`);
    }
  }

  await navegador.close();
}

if (avisos.length) {
  console.log('\nRevisar:');
  for (const a of avisos) console.log('  - ' + a);
  process.exit(1);
}
