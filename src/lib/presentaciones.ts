/**
 * presentaciones.ts — el copy de las páginas de cada vertical (/verticales/<slug>).
 *
 * Fuente única: el panel (content/presentaciones/<slug>.json), expuesto como JSON
 * público en ?r=presentations/json. Igual que catalog.ts: se lee en BUILD-TIME desde el
 * endpoint y, si no responde (panel caído, sin red en CI), cae a la copia de respaldo
 * src/data/presentaciones.json, que el botón "Publicar al sitio" del panel mantiene al día.
 *
 * El JSON se valida con zod. Un producto `publicado` que no valida ROMPE el build: es
 * preferible a desplegar una página a medias. Uno en borrador que no valida solo avisa.
 *
 * Para apuntar a otro endpoint en build: PUBLIC_PRESENTACIONES_URL en el entorno.
 */

import { z } from 'astro/zod';
import fallback from '../data/presentaciones.json';

const ENDPOINT = import.meta.env.PUBLIC_PRESENTACIONES_URL || 'https://panel.suitehub.net/?r=presentations/json';
const SITIO = 'https://suitehub.net';

/** Texto plano o partido para resaltar una parte: { antes, destacado, despues }. */
const Partes = z.union([
  z.string(),
  z.object({ antes: z.string().default(''), destacado: z.string().default(''), despues: z.string().default('') }),
]);

const Item = z.object({ icono: z.string(), titulo: z.string().min(1), texto: z.string().default('') });

/**
 * Una pantalla del recorrido. `tipo` elige el marco: desktop y tablet en navegador,
 * movil en teléfono, ticket como papel angosto. `grupo` abre un subtítulo cuando cambia
 * respecto a la anterior. `correo` solo lo usa el panel (qué capturas lleva el correo).
 */
const Captura = z.object({
  imagen: z.string().min(1),
  tipo: z.enum(['desktop', 'movil', 'ticket', 'tablet']),
  grupo: z.string().optional(),
  correo: z.boolean().optional(),
  ancho: z.number().int().positive(),
  alto: z.number().int().positive(),
  titulo: z.string().min(1),
  texto: z.string().default(''),
  puntos: z.array(z.string()).default([]),
});

const Bloque = z.object({
  titulo: z.string().min(1),
  eyebrow: z.string().default(''),
  titular: Partes.optional(),
  tagline: z.string().min(1),
  intro: z.string().default(''),
  chips: z.array(z.string()).default([]),
  url_label: z.string().optional(),
  problema: z.string().default(''),
  solucion: Partes.default(''),
  solucion_sub: z.string().default(''),
  recorrido_titulo: z.string().default(''),
  recorrido: z.array(Captura).default([]),
  funciones_eyebrow: z.string().default(''),
  funciones_titulo: z.string().default(''),
  funciones: z.array(Item).default([]),
  funciones_nota: z.string().default(''),
  adicionales: z.object({
    eyebrow: z.string().default(''),
    titulo: z.string().min(1),
    intro: z.string().default(''),
    etiqueta: z.string().default(''),
    items: z.array(Item).min(1),
  }).optional(),
  hardware: z.object({
    eyebrow: z.string().default(''),
    titulo: z.string().min(1),
    texto: z.string().default(''),
    puntos: z.array(z.string()).default([]),
    nota: z.string().default(''),
    pasos: z.array(z.object({
      icono: z.string(),
      titulo: z.string(),
      sub: z.string().default(''),
      flecha: z.string().optional(),
    })).default([]),
  }).optional(),
  hablemos: z.object({ titulo: z.string().min(1), texto: z.string().default('') }).optional(),
  beneficios: z.array(z.string()).default([]),
  cta: z.object({ titular: Partes, texto: z.string().default('') }).optional(),
  cierre: z.string().default(''),
  seo: z.object({ title: z.string().default(''), description: z.string().default('') }).default({}),
  wa_text: z.string().default(''),
  wa_demo: z.string().default(''),
});

const Producto = z.object({
  slug: z.string().min(1),
  nombre: z.string().default(''),
  publicado: z.boolean(),
  acento: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#1582F5'),
  imagenes_base: z.string().min(1),
  sitio: z.object({ es: z.string(), en: z.string() }),
  hero: z.object({
    imagen: z.string().min(1),
    ancho: z.number().int().positive(),
    alto: z.number().int().positive(),
    portada: z.boolean().optional(),
    fondo: z.string().optional(),
  }).nullable(),
  es: Bloque,
  en: Bloque.optional(),
});

