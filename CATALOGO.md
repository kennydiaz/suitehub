# Catálogo SuiteHub (vigente desde 2026-09-06)

> **Fuente canónica: el panel.** `panel.suitehub.net/src/Catalog.php`, servido como JSON en
> `https://panel.suitehub.net/?r=catalog/json`. El sitio Astro lo consume en build-time vía
> [`src/lib/catalog.ts`](src/lib/catalog.ts), con [`src/data/catalogo.json`](src/data/catalogo.json)
> como copia local de respaldo. Este documento explica el modelo; no lo define.
>
> Mesa de decisión de precios: `_suitehub-docs/SuiteHub-Precios.xlsx` (aquí se decide, en el panel se aplica).
> Moneda USD · Anual = mensual × 10 (12 meses al precio de 10) · Descuentos por cliente: manuales.

---

## 1. Ediciones (eje horizontal)

Se nombran siempre completas: **Hub Lite · Hub Core · Hub Pro · Hub Enterprise**. Nunca "Lite" o "Core" a secas.

| Edición | Etiqueta | $/mes | $/año | Sucursales | Usuarios | Registros | Almac. | Transac./mes | Salto clave |
|---|---|---|---|---|---|---|---|---|---|
| **Hub Lite** | Básico | 24 | 240 | 1 | 3 | 500 | 2 GB | 100 | Clientes, catálogo, cotizaciones y FE DGI |
| **Hub Core** ⭐ | Más vendido | 48 | 480 | 1 | 8 | 5,000 | 10 GB | 1,000 | FE DGI con los PACs autorizados, CxC, inventario auditado, reportes SQL y PDF |
| **Hub Pro** | Personalizable | 64 | 640 | 1 | 20 | 50,000 | 50 GB | 10,000 | Hub Core + branding propio, automatizaciones, API REST, webhooks, WhatsApp Business |
| **Hub Enterprise** | Sucursales | 196 | 1,960 | 1 principal · **+$64/mes** por adicional | 50 | Ilimitados | 200 GB | Ilimitadas | Multi-sucursal consolidado, cualquier vertical incluido, SLA, integraciones custom |

**Multi-sucursal vive solo en Hub Enterprise.** Hub Lite, Hub Core y Hub Pro son de una sucursal.

## 2. Verticales (eje vertical): dos precios por vertical

| Presentación | Precio por defecto | Qué es |
|---|---|---|
| **HUB X** | **$48/mes · $480/año** (línea Core) | El vertical sobre la edición Hub Core |
| **HUB X Pro** | **$64/mes · $640/año** (línea Pro) | El vertical sobre la edición Hub Pro |

Verticales en catálogo (16): Taller · Carwash · POS · Restaurant · Market · Boutique · Pet · Salon · Clinic · Gym · Lavandería · Inmobiliaria · Hotel · Phone · Ship · Traffic (el hardware se cotiza aparte).

- **Precio propio opcional (desde 2026-09-15)**: en el panel cada vertical puede tener su precio en la línea Core, en la Pro o en las dos. Vacío = sigue la edición. El JSON lo marca con `planes.core.propio` / `planes.pro.propio`.
- Sin grupos, sin deltas, sin módulos especiales. Nunca "HUB X Lite".
- HUB POS (food service ligero) y HUB Restaurant (full-service con salón y mesas) son dos verticales distintos que comparten base.
- Un vertical con varias sucursales → **Hub Enterprise ($196)**, que incluye cualquier vertical.
- Casos reales publicados: HUB Taller (QS Express, La Chorrera) y HUB Lavandería (Clean Factory, Panamá).
- Fuera del catálogo: HUB Kiosko (módulo de HUB POS).

Cambiar Hub Core o Hub Pro en el panel mueve a la vez todos los verticales que **no** tienen precio propio en esa línea.

## 2b. Productos independientes: no siguen las ediciones

| Producto | Cómo se cobra | Precio (anual = 10 meses) |
|---|---|---|
| **HUB Time** (control de asistencia y marcación) | Por empleados activos | Básico **$29/mes** hasta 15 · Pro **$59/mes** hasta 40 · Empresarial **$119/mes** hasta 100 |
| **HUB Web** (diseño y desarrollo web a medida) | Por proyecto | «Desde» y mantenimiento mensual opcionales; vacíos = a cotizar |

Los planes de HUB Time son los de `hubtime/config/plans.php`. Si cambian allá, se cambian en el panel. Cada producto decide si lleva implementación.

## 3. Sin add-ons

**El catálogo no vende add-ons** (retirados el 12-sep-2026): no hay usuarios sueltos, ni módulos, ni extras por vertical. Si un negocio necesita más usuarios de los que trae su edición, sube de edición.

Dos cosas que antes figuraban como add-on y **no** lo son:

| Concepto | Dónde vive |
|---|---|
| **Sucursal adicional** (+$64/mes) | Es el precio por sede de **Hub Enterprise**, dentro de la edición (`sucursal_adicional_mes`). Hub Lite, Hub Core y Hub Pro son de una sucursal. |
| **Implementación** ($196 una sola vez · gratis con plan anual) | Desde 2026-09-15 vive **en el catálogo** (bloque `implementacion`: `precio`, `gratis_con_anual`, `incluye`) y se edita en el panel. Precios, casos y socios la leen de ahí con `getImplementacion()`: no se escribe a mano. |

El PAC de facturación electrónica lo contrata y paga el cliente directo a su PAC; SuiteHub integra sin cobro.

## 4. Vocabulario

- **Edición** (no "tier", no "plan"): Hub Lite / Hub Core / Hub Pro / Hub Enterprise.
- **Vertical** (no "producto"): HUB Taller, HUB Restaurant…
- **HUB X / HUB X Pro**: las dos únicas presentaciones de un vertical.
- **Suite empresarial** o **plataforma de gestión** (no "SaaS").
- SKU: `HUB-{VERTICAL}-{CORE|PRO}-{MENSUAL|ANUAL}`.

## 5. Pendientes

- [ ] HUB Web: fijar el precio «desde» y el mantenimiento en el panel.
- [ ] HUB Time y HUB Web: presentación propia (página en `/verticales/`) con copy y capturas.
- [ ] Actualizar `Catalog.php` del panel con los nombres completos de las ediciones (Hub Lite, Hub Core, Hub Pro, Hub Enterprise). Hasta entonces, el build del sitio recibe los nombres cortos del endpoint.
