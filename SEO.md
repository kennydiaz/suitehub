# SEO de suitehub.net — guía de puesta en marcha

Estado del **SEO técnico**: ✅ ya implementado en el código (titles/descriptions por página,
canonical, hreflang es/en, Open Graph, JSON-LD `Organization` + `LocalBusiness` + `SoftwareApplication`,
`FAQPage` en precios, `Article` + `BreadcrumbList` en el blog, sitemap i18n y `robots.txt`).

Lo que sigue **no es código** — son acciones que tú haces una vez en plataformas de Google.
Hazlas en este orden.

---

## 1. Google Search Console (imprescindible, ~15 min)

Es donde Google te dice por qué palabras apareces, en qué posición y qué errores ve.

1. Entra a <https://search.google.com/search-console> con la cuenta Google del negocio.
2. **Agregar propiedad → tipo "Dominio"** → escribe `suitehub.net`.
3. Google te da un **registro TXT** para el DNS. Agrégalo en tu proveedor de dominio
   (donde compraste suitehub.net) y espera la verificación (minutos a unas horas).
   - *Alternativa más rápida si no puedes tocar DNS:* usa el tipo "Prefijo de URL"
     (`https://suitehub.net`) y verifica con la etiqueta HTML (te paso cómo meterla en el
     `<head>` si eliges esta vía).
4. Una vez verificado: menú **Sitemaps** → envía `sitemap-index.xml`.
5. Usa **Inspección de URLs** para pedir indexación de la home y del primer artículo del blog.

> Tip: los datos tardan unos días en poblarse. No te asustes si al inicio sale vacío.

---

## 2. Google Business Profile / Perfil de Empresa (alto impacto local, ~20 min)

Para aparecer en Google Maps y en búsquedas tipo "software de facturación Panamá".

1. Entra a <https://business.google.com> con la cuenta del negocio.
2. Crea el perfil con el **nombre real** (SuiteHub / PROOQ S.A.), categoría
   "Empresa de software" o "Servicio de software".
3. Dirección: la de Panamá (Vía Argentina, Bella Vista). Si no atiendes público en sitio,
   puedes configurarlo como **negocio de servicio** (ocultas la dirección y defines área de cobertura).
4. Teléfono `+507 6632-6006`, sitio `https://suitehub.net`, horario de atención.
5. **Verificación**: Google pide confirmar por teléfono, correo o video. Hazlo.
6. Sube logo, foto de portada y 3-5 imágenes. Completa la descripción con tus keywords
   ("facturación electrónica DGI", "punto de venta", "gestión para PYMEs").
7. Pide **reseñas** a tus clientes actuales (QS Express, Clean Factory, etc.). Pesan mucho.

> El `LocalBusiness` que ya está en el sitio y este perfil se refuerzan mutuamente.

---

## 3. Bing Webmaster Tools (opcional, 5 min)

Importa directo desde Search Console: <https://www.bing.com/webmasters>. Gratis, suma algo de tráfico.

---

## 4. Mantenimiento de contenido (lo que mueve la aguja a mediano plazo)

- **Publica en el blog con regularidad.** Cada artículo nuevo = otra puerta de entrada desde Google.
  Crea un `.md` en `src/content/blog/` (mira `facturacion-electronica-dgi-panama.md` como plantilla).
- Apunta a búsquedas reales de tus clientes:
  - "facturación electrónica DGI Panamá" ✅ (ya publicado)
  - "cómo elegir un POS para restaurante"
  - "sistema de inventario para PYME"
  - "qué es un PAC y cuál elegir en Panamá"
  - "facturación electrónica para talleres / carwash / clínicas"
- Enlaza entre artículos y hacia las páginas de producto (enlazado interno).
- Revisa Search Console cada 2-3 semanas: si una página aparece en posición 8-15 para una
  palabra, mejórala (más contenido, mejor título) para subir a la primera página.

---

## Cómo agregar un nuevo artículo al blog

1. Crea `src/content/blog/mi-slug.md` (es) y opcionalmente `src/content/blog/my-slug-en.md` (en).
2. Frontmatter mínimo:
   ```yaml
   ---
   title: "Título con la keyword"
   description: "Resumen de 1-2 frases (sale en Google y al compartir)."
   lang: "es"            # o "en"
   slug: "mi-slug"       # define la URL: /blog/mi-slug
   pubDate: 2026-06-01
   tags: ["punto de venta", "Panamá"]
   heroImage: "/images/..."   # opcional
   ---
   ```
3. Escribe el cuerpo en Markdown. Aparece solo en `/blog` (es) o `/en/blog` (en),
   con su JSON-LD `Article` y migas de pan ya generados.
4. `git push` → se despliega solo. El sitemap se regenera con la nueva URL.
