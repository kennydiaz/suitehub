# SuiteHub — Sitio corporativo (suitehub.net)

Sitio marketing de **SuiteHub** — suite empresarial multi-jurisdicción para PYMEs en **Panamá, USA, Venezuela y España**. Producto de **PROOQ LLC** (USA), operado en Panamá por **PROOQ S.A.** Hoy clientes en producción real en Panamá; soft launch en USA, Venezuela y España con lanzamiento comercial pleno previsto para 2026.

100% estático con Astro 5 + Tailwind 3. Bilingüe (ES default + EN bajo `/en/`). Deploy a Hostinger.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Generador | Astro 5 (output: `static`) |
| CSS | Tailwind 3 vía `@astrojs/tailwind` + `@tailwindcss/typography` |
| Sitemap | `@astrojs/sitemap` con i18n |
| Tipografía | Sora (display) + Inter (body) — Google Fonts |
| Iconos | Font Awesome 6.4.2 (cdnjs CDN) |
| Backend | Ninguno — CTAs van a WhatsApp / email |

---

## Estructura

```
web/
├── astro.config.mjs        # i18n (es/en), site URL, sitemap
├── tailwind.config.mjs     # Paleta brand (azul) + navy + ink
├── package.json
│
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # SEO + OG + JSON-LD + hreflang + html lang dinámico
│   ├── components/
│   │   ├── Header.astro        # Nav locale-aware + switcher ES/EN
│   │   └── Footer.astro        # Locale-aware
│   ├── i18n/
│   │   ├── ui.ts               # Diccionario UI + map de routes por locale
│   │   └── utils.ts            # getLocaleFromUrl, useTranslations, alternateHref
│   ├── pages/
│   │   ├── index.astro         # Home ES
│   │   ├── productos.astro
│   │   ├── precios.astro
│   │   ├── verticales.astro    # 13 verticales especializados
│   │   ├── casos.astro         # QS Express + Clean Factory (casos reales)
│   │   ├── sobre.astro
│   │   ├── contacto.astro
│   │   ├── privacidad.astro    # Ley 81 PA + GDPR-aligned
│   │   ├── terminos.astro
│   │   └── en/                 # 9 páginas espejo en inglés (slugs ingleses)
│   │       ├── index.astro
│   │       ├── products.astro
│   │       ├── pricing.astro
│   │       ├── verticals.astro
│   │       ├── cases.astro
│   │       ├── about.astro
│   │       ├── contact.astro
│   │       ├── privacy.astro
│   │       └── terms.astro
│   └── styles/global.css       # Tailwind base + componentes (.btn, .card-glass, etc.)
│
├── public/
│   ├── robots.txt              # Apunta al sitemap
│   ├── favicons/               # Set único: 16/32/64/128/192/512 + favicon-hex.svg
│   └── images/
│       ├── products/{key}/     # 18 productos (logos en svg/png multi-resolución)
│       ├── cleanfactory.png    # Logo cliente real
│       └── tallerqsexpress.png # Logo cliente real
│
└── dist/                       # Output de build (no versionar — regenerable)
```

---

## Workflow

```bash
npm install
npm run dev       # Servidor local en http://localhost:4321
npm run build     # Genera dist/ estático
npm run preview   # Sirve dist/ localmente
```

---

## Identidad visual

- **Paleta**: navy `#0A2540` + brand azul `#1582F5` (alineado con Hub Core / Hub Pro). Escala completa `brand-50` → `brand-950`.
- **Logo header** (clase `h-14`, ~56px) y footer: `/images/products/suite/dark.svg` (versión paraguas SuiteHub)
- **Dark theme único**
- **Moneda en UI**: `$` (USD/PAB paritario)

## Vocabulario

- ❌ "tier" → ✅ **"edición"** (Edición Lite/Core/Pro/Enterprise)
- ❌ "SaaS" → ✅ **"suite empresarial"** o **"plataforma de gestión"**

---

## i18n

- `defaultLocale: 'es'`, `locales: ['es','en']`, `prefixDefaultLocale: false` (ES sin prefijo, EN bajo `/en/`)
- Slugs distintos por locale (ES: `/productos`, EN: `/en/products`) definidos en `src/i18n/ui.ts → routes`
- Switcher ES/EN en header navega a la página equivalente vía `alternateHref()`
- `BaseLayout.astro` emite `<html lang>` dinámico, hreflang alternates (`es`/`en`/`x-default`), OG locale por idioma
- JSON-LD bilingüe en `<head>` (offers en español o inglés según locale)
- Contenido marketing pesado vive directo en cada `*.astro` — el diccionario UI es solo para chrome (header/footer/CTAs)

