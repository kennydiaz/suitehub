# HUB Taller — Plan de diseño y stack (borrador para decisión)

> Estado: **no iniciado**. QS Express es un desarrollo a medida y no cuenta como Hub Taller.
> Este documento fija (1) el sistema visual "estilo Minimal" y (2) el stack para hosting compartido. Las decisiones abiertas están marcadas con ⚠️.

---

## 1. Qué es Hub Taller (marco comercial ya decidido)

Vertical del catálogo para talleres mecánicos. Se vende como **HUB Taller** ($48/mes, línea Core) y **HUB Taller Pro** ($64/mes, línea Pro). Multi-sucursal = Enterprise. Badge ámbar `#F59E0B`.

Promesa publicada en el sitio (y por tanto el mínimo a construir): recepción rápida por placa · órdenes de trabajo (servicios + repuestos) · agenda de citas · histórico de vehículos · catálogo de servicios · facturación electrónica DGI.

---

## 2. Diseño: estilo Minimal, código propio

Minimal (minimals.cc) es una plantilla **React + MUI**. Lo que se adopta es su **lenguaje visual**, no su código: la plataforma SuiteHub es PHP + Tailwind + Alpine y así se queda (decisión de agosto 2026). Copiar tokens y proporciones a CSS propio no toca la licencia de MUI Store; copiar JSX sí, y además no serviría.

### 2.1 Tokens extraídos de `theme-config.js` / `custom-shadows.js` / `card.jsx`

| Token | Minimal | Hub Taller (propuesta) |
|---|---|---|
| Fuente texto | Public Sans | **Inter** (marca) |
| Fuente títulos | Barlow ExtraBold | **Sora** SemiBold/Bold (marca) ⚠️ |
| Base tipográfica | 14 px · line-height 1.57 | igual |
| Escala gris | 50 `#FCFDFD` · 100 `#F9FAFB` · 200 `#F4F6F8` · 300 `#DFE3E8` · 400 `#C4CDD5` · 500 `#919EAB` · 600 `#637381` · 700 `#454F5B` · 800 `#1C252E` · 900 `#141A21` | igual (es la firma visual de Minimal) |
| Primario | `#00A76F` verde | **ámbar del badge**: lighter `#FEF3C7` · light `#FCD34D` · main `#F59E0B` · dark `#B45309` · darker `#78350F` |
| Semánticos | info `#00B8D9` · success `#22C55E` · warning `#FFAB00` · error `#FF5630` | iguales |
| Fondo claro | paper `#FFFFFF` · default `#FFFFFF` · neutral `#F4F6F8` | iguales |
| Fondo oscuro | paper `#1C252E` · default `#141A21` · neutral `#28323D` | iguales |
| Texto claro | primary gris-800 · secondary gris-600 · disabled gris-500 | iguales |
| Radio | 8 px base · **card 16 px** · botones 8 px · chips pill | iguales |
| Sombra card | `0 0 2px rgba(145,158,171,.2), 0 12px 24px -4px rgba(145,158,171,.12)` | igual |
| Sombra dropdown | `0 0 2px rgba(145,158,171,.24), -20px 20px 40px -4px rgba(145,158,171,.24)` | igual |
| Divisores / bordes | gris-500 al 20 % (`rgba(145,158,171,.2)`) | igual |
| Hover / selected | gris-500 al 8 % / 16 % | igual |
| Chips "soft" | color al 16 % de fondo + texto en `dark` | igual (estado de órdenes) |
| Sidebar | 280 px, ítems 44 px, ícono 24 px, activo = primario al 8 % + texto primario dark; variante mini 88 px | igual |
| Header | 64 px, transparente con blur al hacer scroll | igual |
| Card header | padding 24/24/0, título h6, subtítulo body2 | igual |

Lo que hace que "se vea Minimal" es el conjunto **gris frío + cards blancas con sombra suave y radio 16 + chips soft + sidebar ancho y limpio**. Con esos seis elementos se reconoce; sin ellos, no.

### 2.2 Cómo se implementa

Hub Core ya tiene la infraestructura correcta: Tailwind v3 **precompilado** (CLI standalone, sin Node en el servidor, CSS versionado) y tokens por variables CSS (`--surface-1`, `--fg-primary`, `--edge`, `data-theme="dark"`). El trabajo es **reemplazar valores, no arquitectura**:

1. `tailwind.config.js`: agregar escala `grey` de Minimal, `primary` (ámbar) y `info/success/warning/error`; `borderRadius.card = 16px`; `boxShadow.card/dropdown/z8`.
2. `app.css`: mapear las variables existentes (`--bg-base`, `--surface-*`, `--fg-*`, `--edge`, `--sidebar-bg`) a los valores Minimal en claro y oscuro.
3. Componentes base como clases (`.card`, `.btn`, `.btn-soft`, `.chip`, `.input`, `.table`) en `app.css` con `@apply`, para no repetir 30 clases por botón.
4. Reemplazar **Flowbite** por esos componentes propios (Flowbite trae otro look y pelea con Minimal).
5. Íconos: Tabler outline (convención de marca) en lugar de Font Awesome solid.

⚠️ **Decisión**: hacerlo **dentro de Hub Core** (todos los verticales lo heredan y Hub Taller nace ya con el tema) o **solo en Hub Taller** (más rápido de arrancar, deuda para migrar Core después). Recomendación: en Hub Core, porque Hub Taller *es* Hub Core + módulos.

---

## 3. Stack para hosting compartido (Hostinger / LiteSpeed)

