import { test, expect } from '@playwright/test';
import { expectA11y } from './helpers';

test.describe('cases embedded inside respective services', () => {
  test('redirects legacy standalone case routes to corresponding service pages', async ({
    page
  }) => {
    await page.goto('/casos/');
    await expect(page).toHaveURL(/\/servicos\/$/);

    await page.goto('/en/cases/');
    await expect(page).toHaveURL(/\/en\/services\/$/);

    await page.goto('/casos/dashboard-power-bi-lr-instalacoes/');
    await expect(page).toHaveURL(/\/servicos\/dashboards-e-visualizacao\/$/);

    await page.goto('/casos/sites-academicos-e-de-pesquisa/');
    await expect(page).toHaveURL(/\/servicos\/sites-academicos\/$/);

    await page.goto('/casos/base-de-dados-youtube-tese/');
    await expect(page).toHaveURL(/\/servicos\/coleta-de-dados-digitais\/$/);

    await page.goto('/en/cases/academic-and-research-websites/');
    await expect(page).toHaveURL(/\/en\/services\/academic-websites\/$/);
  });

  test('dashboards service renders its cases inline below FAQ without linking away', async ({
    page
  }) => {
    await page.goto('/servicos/dashboards-e-visualizacao/');

    // Section exists
    const casesSection = page.locator(
      'section[aria-labelledby="cases-showcase-heading"]'
    );
    await expect(casesSection).toBeVisible();
    await expect(
      casesSection.getByRole('heading', { name: /Exemplos de Projetos Realizados/ })
    ).toBeVisible();

    // Check both dashboard cases are rendered inline
    await expect(
      casesSection.getByText(
        'Dashboard de Inteligência Operacional em Power BI para LR Instalações Especiais'
      )
    ).toBeVisible();
    await expect(
      casesSection.getByText(
        'Visualização Interativa de Redes Complexas e Clusterização com Python e D3.js'
      )
    ).toBeVisible();

    // Images rendered, including the specific gallery images for network clusters
    await expect(
      casesSection.getByRole('img', { name: 'Rede de Articulações e Polos' })
    ).toBeVisible();
    await expect(
      casesSection.getByRole('img', { name: 'Clustermap Bipartido' })
    ).toBeVisible();

    // No links taking user to separate case pages
    const standaloneLinks = casesSection.locator('a[href*="/casos/"]');
    await expect(standaloneLinks).toHaveCount(0);
  });

  test('academic websites service renders case body, gallery, and external links inline', async ({
    page
  }) => {
    await page.goto('/servicos/sites-academicos/');

    const casesSection = page.locator(
      'section[aria-labelledby="cases-showcase-heading"]'
    );
    await expect(casesSection).toBeVisible();
    await expect(
      casesSection.getByText(
        'Desenvolvimento de Portais Acadêmicos e Observatórios de Pesquisa'
      )
    ).toBeVisible();

    // External links have rel noopener
    const externalLinks = casesSection.locator('a[href^="http"]');
    const linkCount = await externalLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < linkCount; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });

  test('cases do not appear on audience pages or services index', async ({
    page
  }) => {
    // Services index
    await page.goto('/servicos/');
    await expect(
      page.locator('section[aria-labelledby="cases-showcase-heading"]')
    ).toHaveCount(0);
    await expect(
      page.locator('section[aria-labelledby="services-cases-heading"]')
    ).toHaveCount(0);

    // Audience page
    await page.goto('/para/empresas/');
    await expect(
      page.locator('section[aria-labelledby="cases-showcase-heading"]')
    ).toHaveCount(0);
    await expect(
      page.locator('section[aria-labelledby="related-cases-heading"]')
    ).toHaveCount(0);
  });

  test('service page with embedded cases passes accessibility', async ({
    page
  }) => {
    await page.goto('/servicos/dashboards-e-visualizacao/');
    await expectA11y(page);
  });
});
