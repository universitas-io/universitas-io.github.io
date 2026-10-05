import { describe, it, expect } from 'vitest';
import { ogPathFor, listOgPages } from '../../src/lib/og';

describe('OG Image helper', () => {
  it('generates correct OG image paths for various routes', () => {
    expect(ogPathFor('/')).toBe('/og/index.png');
    expect(ogPathFor('/en/')).toBe('/og/en/index.png');
    expect(ogPathFor('/servicos/pesquisa-quantitativa/')).toBe(
      '/og/servicos/pesquisa-quantitativa.png'
    );
    expect(ogPathFor('/en/services/quantitative-research/')).toBe(
      '/og/en/services/quantitative-research.png'
    );
    expect(ogPathFor('/sobre/')).toBe('/og/sobre.png');
    expect(ogPathFor('/en/about/')).toBe('/og/en/about.png');
  });

  it('lists indexable pages including default for OG generation', async () => {
    const pages = await listOgPages();
    expect(pages.length).toBeGreaterThan(10);
    const defaultEntry = pages.find((p) => p.slug === 'default');
    expect(defaultEntry).toBeDefined();

    const homeEntry = pages.find((p) => p.slug === 'index');
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.lang).toBe('pt');

    const enHomeEntry = pages.find((p) => p.slug === 'en/index');
    expect(enHomeEntry).toBeDefined();
    expect(enHomeEntry?.lang).toBe('en');

    const serviceEntry = pages.find(
      (p) => p.slug === 'servicos/pesquisa-quantitativa'
    );
    expect(serviceEntry).toBeDefined();
    expect(serviceEntry?.lang).toBe('pt');
  });
});
