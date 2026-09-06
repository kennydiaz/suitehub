# Catálogo SuiteHub — Modelo simple (vigente desde 2026-09-06)

> **Fuente canónica: el panel** — `panel.suitehub.net/src/Catalog.php`, servido como JSON en `https://panel.suitehub.net/?r=catalog/json`. El sitio Astro lo consume en build-time vía [`src/lib/catalog.ts`](src/lib/catalog.ts), con [`src/data/catalogo.json`](src/data/catalogo.json) como copia local de respaldo. Este MD es explicativo.
> Mesa de decisión humana: `_suitehub-brand/catalogo/PRECIOS-2026.xlsx` (aquí se decide, en el panel se aplica).
>
> Última actualización: 2026-09-06 · Moneda USD · Anual = mensual × 10 (≈16% off) · Descuentos por cliente: manuales.

---

## 1. Ediciones (eje horizontal)

| Edición | Etiqueta | $/mes | $/año | Sucursales | Usuarios | Registros | Almac. | Transac./mes | Salto clave |
|---|---|---|---|---|---|---|---|---|---|
| **Lite** | Básico | 24 | 240 | 1 | 3 | 500 | 2 GB | 100 | Clientes, catálogo, cotizaciones y FE DGI |
| **Core** ⭐ | Más vendido | 48 | 480 | 1 | 8 | 5,000 | 10 GB | 1,000 | FE DGI con los PACs autorizados, CxC, inventario auditado, reportes SQL y PDF |
| **Pro** | Personalizable | 64 | 640 | 1 | 20 | 50,000 | 50 GB | 10,000 | Core + branding propio, automatizaciones, API REST, webhooks, WhatsApp Business |
| **Enterprise** | Sucursales | 196 | 1,960 | 1 principal · **+$64/mes** por adicional | 50 | Ilimitados | 200 GB | Ilimitadas | Multi-sucursal consolidado, cualquier vertical incluido, SLA, integraciones custom |

**Multi-sucursal vive solo en Enterprise.** Lite, Core y Pro son de una sucursal.

## 2. Verticales (eje vertical) — dos precios, sin recargo

Cada vertical se vende de dos formas, y nada más:

| Presentación | Precio | Qué es |
|---|---|---|
| **HUB X** | **$48/mes · $480/año** (línea Core) | El vertical sobre la edición Core |
| **HUB X Pro** | **$64/mes · $640/año** (línea Pro) | El vertical sobre la edición Pro |

Verticales en catálogo (15): Taller · Carwash · Restaurant · POS · Market · Boutique · Pet · Beauty · Clinic · Gym · Lavandería · Inmobiliaria · Hotel · Phone · Traffic (el hardware se cotiza aparte).

- Sin precio propio, sin grupos, sin deltas, sin módulos especiales.
- Un vertical con varias sucursales → **Enterprise ($196)**, que incluye cualquier vertical.
- Casos reales: HUB Taller (QS Express — La Chorrera), HUB Lavandería (Clean Factory — Panamá).
- Fuera del catálogo hasta tener definición: HUB Time, HUB Web, HUB Salon (ver pendientes).

Los precios de los verticales **no se editan**: siguen la línea Core/Pro. Cambiar Core o Pro en el panel mueve todos los verticales a la vez.

## 3. Add-ons (solo estos)

| Add-on | Detalle | Estado |
|---|---|---|
| Usuario adicional | Lite $5 · Core $4 · Pro $3 · Enterprise $2 /mes | confirmado |
| Sucursal adicional | +$64/mes, solo Enterprise (la principal va incluida) | confirmado |
| Implementación | $99 una sola vez · **gratis con plan anual** | propuesta |

El PAC de facturación electrónica lo contrata y paga el cliente directo a su PAC; SuiteHub integra sin cobro.

## 4. Vocabulario

- **Edición** (no "tier", no "plan"): Lite / Core / Pro / Enterprise.
- **Vertical** (no "producto"): HUB Taller, HUB Restaurant…
- **HUB X / HUB X Pro**: las dos únicas presentaciones de un vertical. Nunca "HUB X Lite".
- SKU sugerido: `HUB-{VERTICAL}-{CORE|PRO}-{MENSUAL|ANUAL}`.

## 5. Pendientes

- [ ] Confirmar implementación $99 / gratis con anual (hoy *propuesta*).
- [ ] Beauty vs Salon: el catálogo dice HUB Beauty; el brand kit tiene logo de HUB Salon. Nombre final.
- [ ] Definir HUB Time (existe en brand kit, no en catálogo).
- [ ] Entidad en materiales legales (términos, privacidad, footer): decidir dueño de marca/IP entre PROOQ S.A. (Panamá) y PROOQ LLC (EE.UU.) antes de reescribirlos.

## 6. Historial de modelos (para no volver a mezclarlos)

| Cuándo | Modelo | Estado |
|---|---|---|
| may-2026 | Puntos ($12/pt) + licencia inicial para restaurantes | retirado |
| jun-2026 | 3 planes por producto + setup (estudio de mercado) | referencia de mercado, no vigente |
| 2026-06-25 | Ediciones × verticales con precio propio, grupos y deltas | reemplazado |
| **2026-09-06** | **Modelo simple: 4 ediciones · vertical = Core o Pro · Enterprise = sucursales** | **vigente** |
