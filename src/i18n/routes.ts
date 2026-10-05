export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt';

export type RouteKey =
  | 'home'
  | 'services'
  | 'audiences'
  | 'cases'
  | 'insights'
  | 'about'
  | 'contact'
  | 'thanks'
  | 'privacy';

export const segments: Record<
  Exclude<RouteKey, 'home'>,
  Record<Locale, string>
> = {
  services: {
    pt: 'servicos',
    en: 'services'
  },
  audiences: {
    pt: 'para',
    en: 'for'
  },
  cases: {
    pt: 'casos',
    en: 'cases'
  },
  insights: {
    pt: 'insights',
    en: 'insights'
  },
  about: {
    pt: 'sobre',
    en: 'about'
  },
  contact: {
    pt: 'contato',
    en: 'contact'
  },
  thanks: {
    pt: 'contato/obrigado',
    en: 'contact/thank-you'
  },
  privacy: {
    pt: 'privacidade',
    en: 'privacy'
  }
};

export function path(lang: Locale, key: RouteKey, slug?: string): string {
  const prefix = lang === 'pt' ? '' : '/en';

  if (key === 'home') {
    return lang === 'pt' ? '/' : '/en/';
  }

  const seg = segments[key][lang];
  if (slug) {
    return `${prefix}/${seg}/${slug}/`;
  }
  return `${prefix}/${seg}/`;
}

export function staticAlternate(
  pathname: string,
  target: Locale
): string | null {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const routeKeys: RouteKey[] = [
    'home',
    'services',
    'audiences',
    'cases',
    'insights',
    'about',
    'contact',
    'thanks',
    'privacy'
  ];

  for (const key of routeKeys) {
    for (const lang of locales) {
      if (path(lang, key) === normalized) {
        return path(target, key);
      }
    }
  }

  return null;
}

export function langFromPath(pathname: string): Locale {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (normalized === '/en/' || normalized.startsWith('/en/')) {
    return 'en';
  }
  return 'pt';
}
