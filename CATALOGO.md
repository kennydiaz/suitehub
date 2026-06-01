# Catálogo SuiteHub — Conceptos + Precios

> Documento humano del catálogo de precios de SuiteHub (PROOQ LLC / PROOQ S.A.).
> **Fuente canónica de datos: [`src/data/catalogo.json`](src/data/catalogo.json)** — el sitio Astro y el futuro panel deben leer de ahí. Este MD es el explicativo; si cambian precios, se cambian en el JSON.
> Origen de los datos de producto: `src/pages/productos.astro` (ediciones), `src/pages/precios.astro` (comparativa), `src/pages/verticales.astro` (verticales).
>
> Estado: ediciones = precios vivos del sitio. Deltas de verticales = **confirmados** (kennydiaz, 2026-05-30) salvo lo marcado `PROPUESTA`.
>
> Última actualización: 2026-05-30

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
| **Lite** | 24 | 240 | 1 | 3 | 500 | 2 GB | 100 | Básico, **sin** FE electrónica |
| **Core** | 36 | 360 | 2 | 8 | 5 000 | 10 GB | 1 000 | **Activa FE DGI (4 PACs) + CxC + reportes SQL/PDF** |
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

## Parte 3 — Eje vertical: matriz de catálogo

**Modelo elegido: `Edición base + delta de vertical`.** Precio = precio de la edición + delta del vertical (el delta es plano en todas las ediciones, para mantenerlo simple). Anual = mensual × 10.

### Clasificación de verticales por complejidad (define el delta)
| Grupo | Delta/mes | Verticales |
|---|---|---|
| Ligero | +$10 | HUB Beauty, HUB Lavandería, HUB Inmobiliaria, HUB Phone |
| Medio | +$20 | HUB Taller, HUB Carwash, HUB Pet, HUB Clinic, HUB Gym, HUB Hotel |
| Pesado | +$30 | HUB Restaurant, HUB Traffic `(delta PROPUESTA)` |
| Especial | standalone | HUB POS — ver Parte 4 |

### Matriz de precios ($/mes)
Edición mínima = **Core** para todos los verticales que facturan al cliente (ahí se activa la FE). **Excepción: HUB Traffic arranca en Lite** (es analítica, no factura).

| Vertical | Rubro | Delta | **Lite** (24) | **Core** (36) | **Pro** (96) | **Enterprise** (192) | Caso real |
|---|---|---|---|---|---|---|---|
| **HUB Taller** | Talleres mecánicos | +$20 | — | **$56** | $116 | $212 | QS Express (La Chorrera) |
| **HUB Carwash** | Autolavados / detailing | +$20 | — | **$56** | $116 | $212 | — |
| **HUB Pet** | Veterinarias / pet shops | +$20 | — | **$56** | $116 | $212 | — |
| **HUB Clinic** | Consultorios / clínicas | +$20 | — | **$56** | $116 | $212 | — |
| **HUB Gym** | Gimnasios / crossfit / yoga | +$20 | — | **$56** | $116 | $212 | — |
| **HUB Hotel** | Hoteles boutique / hostales | +$20 | — | **$56** | $116 | $212 | — |
| **HUB Beauty** | Salones / spa / barbería | +$10 | — | **$46** | $106 | $202 | — |
| **HUB Lavandería** | Lavanderías / tintorerías | +$10 | — | **$46** | $106 | $202 | Clean Factory |
| **HUB Inmobiliaria** | Bienes raíces | +$10 | — | **$46** | $106 | $202 | — |
| **HUB Phone** | Reparación de celulares | +$10 | — | **$46** | $106 | $202 | — |
| **HUB Restaurant** | Restaurantes / bares | +$30 | — | **$66** | $126 | $222 | — |
| **HUB Traffic** | Analítica afluencia | +$30 ᴾ | **$54** | $66 | $126 | $222 | — + setup HW |

> Anual = columna × 10 (ej. HUB Taller Pro anual = $1 160). `ᴾ` = delta PROPUESTA. HUB Traffic suma **setup de hardware** one-time (cotización por sensores/cámaras).

---

## Parte 4 — Casos especiales (fuera de la matriz)

> **Regla de reconciliación (kennydiaz, 2026-05-30): manda el más caro.** Donde el catálogo (edición+delta) y el pitch viejo del panel chocaban, gana el precio mayor. Por eso se subieron los pitches de `suitehub-panel/src/Products.php`: Carwash $24→**$56/mes** (Core+$20), POS $240→**$360/año**. *(Cambio en landings en vivo: aplica al hacer push/deploy del panel.)*

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
- [x] Validar **deltas** de verticales — confirmados (Ligero $10 / Medio $20 / Pesado $30).
- [x] **Edición mínima** por vertical — Core para todos salvo **Traffic = Lite**.
- [x] **HUB POS standalone** — $360/año confirmado.
- [x] **Migración** — fuente canónica = `suitehub-panel/data/catalogo.php`; espejo Astro = `suitehub/src/data/catalogo.json`.
- [x] **Reconciliación de precios** — regla "manda el más caro"; pitches Carwash/POS del panel actualizados.
- [ ] Confirmar **delta de HUB Traffic** (PROPUESTA +$30) y rango del **setup de hardware**.
- [ ] Precios de add-ons **dominio propio** y **email con dominio** (PROPUESTA $5 c/u).
- [ ] Política de **sucursal extra** como add-on (hoy se sube cambiando de edición).
- [ ] Cuando se scaffolde el panel: su módulo *Catálogo de productos* lee de `src/data/catalogo.json`.
