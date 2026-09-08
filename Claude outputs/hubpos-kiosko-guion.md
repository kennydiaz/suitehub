# HubPOS by SuiteHub — Kiosko de autoservicio · Guion de video

> Escena de referencia: food truck con kiosko en tablet, dos clientes ordenando. Duración objetivo: 45–50 s (versión larga) y 20 s (Reels/Story).
> Tono: directo, panameño, tuteo. Una idea por frase. Sin prometer nada que no esté implementado.

---

## 1. Versión principal (≈50 s · 115 palabras)

Es sábado. Hay fila. Y tu cliente quiere pedir ya.

Con el kiosko de HubPOS, él mismo arma su pedido en la pantalla: elige, agrega, confirma. En español o en inglés.

Recibe su número y pasa a caja. Sin esperar a que alguien le tome la orden. Sin ese "eso no fue lo que pedí".

La comanda llega directo a cocina. Tu equipo cocina; el kiosko vende.

¿Se fue el internet? HubPOS sigue funcionando, porque corre en tu propia red.

HubPOS by SuiteHub. Hecho en Panamá para restaurantes, food trucks y cafés que no quieren perder ni un pedido.

Escríbenos por WhatsApp y te lo mostramos en tu local.

---

## 2. Versión corta para Reels / Story (≈20 s · 48 palabras)

Fila larga, un solo cajero… y el cliente que se va.

Con el kiosko de HubPOS, el cliente pide solo: elige en la pantalla, recibe su número y pasa a caja. La comanda cae directo en cocina.

Y si se va el internet, sigues vendiendo.

HubPOS by SuiteHub. Escríbenos.

---

## 3. Texto listo para ElevenLabs (con pausas)

Pegar tal cual. Los `<break>` son pausas que ElevenLabs respeta; "Hub Pos" y "Suit Hub" van separados para que la voz los pronuncie bien (en pantalla se escriben normal).

```
Es sábado. <break time="0.4s"/> Hay fila. <break time="0.4s"/> Y tu cliente quiere pedir ya. <break time="0.8s"/>
Con el kiosko de Hub Pos, él mismo arma su pedido en la pantalla: elige, agrega, confirma. <break time="0.3s"/> En español o en inglés. <break time="0.7s"/>
Recibe su número y pasa a caja. <break time="0.4s"/> Sin esperar a que alguien le tome la orden. <break time="0.3s"/> Sin ese "eso no fue lo que pedí". <break time="0.7s"/>
La comanda llega directo a cocina. <break time="0.3s"/> Tu equipo cocina; <break time="0.2s"/> el kiosko vende. <break time="0.7s"/>
¿Se fue el internet? <break time="0.4s"/> Hub Pos sigue funcionando, porque corre en tu propia red. <break time="0.8s"/>
Hub Pos, by Suit Hub. <break time="0.4s"/> Hecho en Panamá para restaurantes, food trucks y cafés que no quieren perder ni un pedido. <break time="0.7s"/>
Escríbenos por WhatsApp <break time="0.2s"/> y te lo mostramos en tu local.
```

**Ajustes sugeridos en ElevenLabs**
- Modelo: Eleven Multilingual v2 (o v3 si ya lo tienes). Idioma: Español.
- Voz: latinoamericana neutra, cálida, ritmo medio. Evita voces "locutor de radio"; el video es de producto, no de oferta.
- Stability 45–55 · Similarity 75 · Style 10–20 · Speaker boost activado.
- Velocidad 1.0. Si la voz corre, baja a 0.95; no agregues más pausas.
- Genera 2–3 tomas y elige la que entone mejor "¿Se fue el internet?" (es el gancho).

---

## 4. Texto en pantalla (sincronizado con la voz)

Regla: **el 80% ve el video sin sonido**. Subtítulos siempre, y un rótulo corto por beat que repita la idea, no la frase.

| Momento (s) | Voz | Rótulo en pantalla | Plano sugerido |
|---|---|---|---|
| 0–4 | "Es sábado. Hay fila…" | **Hay fila. Hay prisa.** | Plano general del truck con clientes (tu foto). |
| 4–12 | "…arma su pedido en la pantalla…" | **El cliente pide solo** · ES / EN | Cerrado al kiosko: dedo tocando la grilla de productos. |
| 12–19 | "Recibe su número y pasa a caja…" | **Número en pantalla → paga en caja** | Ticket/número en pantalla, cliente caminando a la ventanilla. |
| 19–25 | "La comanda llega directo a cocina…" | **Comanda directa a cocina** | Impresora térmica o pantalla de cocina (KDS) recibiendo la orden. |
| 25–31 | "¿Se fue el internet?…" | **Funciona sin internet** · corre en tu red | Ícono de wifi tachado → el kiosko sigue operando. |
| 31–42 | "HubPOS by SuiteHub. Hecho en Panamá…" | Badge HUB POS + **HubPOS** *by SuiteHub* · Hecho en Panamá 🇵🇦 | Placa de marca sobre navy `#06192E`, acento verde POS `#16A34A`. |
| 42–50 | "Escríbenos por WhatsApp…" | **WhatsApp +507 6632-6006** · suitehub.net | Cierre: badge, número grande, QR opcional al wa.me. |

**Detalles de arte**
- Tipografía: Sora SemiBold para rótulos, Inter para subtítulos (las mismas del brand kit).
- Rótulos: máximo 5 palabras. Fondo semitransparente navy, texto blanco, acento verde `#16A34A` (color de HUB POS).
- Formato vertical 9:16 para Reels/Story y 1:1 para feed; deja zona segura arriba (120 px) y abajo (250 px) para que la interfaz de Instagram no tape los rótulos.
- Usa el badge `hub-pos-badge.svg` y el logo `hub-pos-logo.svg` del brand kit; no rehacer la marca.
- Precio: si quieres cerrar con "desde $48/mes", ponlo solo en el rótulo final, no en la voz (así el video sirve aunque cambie el precio).

---

## 5. Antes de publicar

1. **Rostros y marca del truck.** En la foto se ven clientes y la marca La Arepería Panamá. Si son cliente tuyo, pídeles autorización escrita (un WhatsApp basta) para usar el material y sus caras; si no lo son, difumina rostros y evita que el nombre del truck se lea como aval.
2. **Si La Arepería sí es cliente**, vale oro decirlo: cambia el cierre por *"Como en La Arepería Panamá. Escríbenos y te lo mostramos en tu local."* Es la prueba social más fuerte que puedes tener en 3 segundos.
3. Lo que dice el guion está en la ficha de HubPOS: kiosko ES/EN, número y pago en caja, comanda a cocina por estación, funciona sin internet (PWA en red local). No agrega nada que no exista.
4. Registra el video en el panel como pieza de Contenido (pilar **producto**, vertical **pos**, plantilla Producto para la portada) para que lleve código y link `wa.me` con seguimiento.
