import { describe, it, expect } from 'vitest';
import { redirects } from '../../src/i18n/redirects';

describe('Redirects map', () => {
  it('maps legacy Hugo URLs to correct modern Astro paths', () => {
    expect(redirects['/p/python-r/']).toBe('/servicos/pesquisa-quantitativa/');
    expect(redirects['/p/site-academico/']).toBe('/servicos/sites-academicos/');
    expect(redirects['/p/dashboard-dados/']).toBe(
      '/servicos/dashboards-e-visualizacao/'
    );
    expect(redirects['/p/diagramacao-formatacao/']).toBe(
      '/servicos/diagramacao-e-formatacao/'
    );
    expect(redirects['/archives/']).toBe('/insights/');
    expect(redirects['/categories/']).toBe('/servicos/');
    expect(redirects['/tags/']).toBe('/servicos/');
    expect(redirects['/pt-br/']).toBe('/');

    expect(redirects['/en/p/quantitative-research/']).toBe(
      '/en/services/quantitative-research/'
    );
    expect(redirects['/en/p/academic-website/']).toBe(
      '/en/services/academic-websites/'
    );
    expect(redirects['/en/p/dashboard-dados/']).toBe(
      '/en/services/dashboards-and-data-visualization/'
    );
    expect(redirects['/en/p/diagramacao-formatacao/']).toBe(
      '/en/services/document-layout-and-formatting/'
    );
    expect(redirects['/en/archives/']).toBe('/en/insights/');
  });

  it('contains legacy redirects and case redirects to services', () => {
    expect(redirects['/casos/']).toBe('/servicos/');
    expect(redirects['/en/cases/']).toBe('/en/services/');
    expect(redirects['/casos/dashboard-power-bi-lr-instalacoes/']).toBe(
      '/servicos/dashboards-e-visualizacao/'
    );
    expect(redirects['/casos/sites-academicos-e-de-pesquisa/']).toBe(
      '/servicos/sites-academicos/'
    );
    expect(Object.keys(redirects).length).toBeGreaterThanOrEqual(13);
  });

  it('all redirect targets end with trailing slash', () => {
    for (const to of Object.values(redirects)) {
      expect(to).toMatch(/\/$/);
    }
  });
});