export type Idioma = 'es' | 'en';
export type Producto = z.infer<typeof Producto>;
export type Bloque = z.infer<typeof Bloque>;
export type Partes = z.infer<typeof Partes>;

/** Además del esquema: lo que una página publicada necesita sí o sí. */
function faltantesPublicado(p: Producto): string[] {
  const f: string[] = [];
  if (!p.hero) f.push('hero');
  for (const lang of ['es', 'en'] as const) {
    const b = p[lang];
    if (!b) { f.push(`bloque ${lang}`); continue; }
    if (b.recorrido.length === 0) f.push(`${lang}.recorrido vacío`);
    if (b.funciones.length === 0) f.push(`${lang}.funciones vacío`);
  }
  return f;
}

function validar(crudo: unknown, origen: string): Record<string, Producto> {
  const productos = (crudo as any)?.productos;
  if (!productos || typeof productos !== 'object') {
    throw new Error(`[presentaciones] ${origen}: no trae "productos"`);
  }
  const ok: Record<string, Producto> = {};
  const rotos: string[] = [];
  for (const [slug, dato] of Object.entries(productos)) {
    const r = Producto.safeParse(dato);
    const publicado = (dato as any)?.publicado === true;
    const problemas = r.success
      ? (r.data.publicado ? faltantesPublicado(r.data) : [])
      : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    if (problemas.length === 0 && r.success) {
      ok[slug] = r.data;
    } else if (publicado) {
      rotos.push(`${slug} → ${problemas.join('; ')}`);
    } else {
      console.warn(`[presentaciones] ${slug} (borrador) no valida, se omite: ${problemas.join('; ')}`);
    }
  }
  if (rotos.length) {
    throw new Error(`[presentaciones] ${origen}: presentaciones publicadas que no validan:\n  ${rotos.join('\n  ')}`);
  }
  return ok;
}

let _cache: Record<string, Producto> | null = null;

/** Todas las presentaciones válidas (publicadas y borradores), por slug, en el orden del panel. */
export async function getPresentaciones(): Promise<Record<string, Producto>> {
  if (_cache) return _cache;
  let crudo: unknown;
  let origen = 'respaldo local';
  try {
    // Timeout para que un panel lento/caído no congele el build (→ respaldo local).
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(ENDPOINT, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    crudo = await res.json();
    if (!(crudo as any)?.productos) throw new Error('respuesta sin "productos"');
    origen = ENDPOINT;
    console.info('[presentaciones] cargado desde el panel →', ENDPOINT);
  } catch (err) {
    console.warn('[presentaciones] panel no disponible; uso copia local de respaldo:', (err as Error)?.message ?? err);
    crudo = fallback;
  }
  // Si el panel respondió pero algo publicado no valida, el build falla (no se cae al respaldo).
  _cache = validar(crudo, origen);
  return _cache;
}

/** Solo las que tienen página en el sitio. */
export async function getPublicadas(): Promise<Producto[]> {
  return Object.values(await getPresentaciones()).filter((p) => p.publicado);
}

/** El bloque de un idioma; sin bloque `en`, el de `es`. */
export function bloque(p: Producto, lang: Idioma): Bloque {
  return (lang === 'en' ? p.en : undefined) ?? p.es;
}

/** Ruta de una imagen del producto. Las del propio sitio quedan relativas (sirven igual en local). */
export function imagen(p: Producto, archivo: string): string {
  const base = p.imagenes_base.startsWith(SITIO) ? p.imagenes_base.slice(SITIO.length) : p.imagenes_base;
  return base.replace(/\/?$/, '/') + archivo;
}

/** Partes normalizadas de un texto resaltable. */
export function partes(v: Partes | undefined): { antes: string; destacado: string; despues: string } {
  if (v === undefined) return { antes: '', destacado: '', despues: '' };
  return typeof v === 'string' ? { antes: v, destacado: '', despues: '' } : v;
}

/** Ruta de la página del vertical en el sitio (relativa). */
export function ruta(slug: string, lang: Idioma): string {
  return lang === 'en' ? `/en/verticals/${slug}` : `/verticales/${slug}`;
}
