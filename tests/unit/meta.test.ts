import { test, expect } from 'vitest';
import { buildMeta, formatTitle } from '../../src/lib/seo/meta';
import { site } from '../../site.config';

test('buildMeta generates title, canonical, hreflang, robots, and og tags', () => {
  const m = buildMeta({
    title: 'Pesquisa Quantitativa',
    description: 'x'.repeat(100),
    lang: 'pt',
    pathname: '/servicos/pesquisa-quantitativa/',
    alternates: {
      pt: '/servicos/pesquisa-quantitativa/',
      en: '/en/services/quantitative-research/'
    }
  });

  expect(m.title).toBe('Pesquisa Quantitativa | Universitas');
  expect(formatTitle('Universitas: Consultoria em pesquisa')).toBe(
    'Universitas: Consultoria em pesquisa'
  );
  expect(m.canonical).toBe(`${site.url}/servicos/pesquisa-quantitativa/`);
  expect(m.hreflang).toEqual([
    { lang: 'pt-BR', href: `${site.url}/servicos/pesquisa-quantitativa/` },
    { lang: 'en', href: `${site.url}/en/services/quantitative-research/` },
    { lang: 'x-default', href: `${site.url}/servicos/pesquisa-quantitativa/` }
  ]);
  expect(m.robots).toBe('index, follow');
  expect(m.og['og:locale']).toBe('pt_BR');
  expect(m.og['og:locale:alternate']).toEqual(['en_US']);
  expect(m.og['twitter:card']).toBe('summary_large_image');
});

test('buildMeta handles noindex', () => {
  const m = buildMeta({
    title: 'Página Privada',
    description: 'Descrição',
    lang: 'pt',
    pathname: '/privada/',
    alternates: {},
    noindex: true
  });
  expect(m.robots).toBe('noindex, follow');
});

test('buildMeta throws if description exceeds 155 chars', () => {
  expect(() =>
    buildMeta({
      title: 'Título',
      description: 'x'.repeat(156),
      lang: 'pt',
      pathname: '/teste/',
      alternates: {}
    })
  ).toThrow(/155/);
});

test('buildMeta handles single locale alternate with x-default', () => {
  const m = buildMeta({
    title: 'Only in PT',
    description: 'Desc',
    lang: 'pt',
    pathname: '/insights/so-em-pt/',
    alternates: { pt: '/insights/so-em-pt/' }
  });
  expect(m.hreflang).toEqual([
    { lang: 'pt-BR', href: `${site.url}/insights/so-em-pt/` },
    { lang: 'x-default', href: `${site.url}/insights/so-em-pt/` }
  ]);
});