Recomendación: **el mismo stack de Hub Core, sin excepciones.** Ya está en producción en hosting compartido y cumple todo lo que un taller necesita.

| Capa | Elección | Por qué en hosting compartido |
|---|---|---|
| Lenguaje | PHP 8.2 (`strict_types`) | Nativo en Hostinger. Sin procesos residentes, sin Node. |
| Base de datos | MySQL/MariaDB (PDO, InnoDB, utf8mb4) | Incluida en el plan; backups del panel del hosting; concurrencia real para varios usuarios del taller. |
| Frontend | Tailwind v3 **precompilado** + Alpine.js + Tabler Icons | Cero build en servidor: el CSS va en el repo. Alpine cubre modales, tabs, buscadores. |
| PDF | dompdf 3 (Composer, `vendor/` versionado) | Sin `composer install` en el servidor; órdenes, cotizaciones y facturas en PDF. |
| Facturación electrónica | Integraciones existentes de Hub Core (los PACs de la DGI) | Ya probadas en producción; no se reescriben. |
| Gráficas | Chart.js por CDN | Dashboard del taller (órdenes por estado, ingresos). |
| Impresión | Térmica 80 mm por navegador (como Hub Core caja) | Recepción imprime el comprobante de entrada al instante. |
| Deploy | GitHub Actions → rsync SSH por cliente (mismo workflow del panel) | Una instalación por cliente, su propia BD, `data/` excluido. |
| Licencia | `portal.prooq.com` (cache 24 h, gracia 7 d) | Ya existe. |
| Tests | PHPUnit para reglas (FE, totales, estados de orden) | Como Hub Core. |

**Descartado y por qué**
- *React/Next con Minimal tal cual + API PHP*: dos bases de código, build obligatorio, SPA que no aporta nada a un taller, y un segundo lenguaje de UI que nadie más en PROOQ mantiene.
- *SQLite*: correcto en HubPOS (offline, local); en un taller con recepción + mecánicos + caja sobre internet, MySQL es más simple de operar en Hostinger.
- *Framework (Laravel)*: Composer pesado, colas y cron que el hosting compartido no garantiza; rompe la convención "PHP plano" de toda la familia.
- *Flowbite*: look Bootstrap-ish, contrario a la guía de marca.

---

## 4. Módulos: qué existe y qué falta

Hub Core aporta (sin tocar): `clientes`, `servicios`, `inventario` (repuestos), `cotizaciones`, `facturas` (FE), `cxc`, `caja`, `garantias`, `proveedores`, `compras`, `reportes`, `usuarios`, `configuraciones`, `consola`, `auditoria`.

Nuevos para Hub Taller (auto-discovery por `module.json`, mismo patrón `schema.php / index.php / form.php / actions.php / widget.php`):

| Módulo | Tablas | Depende | Función |
|---|---|---|---|
| `vehiculos` | `vehiculos` (placa única, marca, modelo, año, VIN, km, cliente) | clientes | Ficha e histórico por vehículo. Búsqueda por placa desde cualquier pantalla. |
| `ordenes` | `ordenes`, `orden_items` (servicio o repuesto), `orden_estados` | vehiculos, servicios, inventario | Orden de trabajo: recepción → diagnóstico → aprobado → en proceso → listo → entregado. Cada ítem sale a cotización o factura con un clic. |
| `recepcion` | — (usa ordenes) | ordenes | Pantalla táctil de entrada: placa → cliente → km → fotos/observaciones → comprobante 80 mm. |
| `agenda` | `citas` | vehiculos | Citas por día/bahía/mecánico; recordatorio por WhatsApp (link pre-armado). |
| `mecanicos` | `mecanicos`, `orden_mecanico` | ordenes | Asignación y, en Pro, comisión por orden. |

Pro (línea $64) añade sobre lo mismo: branding propio, automatizaciones (recordatorio de mantenimiento por km/fecha), API/webhooks y WhatsApp Business, según la definición de la edición Pro. No hay módulos "exclusivos" de Pro: es Core + personalización, como en el catálogo.

---

## 5. Fases

| Fase | Entregable | Duración estimada |
|---|---|---|
| 0 | Decisiones de este documento cerradas | — |
| 1 | Tema Minimal en Hub Core (tokens, componentes, sin Flowbite, Tabler) + capturas antes/después | 1–2 semanas |
| 2 | Scaffold `hubtaller` = fork de Hub Core + módulos `vehiculos` y `ordenes` con tests | 2 semanas |
| 3 | `recepcion` táctil + comprobante 80 mm + `agenda` | 1–2 semanas |
| 4 | Instalación piloto (un taller real), capturas para el sitio, guía de uso en el panel | 1 semana |
| 5 | `mecanicos` + automatizaciones Pro | después del piloto |

---

## 6. Decisiones abiertas ⚠️

1. **Base**: fork de Hub Core (recomendado) o scaffold desde cero como HubPOS.
2. **Dónde vive el tema**: en Hub Core para todos (recomendado) o solo en Hub Taller.
3. **Tipografía**: Sora + Inter (marca) con los tokens de Minimal (recomendado), o Public Sans + Barlow tal cual Minimal.
4. **QS Express en los materiales**: el catálogo y `/casos` lo presentan como "HUB Taller Pro" y no lo es. O se retira ese caso hasta tener el piloto, o Hub Taller nace absorbiendo lo que QS Express ya resolvió (recepción por placa, órdenes) y el caso pasa a ser verdad. Lo segundo es mejor negocio, pero hay que decidirlo.
5. **Piloto**: ¿qué taller? Sin piloto no hay capturas reales ni testimonio.