---

## Deploy a Hostinger

1. **Build**: `npm run build` genera `dist/`.
2. **Subir contenido** de `dist/` (no la carpeta misma) al `public_html/` del dominio `suitehub.net` por FTP o File Manager.
3. **HTTPS Let's Encrypt** ya viene incluido en Hostinger — verificar que esté activo.
4. **Submit** `https://suitehub.net/sitemap-index.xml` a Google Search Console post-deploy.
5. **Verificar**: home `/`, locale switcher → `/en/`, `/sitemap-index.xml`, `/robots.txt`.

> 100% estático: no requiere PHP, MySQL ni Node en el servidor.

---

## Analytics

**Google Analytics 4 activo** (`G-HRWL3FG6SF`) — inyectado vía `src/layouts/BaseLayout.astro` al final del `<body>`, presente en todas las páginas. Pendiente: banner de consentimiento de cookies (Ley 81 PA / GDPR).

> El bloque de Plausible queda comentado como alternativa por si se migra en el futuro.

---

## PACs integrados

> Fuente canónica de las integraciones: `C:\prooq\_pacs-reference` (fuera de todo repo git y del web root).
> Ahí viven READMEs, `notas.md` con quirks de producción y el código real de cada PAC. Leer antes de tocar copy de FE.

**Panamá — DGI (5 conexiones contratables):**

| PAC | Protocolo | Estado |
|-----|-----------|--------|
| Digifact (default) | REST + XML | Producción real |
| The Factory HKA | SOAP (array anidado a `SoapClient`) | CUFE real autorizado por DGI |
| Ebi PAC | SOAP (objeto `DocumentoElectronico`) | CUFE real autorizado por DGI |
| Factura Fácil | REST + JSON | Validado en QA |
| eFacturapty | SOAP (sin `SoapClient`) | Validado en pruebas (CUFE real de test) |

⚠️ **Ebi PAC y The Factory HKA Panamá son el mismo proveedor** — "Ebi PAC" es la marca del web service SOAP de TFHKA (mismo motor WCF). Se listan aparte porque **son cuentas, credenciales, endpoints (`ebi-pac.com`) y licencias distintas** que el cliente contrata por separado, y porque tenemos dos implementaciones independientes. Pero **no contratar dos cuentas creyendo que son PACs distintos**: para un mismo emisor, una basta.

**Venezuela — SENIAT (1 PAC):**

| PAC | Protocolo | Estado |
|-----|-----------|--------|
| The Factory HKA Venezuela (Imprenta Digital) | REST + JSON, JWT 12h | Emitiendo en producción |

Régimen SENIAT (Providencias SNAT/2024/000102 y SNAT/2024/000121). **No hay CUFE**: el identificador fiscal es el **Número de Control** (`00-00000001`) + `urlConsulta`. HKA asigna la numeración desde un pool autorizado. IVA 16% e IGTF 3% como renglón propio. No reutiliza nada del HKA de Panamá (aquel es SOAP/DGI).

SuiteHub no factura — el cliente contrata su PAC y nosotros nos integramos. El costo del PAC lo paga directo el cliente.

---

## Casos reales en `/casos`

| Caso | Vertical | Edición | PAC | Logo |
|------|----------|---------|-----|------|
| **QS Express** — taller mecánico, La Chorrera | HUB Taller | Pro | Digifact | `tallerqsexpress.png` |
| **Clean Factory** — lavandería de calzado deportivo, Panamá | HUB Lavandería | Core | The Factory HKA | `cleanfactory.png` |

---

## Pendientes

- Banner de consentimiento de cookies para GA4 (Ley 81 PA / GDPR)
- Open Graph image dedicada por página (hoy todas comparten una)
- Screenshot real (`web-*.webp`) en verticales que aún solo muestran logo (carwash, taller, beauty, clinic, gym, lavanderia, inmobiliaria, phone, traffic)
- Reemplazar 2 testimonios placeholder en home (Carmen Aguilar, Luis Fernández) con reales cuando estén disponibles
- Sitemap: agregar `xhtml:link` a páginas internas (no solo home — los slugs ES/EN difieren, requiere `serialize` callback custom)
- Fase 4 opcional: blog/MDX con artículos editoriales bilingües

---

## Contacto

- WhatsApp: +507 6632-6006
- Email: info@suitehub.net
- Vía Argentina, Bella Vista, Ciudad de Panamá

Para soporte de desarrollo del sitio, escribir a info@suitehub.net.
