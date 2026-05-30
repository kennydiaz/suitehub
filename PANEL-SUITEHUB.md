# 🎛️ Panel de Control SuiteHub — Plan

> Documento de arranque. El sitio actual (`suitehub.net`) es Astro estático; el **panel** es una app aparte con backend dinámico.

## 🎯 Objetivo
Construir un **panel de control de SuiteHub** multi-módulo. El **primer módulo** es **Presentaciones comerciales**: biblioteca con el pitch de todos los productos, con envío por **correo** y **WhatsApp**.

## ✅ Decisiones (2026-05-29)
| Tema | Decisión |
|---|---|
| **Stack** | App **PHP** propia (reutiliza router, auth, Mailer SMTP, deploy GitHub Actions → Hostinger de los productos). No Astro. |
| **Dominio panel** | `panel.suitehub.net` (login). |
| **Acceso** | Solo **superadmin** por ahora. |
| **WhatsApp** | **wa.me** con enlace a la landing pública. (WhatsApp Cloud API queda para después.) |
| **Landings públicas** | Las sirve el **propio panel PHP** (una sola fuente de datos para correo + web), en subdominio amigable **`ver.suitehub.net/<producto>`**. No bajo `suitehub.net` (es Astro estático). |
| **Productos iniciales** | **Hub Carwash** y **Hub POS**. |

## 🧩 Módulo 1 — Presentaciones comerciales
**Data-driven:** una sola plantilla renderiza cualquier producto desde sus datos.
```
producto = { nombre, tagline, logo, colores, features[], capturas[], planes[], CTA }
```
Dos salidas por presentación, desde los **mismos datos**:
- 📧 **Versión correo** (HTML inline, estilo del pitch de Hub Carwash) → envío por SMTP (Mailer).
- 🌐 **Versión web pública** (landing responsive, sin login) en `ver.suitehub.net/<producto>` → para compartir por WhatsApp y en general.

**Envíos:**
- Correo: destinatario + nota personal + Mailer.
- WhatsApp: botón `wa.me` con mensaje + link a la landing.
- (Opcional) PDF para adjuntar.

> **Prototipo ya hecho:** `htdocs/hubcarwash/src/Pitch.php` (pitch email-safe con tokens, emojis, capturas, precio y CTA). Se generaliza a plantilla data-driven.

## 🗺️ Roadmap de módulos (después)
🗂️ Catálogo de productos · 👥 CRM de prospectos (a quién/qué/cuándo/canal) · 🔑 Licencias (portal.prooq.com) · 💳 Suscripciones y cobros · 🎫 Soporte · 📊 Dashboard de negocio (clientes activos, MRR).

## 🚀 Plan de arranque (mañana)
1. **Scaffold** del panel PHP: login superadmin + layout con módulos.
2. **Productos como datos**: Hub Carwash y Hub POS.
3. **Plantilla de pitch reutilizable** → versión correo + versión landing pública.
4. **Envíos**: correo (Mailer) + botón WhatsApp (wa.me con link de `ver.suitehub.net/<producto>`).
5. Crear **subdominio `ver.suitehub.net`** apuntando al panel.
6. *(Fase 2)* mini-CRM de prospectos.

## 📇 Datos de marca / contacto
- Contacto: WhatsApp **+507 6632-6006** · **info@suitehub.net** · **suitehub.net**
- Hub Carwash — precio de lanzamiento: **$24/mes** o **$240/año** (ahorra $48 = 2 meses).
- Hub POS — *(pendiente: descripción, funciones, capturas, precio).*

## ♻️ Qué se reutiliza de los productos
Auth + roles · Mailer SMTP · plantilla del pitch · tokens/branding · pipeline de deploy automático a Hostinger.
