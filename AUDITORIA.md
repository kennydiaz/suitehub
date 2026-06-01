# Auditoría SuiteHub — Rendimiento · SEO · Marca

**Sitio:** `suitehub.net` (Astro 5 + Tailwind, bilingüe ES/EN)
**Fecha:** 2026-05-31
**Alcance:** revisión sin modificar código. Hallazgos priorizados por impacto/esfuerzo.

---

## Resumen ejecutivo

El sitio está **bien construido**. El SEO técnico es de los más completos que se ven en una PyME (canonical, hreflang, JSON-LD múltiple, sitemap i18n, robots), la arquitectura i18n es limpia y la marca corporativa (navy/brand) está bien aplicada.

El margen de mejora real está concentrado en **rendimiento** (imágenes sin optimizar + Font Awesome completo cargado de forma render-blocking) y en **una contradicción de marca**: la guía pide iconografía *outline* y el sitio usa Font Awesome *solid* en todo. Esos dos puntos se arreglan juntos y suben Lighthouse + alinean la marca al mismo tiempo.

**Top 3 que mueven la aguja:**
1. Optimizar imágenes (la mayor de 871 KB se muestra a 128 px). — alto impacto, esfuerzo medio
2. Reemplazar Font Awesome CDN por iconos *outline* locales (Tabler). — alto impacto perf + marca, esfuerzo medio
3. Auto-alojar las fuentes de Google. — impacto medio, esfuerzo bajo

---

## 1. Rendimiento

### 1.1 Imágenes sin optimizar — PRIORIDAD ALTA
El sitio no usa la optimización de imágenes de Astro (`astro:assets` / `<Image>`); todo se sirve crudo desde `/public`. Hay archivos muy pesados mostrados a tamaños diminutos:

| Archivo | Peso | Se muestra a | Problema |
|---|---|---|---|
| `cleanfactory.png` | **871 KB** | 128 px (`w-32`) | PNG enorme, debería ser webp ~15 KB |
| `prooq02.png` | 205 KB | pequeño | PNG → webp |
| `hubcore.png` | 200 KB | — | PNG → webp |
| `hubcore2.png` | 155 KB | — | PNG → webp |
| `kmslogo.jpeg` | 79 KB | 128 px (orig. 966×1600) | sobredimensionado 12× |
| `prooq01.png` | 84 KB | — | PNG → webp |

**Impacto:** `cleanfactory.png` por sí solo es ~40% del peso total del sitio (3.2 MB de `dist`). Penaliza LCP, sobre todo en móvil/3G, justo en la página de casos (prueba social, alta intención de compra).

**Recomendación:** convertir a webp y redimensionar al tamaño real de uso (~2× para retina). Idealmente migrar estas imágenes de `/public` a `src/assets/` y usar `<Image>`/`<Picture>` de Astro para que genere `srcset` y formatos modernos automáticamente. Ahorro estimado: **~1.3 MB → ~80 KB**.

### 1.2 Font Awesome completo desde CDN — PRIORIDAD ALTA
`BaseLayout` carga `font-awesome/6.4.2/css/all.min.css` desde cdnjs como hoja de estilo **render-blocking**. Trae el set completo (~70 KB CSS + archivos de fuente woff2) para usar un subconjunto de íconos. Además es un tercer dominio que bloquea el primer render.

**Recomendación:** migrar a iconos locales (ver punto 3.1 de Marca — además resuelve el conflicto outline/solid). Con `astro-icon` los SVG se inline-an solo los que se usan, sin CSS de terceros ni round-trip de red. Ahorro: elimina una petición render-blocking + ~70 KB.

### 1.3 Fuentes de Google render-blocking — PRIORIDAD MEDIA
Inter + Sora se cargan vía `<link rel="stylesheet">` a `fonts.googleapis.com`. Hay `preconnect` (bien), pero sigue siendo un recurso bloqueante de un tercero que retrasa el LCP del texto.

**Recomendación:** auto-alojar con `@fontsource/inter` y `@fontsource/sora` (se bundlean con el sitio, mismo origen, `font-display: swap`). Quita 2 conexiones externas y mejora estabilidad del LCP. Esfuerzo bajo.

### 1.4 Observaciones menores
- Dos sistemas de analítica simultáneos (GA4 + pixel propio a `panel.suitehub.net`). Funciona, pero son 2 cargas. Considera dejar solo uno si no usas ambos.
- `inlineStylesheets: 'auto'` y `applyBaseStyles: false` ya están bien configurados. ✅
- Faltan atributos `loading="lazy"` en algunas imágenes de `casos.astro` (sí están en los badges de la home). Bajo impacto.

---

## 2. SEO

