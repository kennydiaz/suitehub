# Catálogo SuiteHub — Conceptos + Precios

> Documento humano del catálogo de precios de SuiteHub (PROOQ LLC / PROOQ S.A.).
> **Fuente canónica: el panel** — `suitehub-panel/src/Catalog.php`, servido como JSON en `https://panel.suitehub.net/?r=catalog/json`. El sitio Astro lo consume en build-time vía [`src/lib/catalog.ts`](src/lib/catalog.ts), con [`src/data/catalogo.json`](src/data/catalogo.json) como copia local de respaldo. Este MD es solo explicativo y puede ir por detrás del panel.
>
> Modelo vigente: **vertical en línea de edición** (Lite/Core/Pro/Enterprise), sin recargo. El **delta** (Ligero $12 · Medio $24 · Pesado $36) es el precio de **módulos adicionales** por cliente (uso futuro). Descuentos: manuales.
>
> Última actualización: 2026-06-25

---

## Parte 1 — Glosario y definiciones (vocabulario oficial)

Para que ventas, producto y desarrollo hablemos lo mismo.

| Término | Definición precisa | Qué **NO** es |
|---|---|---|
| **Edición** | Eje **horizontal**: nivel de capacidad (Lite / Core / Pro / Enterprise). Controla los **límites** y qué módulos del núcleo se activan. Agnóstica de industria. | ❌ "tier", ❌ "plan" |
| **Vertical** | Eje **vertical**: adaptación a una industria (HUB Taller, HUB Restaurant…). Es el **núcleo + módulos, flujos, jerga y pantallas del rubro**. Siempre corre **sobre** una edición. | ❌ un producto suelto sin edición detrás |
| **Núcleo** | Lo común a todas las ediciones y verticales: clientes, catálogo de productos/servicios, cotizaciones, facturas, reportes. | — |
| **Módulo** | Unidad funcional activable: FE DGI, multi-sucursal, automatizaciones, KDS, agenda, etc. Una edición/vertical = un conjunto de módulos. | — |
| **Plan / Suscripción** | La **oferta vendible** = `Vertical × Edición × Ciclo`. Es lo que entra al catálogo como línea con precio. | ❌ "edición" a secas |
| **Ciclo** | Mensual o anual. **Anual = mensual × 10** (≈16% off, igual que las ediciones). | — |
| **Add-on** | Extra que se cobra **aparte** de la suscripción: usuario extra, dominio propio, email saliente con dominio, sucursal extra. | — |
| **Límites** | Cuotas numéricas de la edición: sucursales, usuarios, registros, almacenamiento, transacciones/mes. | — |
| **PAC** | Proveedor de facturación electrónica (Digifact, HKA, Factura Fácil, eFacturapty). **Lo contrata y paga el cliente.** SuiteHub solo integra, sin cobro. | ❌ ingreso de SuiteHub |
| **Delta de vertical** | Recargo mensual fijo que suma un vertical sobre el precio de la edición. Refleja los módulos de industria. | — |
| **Edición mínima** | El piso de edición desde el cual tiene sentido vender un vertical (p.ej. los que facturan al cliente requieren mínimo Core, porque ahí se activa la FE). | — |

### SKU sugerido
Formato: `HUB-{VERTICAL}-{EDICION}-{CICLO}` → ej. `HUB-TALLER-PRO-ANUAL`.
Cada SKU = una línea de catálogo con precio único.

### Limpiezas de vocabulario pendientes (deuda actual)
1. **Choque "Ediciones" vs "Productos":** en el nav, *"Ediciones"* apunta a `/productos` (`productos.astro`, route key `products`). Unificar a **Ediciones** en archivo, ruta y label; no usar "Productos" para dos cosas.
2. Estandarizar **"Vertical"** (no "producto") para HUB Taller/Restaurant/etc. en copy y catálogo.
3. Separar siempre **incluido** de **add-on** en cada línea (hoy los extras viven sueltos en FAQs).

---

## Parte 2 — Eje horizontal: Ediciones (precios vivos del sitio)

| Edición | $/mes | $/año (16% off) | Sucursales | Usuarios | Registros | Almac. | Transac./mes | Salto clave |
|---|---|---|---|---|---|---|---|---|
| **Lite** | 24 | 240 | 1 | 3 | 500 | 2 GB | 100 | Básico **con FE DGI incluida** |
| **Core** | 48 | 480 | 2 | 8 | 5 000 | 10 GB | 1 000 | **Activa FE DGI (4 PACs) + CxC + reportes SQL/PDF** |
| **Pro** ⭐ | 96 | 960 | 5 | 20 | 50 000 | 50 GB | 10 000 | **Multi-sucursal + automatizaciones + API REST + WhatsApp** |
| **Enterprise** | 192 | 1 920 | ∞ | 50 | ∞ | 200 GB | ∞ | White-label completo + reportes con IA + SLA + API ∞ |

