/**
 * Interruptor de la razón social en el sitio público.
 *
 * SuiteHub es un producto de PROOQ LLC (USA), operado en Panamá por PROOQ S.A.
 * Mientras esta constante valga `false`, ninguna de las dos se nombra en el sitio.
 *
 * Para revertirlo: ponla en `true`. No hay que tocar nada más. Cada lugar donde se
 * nombraban consulta esta constante y vuelve solo a su texto completo, incluidos los
 * metadatos, el JSON-LD y las páginas legales.
 *
 * Lo único que NO depende de aquí, porque no es texto:
 *   - public/images/products/boutique/factura.svg, una factura de ejemplo donde el
 *     emisor decía PROOQ S.A. Se cambió por el negocio ficticio del propio mockup,
 *     que además es lo coherente: la factura la emite la boutique, no nosotros.
 *   - El endpoint de formularios (hubpro.prooq.com) en src/components/LeadForm.astro.
 *     Es un dominio, se ve en el HTML y en la red del navegador, y solo se puede
 *     cambiar moviendo el servicio o poniéndole un dominio propio delante.
 *
 * Nota sobre las páginas legales: Términos identifica a la contraparte del contrato y
 * Privacidad al responsable del tratamiento de datos. Ocultar ahí la razón social no es
 * lo mismo que ocultarla en el copy comercial; conviene decidirlo a conciencia.
 */
export const MOSTRAR_RAZON_SOCIAL = false;

/** Devuelve el fragmento con la razón social, o cadena vacía si está oculta. */
export const rs = (texto: string): string => (MOSTRAR_RAZON_SOCIAL ? texto : '');
