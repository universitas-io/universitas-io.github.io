import { site } from '../../../site.config';
import type { Locale } from '../../i18n/routes';

export interface PersonInput {
  name: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
  alumniOf?: string[];
}

export function person(p: PersonInput): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@type': 'Person',
    name: p.name
  };
  if (p.jobTitle) result.jobTitle = p.jobTitle;
  if (p.url) result.url = p.url;
  if (p.sameAs && p.sameAs.length > 0) result.sameAs = p.sameAs;
  if (p.alumniOf && p.alumniOf.length > 0) result.alumniOf = p.alumniOf;
  return result;
}

export function organization(): Record<string, unknown> {
  const sameAs: string[] = [];
  if (site.social.instagram) sameAs.push(site.social.instagram);
  if (site.social.linkedin) sameAs.push(site.social.linkedin);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: new URL('/apple-touch-icon.png', site.url).href,
    sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: site.contact.email,
      telephone: `+${site.contact.whatsapp}`
    }
  };
}

export function website(lang: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: lang === 'pt' ? 'pt-BR' : 'en'
  };
}

export function breadcrumbs(
  items: { name: string; pathname: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.pathname, site.url).href
    }))
  };
}

export function service(options: {
  name: string;
  description: string;
  pathname: string;
  lang: Locale;
  audience?: string[];
  serviceType?: string;
}): Record<string, unknown> {
  const res: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    url: new URL(options.pathname, site.url).href,
    inLanguage: options.lang === 'pt' ? 'pt-BR' : 'en',
    provider: {
      '@type': 'Organization',
      name: site.name,
      url: site.url
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brasil'
    }
  };

  if (options.serviceType) {
    res.serviceType = options.serviceType;
  }

  if (options.audience && options.audience.length > 0) {
    res.audience = options.audience.map((a) => ({
      '@type': 'Audience',
      audienceType: a
    }));
  }

  return res;
}

export function faqPage(
  items: { q: string; a: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}

export function article(options: {
  headline: string;
  description: string;
  pathname: string;
  lang: Locale;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author: PersonInput;
}): Record<string, unknown> {
  const res: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    url: new URL(options.pathname, site.url).href,
    inLanguage: options.lang === 'pt' ? 'pt-BR' : 'en',
    datePublished: options.datePublished,
    author: person(options.author),
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url
    }
  };

  if (options.dateModified) {
    res.dateModified = options.dateModified;
  }
  if (options.image) {
    res.image = new URL(options.image, site.url).href;
  }

  return res;
}

export function aboutPage(options: {
  pathname: string;
  lang: Locale;
  members: PersonInput[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: new URL(options.pathname, site.url).href,
    inLanguage: options.lang === 'pt' ? 'pt-BR' : 'en',
    mainEntity: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      member: options.members.map((m) => person(m))
    }
  };
}

export function contactPage(options: {
  pathname: string;
  lang: Locale;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: new URL(options.pathname, site.url).href,
    inLanguage: options.lang === 'pt' ? 'pt-BR' : 'en'
  };
}

export function webPage(options: {
  name: string;
  description: string;
  pathname: string;
  lang: Locale;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url: new URL(options.pathname, site.url).href,
    inLanguage: options.lang === 'pt' ? 'pt-BR' : 'en'
  };
}

export function graph(
  ...nodes: Record<string, unknown>[]
): Record<string, unknown> {
  // Strip individual @context before putting into @graph
  const cleanedNodes = nodes.map((n) => {
    const copy = { ...n };
    delete copy['@context'];
    return copy;
  });

  return {
    '@context': 'https://schema.org',
    '@graph': cleanedNodes
  };
}