**Diferenciadores por edición (resumen de la comparativa):**
- **Core** prende: FE DGI (Digifact / HKA / Factura Fácil / eFacturapty), CUFE+QR, anulación, notas de crédito, conversión cotización→factura, inventario auditado, CxC multi-factura, aging de cartera, reportes Nivel 2 (SQL) y Nivel 3 (PDF).
- **Pro** prende: stock por sucursal, gestión multi-sucursal, transferencias inter-sucursal, automatizaciones programadas, API REST (100K/mes), webhooks, WhatsApp Business, branding propio.
- **Enterprise** prende: reportes con IA, white-label completo (revender), API ilimitada, SLA contractual, account manager, integraciones custom.

### Add-ons (se cobran aparte de la edición)
| Add-on | Lite | Core | Pro | Enterprise |
|---|---|---|---|---|
| Usuario adicional /mes | $5 | $4 | $3 | $2 |
| Dominio propio | — | — | Add-on | Incluido |
| Email saliente con tu dominio | — | — | Add-on | Incluido |
| PAC (FE electrónica) | — | Lo paga el cliente directo al PAC | ← | ← |

> Precios de dominio propio / email con dominio: **PROPUESTA pendiente** (no están en el sitio). Sugerencia inicial: dominio propio +$5/mes, email con dominio +$5/mes.

---

## Parte 3 — Eje vertical: vertical en línea de edición

**Modelo vigente (2026-06-25): cada vertical se ubica en la línea de precio de la edición** (Lite/Core/Pro/Enterprise) que le corresponda, **sin recargo**. Anual = mensual × 10 (≈16% off). Para los valores vivos, manda el panel (`/?r=catalog/json`).

| Vertical | Línea de precio | Notas |
|---|---|---|
| **HUB Pet** | desde **Lite ($24)** | entrada; FE incluida |
| Taller, Carwash, Restaurant, Beauty, Clinic, Gym, Lavandería, Inmobiliaria, Hotel, Phone | desde **Core ($48)** | suben a Pro ($96) / Enterprise ($192) |
| **HUB Traffic** | desde **Lite ($24)** | analítica; suma setup de hardware one-time |

> **Descuentos por cliente: manuales.** HUB POS es caso especial (standalone $36/mes — ver Parte 4).

### Delta = módulos adicionales (uso futuro)
El **delta** clasifica la complejidad de un vertical y fija el precio de los **módulos adicionales** que un cliente puede contratar. **Hoy no se suma** al precio base del vertical; se reserva para próximas revisiones.

| Grupo | Delta/mes (módulo) | Verticales |
|---|---|---|
| Ligero | +$12 | Beauty, Lavandería, Inmobiliaria, Phone |
| Medio | +$24 | Taller, Carwash, Pet, Clinic, Gym, Hotel |
| Pesado | +$36 | Restaurant, Traffic |

---

## Parte 4 — Casos especiales (fuera de la matriz)

> **Reconciliación histórica (kennydiaz, 2026-05-30):** los pitches del panel `suitehub-panel/src/Products.php` se alinearon con el catálogo: Carwash $24→**$48/mes** (precio estándar), POS $240→**$360/año**. *(Cambio en landings en vivo: aplica al hacer push/deploy del panel.)*

### HUB POS — caja / punto de venta
Se vende de dos formas:
1. **Standalone** (caja sola, sin el resto del núcleo): **$360/año ($36/mes)** — confirmado. Ideal food truck / barra / quick-service que solo quiere cobrar.
2. **Como módulo de caja** sobre otro vertical (Restaurant, etc.): **PROPUESTA +$15/mes** sobre la edición.

### HUB Traffic — ahora en la matriz (piso Lite)
Por decisión 2026-05-30, Traffic entra a la matriz arrancando en **Lite** (es analítica, no factura al cliente) — ver Parte 3. Conserva su componente de hardware:
- **Setup de hardware:** cotización por # de sensores/cámaras y local (one-time).
- **Delta de suscripción:** PROPUESTA +$30/mes (no se confirmó número; encaja con grupo "pesado").
- Se vende mejor como **complemento de HUB POS** (cruce visita→venta) que solo.

---

## Parte 5 — Pendientes para cerrar el catálogo
- [x] ~~Validar **deltas** de verticales~~ — **modelo en pausa** (2026-06-25): verticales pasan a precio plano por grupo (entrada 24/240 · estándar 48/480).
- [x] **Edición mínima** por vertical — Core para todos salvo **Traffic = Lite**.
- [x] **HUB POS standalone** — $360/año confirmado.
- [x] **Migración** — fuente canónica = `suitehub-panel/data/catalogo.php`; espejo Astro = `suitehub/src/data/catalogo.json`.
- [x] **Reconciliación de precios** — regla "manda el más caro"; pitches Carwash/POS del panel actualizados.
- [ ] Confirmar **delta de HUB Traffic** (PROPUESTA +$30) y rango del **setup de hardware**.
- [ ] Precios de add-ons **dominio propio** y **email con dominio** (PROPUESTA $5 c/u).
- [ ] Política de **sucursal extra** como add-on (hoy se sube cambiando de edición).
- [ ] Cuando se scaffolde el panel: su módulo *Catálogo de productos* lee de `src/data/catalogo.json`.
