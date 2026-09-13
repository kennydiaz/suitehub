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
import { generadaPorIA } from './lib/c2pa.mjs';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const ORIGENES = join(RAIZ, '..', '_suitehub-marketing', 'casos');
const PUBLICO = join(RAIZ, 'public');
const FICHA = join(RAIZ, 'src', 'data', 'instalaciones.json');

// Las fotos se sirven a 1400 px de ancho: la tarjeta nunca pasa de ~470 px
// y con eso alcanza para pantallas de densidad doble.
//
// Una entrada puede pedir menos con "anchoFoto". Sirve cuando la pantalla que
// sale en la foto tiene letra chica que no conviene publicar legible, como una
// columna de precios de compra: a 1000 px la tarjeta se ve igual de bien y esa
// letra deja de leerse. Es recortar resolucion, no retocar la imagen.
const FOTO = { ancho: 1400, calidad: 0.82 };
const LOGO = { ancho: 512, calidad: 0.92 };

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const todo = process.argv.includes('--todo');

const instalaciones = JSON.parse(readFileSync(FICHA, 'utf8'));
const pendientes = [];
const avisos = [];

for (const sitio of instalaciones) {
  if (!sitio.origen) {
    avisos.push(`${sitio.slug}: sin bloque "origen", no se puede regenerar`);
    continue;
  }
  const deFoto = sitio.anchoFoto ? { ...FOTO, ancho: sitio.anchoFoto } : FOTO;
  // El logo es opcional: hay negocios que todavia no nos han pasado el suyo.
  const campos = sitio.logo ? [['foto', deFoto], ['logo', LOGO]] : [['foto', deFoto]];
  for (const [campo, ajustes] of campos) {
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
