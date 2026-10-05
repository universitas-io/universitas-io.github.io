import { site } from '../../../site.config';
import type { Locale } from '../../i18n/routes';

export interface MetaInput {
  title: string;
  description: string;
  lang: Locale;
  pathname: string;
  alternates: Partial<Record<Locale, string>>;
  ogImage?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  hreflang: { lang: string; href: string }[];
  og: Record<string, string | string[]>;
}

export function formatTitle(title: string): string {
  if (
    title.startsWith('Universitas') ||
    title.endsWith('| Universitas')
  ) {
    return title;
  }
  return `${title} | Universitas`;
}

export function buildMeta(input: MetaInput): PageMeta {
  if (input.description.length > 155) {
    throw new Error(
      `Description exceeds 155 characters limit: ${input.description.length}`
    );
  }

  const title = formatTitle(input.title);
  const canonical = new URL(input.pathname, site.url).href;
  const robots = input.noindex ? 'noindex, follow' : 'index, follow';

  const hreflang: { lang: string; href: string }[] = [];
  if (input.alternates.pt) {
    hreflang.push({
      lang: 'pt-BR',
      href: new URL(input.alternates.pt, site.url).href
    });
  }
  if (input.alternates.en) {
    hreflang.push({
      lang: 'en',
      href: new URL(input.alternates.en, site.url).href
    });
  }

  const xDefaultHref = input.alternates.pt
    ? new URL(input.alternates.pt, site.url).href
    : input.alternates.en
      ? new URL(input.alternates.en, site.url).href
      : canonical;

  hreflang.push({
    lang: 'x-default',
    href: xDefaultHref
  });

  const localeMap = { pt: 'pt_BR', en: 'en_US' } as const;
  const currentOgLocale = localeMap[input.lang];
  const alternateOgLocale = input.lang === 'pt' ? ['en_US'] : ['pt_BR'];

  const ogImageUrl = new URL(input.ogImage || '/og/default.png', site.url).href;

  const og: Record<string, string | string[]> = {
    'og:title': title,
    'og:description': input.description,
    'og:url': canonical,
    'og:type': input.type || 'website',
    'og:locale': currentOgLocale,
    'og:locale:alternate': alternateOgLocale,
    'og:site_name': site.name,
    'og:image': ogImageUrl,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': input.description,
    'twitter:image': ogImageUrl
  };

  if (input.publishedTime) {
    og['article:published_time'] = input.publishedTime;
  }
  if (input.modifiedTime) {
    og['article:modified_time'] = input.modifiedTime;
  }

  return {
    title,
    description: input.description,
    canonical,
    robots,
    hreflang,
    og
  };
}