**Estado: muy bueno.** El SEO técnico ya está implementado y bien:
- ✅ `title`/`description` por página y por idioma
- ✅ `canonical` correcto
- ✅ `hreflang` es/en + `x-default` → ES
- ✅ Open Graph + Twitter Card completos
- ✅ JSON-LD: `SoftwareApplication`, `Organization`, `LocalBusiness` (+ `FAQPage`, `Article`, `BreadcrumbList` en sus páginas)
- ✅ Sitemap i18n (`@astrojs/sitemap`) + `robots.txt` apuntando al sitemap
- ✅ Estructura de URLs limpia y traducida (`/precios` ↔ `/en/pricing`)

### Hallazgos
- **Falta página 404 personalizada** (`src/pages/404.astro`). Prioridad baja, pero mejora UX y retención de enlaces rotos. — esfuerzo bajo
- `lastmod` del sitemap usa la fecha de build para todas las URLs. Aceptable, pero usar la fecha real de cada contenido (sobre todo blog) es más preciso para Google. — opcional
- El SEO **off-page** (Search Console, Google Business Profile, Bing) sigue pendiente según `SEO.md`. Eso es lo que falta para resultados reales — no es código, son acciones en plataformas. Es el mayor ROI de SEO ahora mismo.

**Conclusión SEO:** poco que tocar en código. La palanca real es publicar en el blog con regularidad y completar el alta en Search Console + Google Business Profile.

---

## 3. Consistencia de marca

Comparado con la guía en `_suitehub-brand`.

### 3.1 Iconografía: contradice la guía — PRIORIDAD ALTA
La guía (`README.md`, `LOGO.md`) es explícita: **iconografía outline / line icons (Tabler, Lucide, Phosphor)** y evitar el "look genérico tipo Bootstrap". El sitio usa **Font Awesome solid** (relleno) en toda la interfaz: ~298 usos de `fa-solid`. Esto contradice directamente el sistema de marca.

**Recomendación:** migrar a Tabler Icons (outline) vía `astro-icon`. Resuelve el conflicto de marca **y** el problema de rendimiento 1.2 en un solo cambio. Es la acción de mayor retorno combinado del proyecto.

### 3.2 Documentación de marca desactualizada — PRIORIDAD MEDIA
La guía describe a la empresa como **"PROOQ S.A. · Panamá"** y a SuiteHub como *"software premium para PyMEs panameñas"*. El sitio en vivo refleja una posición distinta y más amplia: **PROOQ LLC (USA)**, multi-país (PA / US / VE / ES), facturación multi-jurisdicción. La marca documentada quedó atrás respecto del producto real.

**Recomendación:** actualizar `_suitehub-brand/README.md` y `PRODUCTS.md` para reflejar PROOQ LLC, alcance multi-país y el roadmap 2026. Mantiene la fuente de verdad alineada con el sitio.

### 3.3 Docs pendientes que el sitio ya resolvió — PRIORIDAD BAJA
`TYPOGRAPHY.md` y `COMPONENTS.md` están marcados como *pendientes* en la guía, pero el sitio ya tiene un sistema tipográfico consistente (Inter + Sora) y componentes definidos (`.btn`, `.card-glass`, `.eyebrow`, hexágono). Oportunidad fácil: documentar en la guía lo que el sitio ya implementa, para cerrar esos pendientes.

### 3.4 Lo que está bien ✅
- Paleta navy/brand correctamente aplicada (es la corporativa PROOQ, correcta para el sitio paraguas SuiteHub).
- Tipografía Inter + Sora coincide con la guía.
- Logo hexagonal (`badge.svg`) usado consistentemente en header y footer.
- Contraste y modo oscuro coherentes con la filosofía "paletas oscuras con acentos saturados".

---

## Plan priorizado (impacto / esfuerzo)

| # | Acción | Área | Impacto | Esfuerzo |
|---|---|---|---|---|
| 1 | Optimizar/convertir imágenes a webp + redimensionar | Perf | 🔴 Alto | Medio |
| 2 | Migrar Font Awesome → Tabler outline (astro-icon) | Perf + Marca | 🔴 Alto | Medio |
| 3 | Auto-alojar fuentes (Fontsource) | Perf | 🟡 Medio | Bajo |
| 4 | Actualizar docs de marca (LLC/USA, multi-país) | Marca | 🟡 Medio | Bajo |
| 5 | Agregar página 404 personalizada | SEO/UX | 🟢 Bajo | Bajo |
| 6 | Completar TYPOGRAPHY.md / COMPONENTS.md | Marca | 🟢 Bajo | Bajo |
| 7 | (Off-code) Search Console + Google Business Profile | SEO | 🔴 Alto | Bajo |

**Sugerencia de orden de ejecución:** 1 → 2 → 3 son un solo bloque de "performance + marca" con el mayor retorno. El 7 lo haces tú en paralelo (no requiere código) y es el que más mueve el SEO real.

---

*Auditoría sin cambios en el código. Cuando quieras, empiezo a implementar por el punto que prefieras.*
