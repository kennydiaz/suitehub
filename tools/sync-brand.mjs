/**
 * sync-brand.mjs — trae el kit de marca SuiteHub a este repo.
 *
 * Uso:
 *   node tools/sync-brand.mjs [ruta-del-kit] [--dry-run]
 *   node tools/sync-brand.mjs --check        (no necesita el kit; sirve en CI)
 *
 * Por defecto busca ../_suitehub-brand, hermano de este repo.
 *
 * Copia dos cosas:
 *   1. el badge de cada producto  -> public/images/products/<slug>/badge.svg
 *      Para toda carpeta que YA existe y cuyo producto está en el kit, tenga o no badge
 *      todavía: no inventa carpetas, pero un vertical nuevo recibe el suyo en el primer sync.
 *      --check falla si una carpeta de un producto del kit se quedó sin badge.
 *   2. dist/brand.json            -> src/data/brand.json
 *
 * Todo lo copiado es COPIA: la fuente de verdad es el brand kit. Al copiar un
 * SVG se limpia lo que no aporta al render (prólogo XML, <metadata> con
 * manifiestos C2PA, el namespace c2pa), que si no se cuela y multiplica por
 * ocho el peso del archivo servido.
 *
 * Por qué se vendoriza en vez de leer el kit en build-time: deploy.yml corre en
 * ubuntu-latest con solo el checkout de este repo, así que el kit no existe
 * durante el build. Lo copiado se commitea.
 *
 * Espejo del tools/sync-brand.php del panel, que hace lo mismo para PHP.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = dirname(dirname(fileURLToPath(import.meta.url)));
const PRODUCTS = join(BASE, 'public/images/products');
const TOKENS_LOCAL = join(BASE, 'src/data/brand.json');

// La carpeta del sitio no siempre se llama igual que el slug del kit.
const SLUG_KIT = { suite: 'suitehub' };

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const soloCheck = args.includes('--check');
const rutas = args.filter((a) => !a.startsWith('--'));
const kit = resolve(rutas[0] ?? join(BASE, '../_suitehub-brand'));

/** Limpia un SVG del kit: sin BOM, sin prólogo XML, sin metadata C2PA. */
function limpiarSvg(raw) {
  return (
    raw
      .replace(/^﻿/, '')
      .replace(/<\?xml[^>]*\?>\s*/, '')
      .replace(/<metadata\b[^>]*>[\s\S]*?<\/metadata>\s*/g, '')
      .replace(/\s+xmlns:c2pa="[^"]*"/g, '')
      .trim() + '\n'
  );
}

/** Escribe si cambió. Devuelve '+' (nuevo), '~' (actualizado) o '' (igual). */
function poner(dest, contenido) {
  const previo = existsSync(dest) ? readFileSync(dest, 'utf8') : null;
  if (previo === contenido) return '';
  if (!dryRun) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, contenido);
  }
  return previo === null ? '+' : '~';
}

/**
 * Carpetas de producto del sitio, con su slug en el kit, TENGAN O NO badge todavía.
 *
 * Antes solo se miraban las que ya tenían badge.svg, así que la carpeta de un vertical
 * nuevo nunca recibía el suyo: pasó con ship (sep 2026), que salió en la portada y en
 * /verticales con la imagen rota mientras --check decía que todo estaba al día.
 */
function productosDelSitio() {
  return readdirSync(PRODUCTS)
    .filter((d) => statSync(join(PRODUCTS, d)).isDirectory())
    .map((carpeta) => ({
      carpeta,
      slug: SLUG_KIT[carpeta] ?? carpeta,
      tieneBadge: existsSync(join(PRODUCTS, carpeta, 'badge.svg')),
    }));
}

const colorDe = (svg) => (svg.match(/fill="(#[0-9A-Fa-f]{6})"/) ?? [])[1]?.toUpperCase() ?? null;

