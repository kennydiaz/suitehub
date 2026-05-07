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
    cases: '/casos',
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
    cases: '/en/cases',
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
    'nav.pricing':    'Precios',
    'nav.about':      'Nosotros',
    'nav.contact':    'Contacto',
    'nav.demo':       'Solicitar demo',
    'nav.menu':       'Menú',
    'nav.lang.toggle': 'Cambiar idioma',
    'footer.tagline': 'SuiteHub es la plataforma de gestión empresarial para PYMEs panameñas que quieren crecer con tecnología corporativa, sin la complejidad ni el costo.',
    'footer.col.product': 'SuiteHub',
    'footer.col.verticals': 'Verticales',
    'footer.col.company':  'Empresa',
    'footer.col.cta':      '¿Listo?',
    'footer.cta.button':   'Hablar con ventas',
    'footer.cta.note':     'Respuesta en minutos durante horario laboral.',
    'footer.langs.label':  'Disponible en',
    'footer.editions.lite':       'Edición Lite',
    'footer.editions.core':       'Edición Core',
    'footer.editions.pro':        'Edición Pro',
    'footer.editions.enterprise': 'Edición Enterprise',
    'footer.verticals.workshop':   'HUB Taller',
    'footer.verticals.restaurant': 'HUB Restaurant',
    'footer.verticals.pos':        'HUB POS',
    'footer.verticals.all':        'Ver todos',
    'footer.company.cases':   'Casos de éxito',
    'footer.company.pricing': 'Precios',
    'footer.company.about':   'Nosotros',
    'footer.company.contact': 'Contacto',
    'footer.copyright':       'Todos los derechos reservados. Distribuido en Panamá por PROOQ S.A.',
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
    'nav.pricing':    'Pricing',
    'nav.about':      'About',
    'nav.contact':    'Contact',
    'nav.demo':       'Request demo',
    'nav.menu':       'Menu',
    'nav.lang.toggle': 'Switch language',
    'footer.tagline': 'SuiteHub is the business management platform for Panamanian SMEs that want enterprise-grade technology without the complexity or cost.',
    'footer.col.product': 'SuiteHub',
    'footer.col.verticals': 'Verticals',
    'footer.col.company':  'Company',
    'footer.col.cta':      'Ready?',
    'footer.cta.button':   'Talk to sales',
    'footer.cta.note':     'Reply within minutes during business hours.',
    'footer.langs.label':  'Available in',
    'footer.editions.lite':       'Lite Edition',
    'footer.editions.core':       'Core Edition',
    'footer.editions.pro':        'Pro Edition',
    'footer.editions.enterprise': 'Enterprise Edition',
    'footer.verticals.workshop':   'HUB Workshop',
    'footer.verticals.restaurant': 'HUB Restaurant',
    'footer.verticals.pos':        'HUB POS',
    'footer.verticals.all':        'See all',
    'footer.company.cases':   'Case studies',
    'footer.company.pricing': 'Pricing',
    'footer.company.about':   'About us',
    'footer.company.contact': 'Contact',
    'footer.copyright':       'All rights reserved. Distributed in Panama by PROOQ S.A.',
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
