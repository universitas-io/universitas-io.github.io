import { test, expect } from 'vitest';
import {
  organization,
  website,
  breadcrumbs,
  service,
  faqPage,
  article,
  person,
  aboutPage,
  contactPage,
  webPage,
  graph
} from '../../src/lib/seo/jsonld';
import { site } from '../../site.config';

test('organization JSON-LD structure', () => {
  const org = organization() as { sameAs?: string[] };
  expect(org).toMatchObject({
    '@type': 'Organization',
    name: 'Universitas',
    url: site.url
  });
  expect(org.sameAs).toContain(site.social.linkedin);
});

test('website JSON-LD structure', () => {
  const ws = website('pt');
  expect(ws).toMatchObject({
    '@type': 'WebSite',
    name: 'Universitas',
    url: site.url,
    inLanguage: 'pt-BR'
  });
});

test('breadcrumbs JSON-LD structure', () => {
  const bc = breadcrumbs([
    { name: 'Início', pathname: '/' },
    { name: 'Serviços', pathname: '/servicos/' }
  ]);
  expect(bc).toMatchObject({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { position: 1, item: `${site.url}/` },
      { position: 2, item: `${site.url}/servicos/` }
    ]
  });
});

test('faqPage JSON-LD structure', () => {
  const faq = faqPage([{ q: 'Vocês emitem NF?', a: 'Sim, emitimos.' }]);
  expect(faq).toMatchObject({
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Vocês emitem NF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, emitimos.'
        }
      }
    ]
  });
});

test('service JSON-LD structure', () => {
  const s = service({
    name: 'Pesquisa Quantitativa',
    description: 'Análise de dados com R e Python',
    pathname: '/servicos/pesquisa-quantitativa/',
    lang: 'pt'
  });
  expect(s).toMatchObject({
    '@type': 'Service',
    name: 'Pesquisa Quantitativa',
    provider: { '@type': 'Organization', name: 'Universitas' },
    areaServed: { '@type': 'Country', name: 'Brasil' }
  });
});

test('article and person JSON-LD structure', () => {
  const authorData = {
    name: 'Fulano da Silva',
    jobTitle: 'Pesquisador',
    sameAs: ['https://orcid.org/0000-0000-0000-0000']
  };
  const p = person(authorData);
  expect(p).toMatchObject({
    '@type': 'Person',
    name: 'Fulano da Silva',
    jobTitle: 'Pesquisador'
  });

  const art = article({
    headline: 'Artigo sobre Pesquisa',
    description: 'Resumo do artigo',
    pathname: '/insights/artigo-pesquisa/',
    lang: 'pt',
    datePublished: '2026-10-01T10:00:00Z',
    author: authorData
  });
  expect(art).toMatchObject({
    '@type': 'Article',
    headline: 'Artigo sobre Pesquisa',
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: 'Fulano da Silva',
      sameAs: ['https://orcid.org/0000-0000-0000-0000']
    }
  });
});

test('aboutPage and contactPage JSON-LD structure', () => {
  const about = aboutPage({
    pathname: '/sobre/',
    lang: 'pt',
    members: [{ name: 'Membro 1' }]
  });
  expect(about).toMatchObject({
    '@type': 'AboutPage',
    url: `${site.url}/sobre/`,
    inLanguage: 'pt-BR'
  });

  const contact = contactPage({
    pathname: '/contato/',
    lang: 'pt'
  });
  expect(contact).toMatchObject({
    '@type': 'ContactPage',
    url: `${site.url}/contato/`,
    inLanguage: 'pt-BR'
  });

  const web = webPage({
    name: 'Pesquisa para a Academia',
    description: 'Apoio metodológico',
    pathname: '/para/academia/',
    lang: 'pt'
  });
  expect(web).toMatchObject({
    '@type': 'WebPage',
    name: 'Pesquisa para a Academia',
    url: `${site.url}/para/academia/`,
    inLanguage: 'pt-BR'
  });
});

test('graph JSON-LD structure combines multiple schemas', () => {
  const g = graph(organization(), website('pt'));
  expect(g['@context']).toBe('https://schema.org');
  expect(Array.isArray(g['@graph'])).toBe(true);
});
