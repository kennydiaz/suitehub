export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const labels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

/**
 * Map of route slugs per locale.
 * The first segment after the locale prefix is the slug used in URLs.
 * Use `localizedHref('/about', 'en')` to build URLs.
 */
export const routes: Record<Locale, Record<string, string>> = {
  es: {
    home: '/',
    products: '/productos',
    pricing: '/precios',
    verticals: '/verticales',
    verticalTaller: '/verticales/taller',
    verticalSalon: '/verticales/salon',
    verticalRestaurant: '/verticales/restaurant',
    cases: '/casos',
    blog: '/blog',
    about: '/sobre',
    contact: '/contacto',
    privacy: '/privacidad',
    terms: '/terminos',
  },
  en: {
    home: '/en/',
    products: '/en/products',
    pricing: '/en/pricing',
    verticals: '/en/verticals',
    verticalTaller: '/en/verticals/taller',
    verticalSalon: '/en/verticals/salon',
    verticalRestaurant: '/en/verticals/restaurant',
    cases: '/en/cases',
    blog: '/en/blog',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy',
    terms: '/en/terms',
  },
};

/**
 * UI string dictionary.
 * Heavy marketing copy lives directly in each page; this dictionary only
 * holds shared chrome (header / footer / common labels).
 */
export const ui = {
  es: {
    'nav.home':       'Inicio',
    'nav.products':   'Ediciones',
    'nav.verticals':  'Verticales',
    'nav.cases':      'Casos',
    'nav.blog':       'Blog',
    'nav.pricing':    'Precios',
    'nav.about':      'Nosotros',
    'nav.contact':    'Contacto',
    'nav.demo':       'Solicitar demo',
    'nav.menu':       'Menú',
    'nav.lang.toggle': 'Cambiar idioma',
    'footer.tagline': 'SuiteHub es un sistema de gestión para PYMEs de Panamá, USA, Venezuela, España y Colombia. Tecnología de empresa grande, pero fácil de usar y a un precio que una pyme puede pagar.',
    'footer.col.product': 'SuiteHub',
    'footer.col.verticals': 'Verticales',
    'footer.col.company':  'Empresa',
    'footer.col.cta':      '¿Listo?',
    'footer.cta.button':   'Hablar con ventas',
    'footer.cta.note':     'Te respondemos en minutos en horario laboral.',
    'footer.langs.label':  'Disponible en',
    'footer.editions.lite':       'Hub Lite',
    'footer.editions.core':       'Hub Core',
    'footer.editions.pro':        'Hub Pro',
    'footer.editions.enterprise': 'Hub Enterprise',
    'footer.verticals.workshop':   'HUB Taller',
    'footer.verticals.restaurant': 'HUB Restaurant',
    'footer.verticals.salon':      'HUB Salon',
    'footer.verticals.pos':        'HUB POS',
    'footer.verticals.all':        'Ver todos',
    'footer.company.cases':   'Casos de éxito',
    'footer.company.blog':    'Blog',
    'footer.company.pricing': 'Precios',
    'footer.company.about':   'Nosotros',
    'footer.company.contact': 'Contacto',
    'footer.copyright':       'Todos los derechos reservados. Producto de PROOQ LLC (USA). Operado en Panamá por PROOQ S.A.',
    'footer.privacy':         'Privacidad',
    'footer.terms':           'Términos',
    'footer.madeWith':        'Hecho con',
    'footer.madeIn':          'en Panamá',
    'wa.float.aria':          'Hablar por WhatsApp',
    'wa.text.demo':           'Hola%2C%20me%20interesa%20una%20demo%20de%20SuiteHub',
    'wa.text.more':           'Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20SuiteHub',
    'wa.text.sales':          'Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20SuiteHub',
  },
  en: {
    'nav.home':       'Home',
    'nav.products':   'Editions',
    'nav.verticals':  'Verticals',
    'nav.cases':      'Case studies',
    'nav.blog':       'Blog',
    'nav.pricing':    'Pricing',
    'nav.about':      'About',
    'nav.contact':    'Contact',
    'nav.demo':       'Request demo',
    'nav.menu':       'Menu',
    'nav.lang.toggle': 'Switch language',
    'footer.tagline': 'SuiteHub is business management software for SMBs in Panama, the USA, Venezuela, Spain, and Colombia. The kind of tools big companies use, but easy to learn and priced for a small business.',
    'footer.col.product': 'SuiteHub',
    'footer.col.verticals': 'Verticals',
    'footer.col.company':  'Company',
    'footer.col.cta':      'Ready?',
    'footer.cta.button':   'Talk to sales',
    'footer.cta.note':     'We usually reply within minutes during business hours.',
    'footer.langs.label':  'Available in',
    'footer.editions.lite':       'Hub Lite',
    'footer.editions.core':       'Hub Core',
    'footer.editions.pro':        'Hub Pro',
    'footer.editions.enterprise': 'Hub Enterprise',
    'footer.verticals.workshop':   'HUB Workshop',
    'footer.verticals.restaurant': 'HUB Restaurant',
    'footer.verticals.salon':      'HUB Salon',
    'footer.verticals.pos':        'HUB POS',
    'footer.verticals.all':        'See all',
    'footer.company.cases':   'Case studies',
    'footer.company.blog':    'Blog',
    'footer.company.pricing': 'Pricing',
    'footer.company.about':   'About us',
    'footer.company.contact': 'Contact',
    'footer.copyright':       'All rights reserved. A PROOQ LLC (USA) product. Operated in Panama by PROOQ S.A.',
    'footer.privacy':         'Privacy',
    'footer.terms':           'Terms',
    'footer.madeWith':        'Made with',
    'footer.madeIn':          'in Panama',
    'wa.float.aria':          'Chat on WhatsApp',
    'wa.text.demo':           'Hello%2C%20I%27d%20like%20to%20see%20a%20demo%20of%20SuiteHub',
    'wa.text.more':           'Hello%2C%20I%27d%20like%20to%20learn%20more%20about%20SuiteHub',
    'wa.text.sales':          'Hello%2C%20I%27d%20like%20to%20talk%20to%20SuiteHub%20sales',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];
