/**
 * catalog.ts — lectura del catálogo de precios SuiteHub.
 *
 * Fuente única de verdad: el panel (suitehub-panel/src/Catalog.php), expuesto como
 * JSON público. Este módulo lo lee en BUILD-TIME desde ese endpoint y, si no está
 * disponible (panel caído, sin red en CI), cae a la copia local de respaldo
 * src/data/catalogo.json — que es un espejo del mismo catálogo.
 *
 * Para apuntar a otro endpoint en build: PUBLIC_CATALOG_URL en el entorno.
 */

import fallback from '../data/catalogo.json';

const ENDPOINT = import.meta.env.PUBLIC_CATALOG_URL || 'https://panel.suitehub.net/?r=catalog/json';

let _cache: any = null;

/** Catálogo completo (ediciones, verticales, especiales, addons, deltas_modulo, meta). */
export async function getCatalog(): Promise<any> {
  if (_cache) return _cache;
  try {
    // Timeout para que un panel lento/caído no congele el build (→ respaldo local).
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(ENDPOINT, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    _cache = await res.json();
    console.info('[catalog] cargado desde el panel →', ENDPOINT);
  } catch (err) {
    console.warn('[catalog] panel no disponible; uso copia local de respaldo:', (err as Error)?.message ?? err);
    _cache = fallback;
  }
  return _cache;
}

/** Ediciones indexadas por key: { lite, core, pro, enterprise }. */
export async function getEdiciones(): Promise<Record<string, any>> {
  const cat = await getCatalog();
  return Object.fromEntries((cat.ediciones || []).map((e: any) => [e.key, e]));
}
