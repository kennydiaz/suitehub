// Audita las fotos que mandan los clientes antes de meterlas al sitio.
//
//   npm run revisa-fotos                 revisa _suitehub-marketing/casos
//   npm run revisa-fotos -- <carpeta>    revisa otra carpeta
//
// Sale con codigo 1 si encuentra alguna imagen generada por un modelo, que es
// lo que no puede entrar en la seccion "En sitio" de /casos.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { procedencia } from './lib/c2pa.mjs';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const carpeta = process.argv[2] || join(RAIZ, '..', '_suitehub-marketing', 'casos');

if (!existsSync(carpeta)) {
  console.error(`No existe la carpeta: ${carpeta}`);
  process.exit(2);
}

const imagenes = [];
(function recorre(dir) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) recorre(ruta);
    else if (/\.(png|jpe?g|webp)$/i.test(entrada)) imagenes.push(ruta);
  }
})(carpeta);

if (!imagenes.length) {
  console.log(`Sin imagenes en ${carpeta}`);
  process.exit(0);
}

const filas = imagenes.map((ruta) => [relative(carpeta, ruta).replace(/\\/g, '/'), procedencia(readFileSync(ruta))]);
const ancho = Math.max(...filas.map((f) => f[0].length));
const generadas = [];

for (const [nombre, p] of filas) {
  if (p.estado === 'generada') {
    generadas.push(nombre);
    console.log(`  ✗ ${nombre.padEnd(ancho)}  GENERADA POR IA (${p.detalle})`);
  } else if (p.estado === 'firmada') {
    console.log(`  ? ${nombre.padEnd(ancho)}  ${p.detalle}`);
  } else {
    console.log(`  · ${nombre.padEnd(ancho)}  camara`);
  }
}

console.log(`\n${filas.length} imagenes, ${generadas.length} generadas por un modelo.`);
if (generadas.length) {
  console.log('Esas no pueden ir en "En sitio": la seccion promete fotos reales del local.');
  process.exit(1);
}
console.log('Todas sirven. Falta revisar a ojo: datos de clientes finales en pantalla,');
console.log('caras identificables, avisos de trial y marcas de agua del sistema operativo.');