// ── --check: valida el repo contra src/data/brand.json, sin necesitar el kit ──
if (soloCheck) {
  if (!existsSync(TOKENS_LOCAL)) {
    console.error('No existe src/data/brand.json. Corre primero: node tools/sync-brand.mjs');
    process.exit(1);
  }
  const { products } = JSON.parse(readFileSync(TOKENS_LOCAL, 'utf8'));
  const problemas = [];

  for (const { carpeta, slug, tieneBadge } of productosDelSitio()) {
    const esperado = products[slug]?.color?.toUpperCase();

    if (!tieneBadge) {
      // Una carpeta de un producto del kit sin badge es una imagen rota en las páginas,
      // que lo piden por /images/products/<slug>/badge.svg. Una carpeta que no es de un
      // producto del kit (solo capturas, por ejemplo) no necesita badge.
      if (esperado) problemas.push(`${carpeta}: falta badge.svg (las páginas lo piden y saldría roto)`);
      continue;
    }
    const svg = readFileSync(join(PRODUCTS, carpeta, 'badge.svg'), 'utf8');

    if (!esperado) {
      problemas.push(`${carpeta}: no existe el slug "${slug}" en los tokens`);
      continue;
    }
    const actual = colorDe(svg);
    if (actual && actual !== esperado) {
      problemas.push(`${carpeta}: badge ${actual}, el kit dice ${esperado}`);
    }
    if (/c2pa|<metadata/i.test(svg)) {
      problemas.push(`${carpeta}: el badge arrastra metadata C2PA (${svg.length} B)`);
    }
  }

  if (problemas.length) {
    console.error(`La marca no cuadra (${problemas.length}):`);
    problemas.forEach((p) => console.error('  · ' + p));
    console.error('\nCorre: node tools/sync-brand.mjs');
    process.exit(1);
  }
  console.log('Marca al día con src/data/brand.json.');
  process.exit(0);
}

// ── Sincronización desde el kit ──────────────────────────────────────────────
for (const req of ['badges/svg', 'dist']) {
  if (!existsSync(join(kit, req))) {
    console.error(`No encuentro ${req}/ en: ${kit}`);
    console.error('Pasa la ruta del kit como primer argumento.');
    process.exit(1);
  }
}

let total = 0;
const informar = (marca, etiqueta, contenido) => {
  if (!marca) return;
  console.log(`  ${marca} ${etiqueta} (${contenido.length.toLocaleString('es')} B)`);
  total++;
};

// 1. El badge de cada producto que tiene carpeta en el sitio, aunque todavía no tenga
//    badge: basta con crear la carpeta del vertical para que el sync le traiga el suyo.
for (const { carpeta, slug, tieneBadge } of productosDelSitio()) {
  const src = join(kit, 'badges/svg', `hub-${slug}-badge.svg`);
  if (!existsSync(src)) {
    // Sin badge ni en el sitio ni en el kit, la carpeta no es de un producto: nada que avisar.
    if (tieneBadge) console.log(`  ! products/${carpeta}/badge.svg: no hay hub-${slug}-badge.svg en el kit`);
    continue;
  }
  const limpio = limpiarSvg(readFileSync(src, 'utf8'));
  const dest = join(PRODUCTS, carpeta, 'badge.svg');
  informar(poner(dest, limpio), `products/${carpeta}/badge.svg`, limpio);
}

// 2. Los tokens, para que --check funcione sin el kit delante.
const tokens = join(kit, 'dist/brand.json');
if (!existsSync(tokens)) {
  console.log('  ! falta dist/brand.json en el kit (corre `py tools/brand.py dist` allá)');
} else {
  const contenido = readFileSync(tokens, 'utf8');
  informar(poner(TOKENS_LOCAL, contenido), 'src/data/brand.json', contenido);
}

const sufijo = dryRun ? ' (--dry-run: no se escribió nada)' : '';
console.log(total ? `\nSincronizados ${total} archivo(s) desde ${kit}${sufijo}` : `\nTodo al día con ${kit}`);
