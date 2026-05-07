import { defaultLocale, locales, routes, ui } from './ui';
import type { Locale, UiKey } from './ui';

export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/')[1];
  if (locales.includes(seg as Locale)) return seg as Locale;
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key] ?? key;
  };
}

/**
 * Returns the URL for a logical route in the given locale.
 * Logical keys live in `routes` (home, products, pricing, ...).
 */
export function localizedHref(key: keyof typeof routes['es'], locale: Locale): string {
  return routes[locale][key] ?? routes[defaultLocale][key] ?? '/';
}

/**
 * Given the current pathname, returns its counterpart in the other locale.
 * Falls back to home when the route can't be matched.
 */
export function alternateHref(currentPath: string, targetLocale: Locale): string {
  const currentLocale = currentPath.startsWith('/en') ? 'en' : 'es';
  if (currentLocale === targetLocale) return currentPath;

  const currentRoutes = routes[currentLocale];
  for (const key of Object.keys(currentRoutes) as Array<keyof typeof currentRoutes>) {
    const path = currentRoutes[key];
    if (path === currentPath || path.replace(/\/$/, '') === currentPath.replace(/\/$/, '')) {
      return routes[targetLocale][key];
    }
  }
  return routes[targetLocale].home;
}

export { defaultLocale, locales };
export type { Locale };
