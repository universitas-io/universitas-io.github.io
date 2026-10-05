import { test, expect } from '@playwright/test';
import { expectA11y } from './helpers';

test.describe('simple project examples embedded inside respective services', () => {
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

  test('diagramacao service renders simple clean list of project links', async ({
    page
  }) => {
    await page.goto('/servicos/diagramacao-e-formatacao/');

    const section = page.locator(
      'section[aria-labelledby="cases-showcase-heading"]'
    );
    await expect(section).toBeVisible();
    await expect(
      section.getByRole('heading', { name: /Exemplos de Serviços Realizados/ })
    ).toBeVisible();

    const dissertacaoLink = section.getByRole('link', {
      name: /Dissertação de Mestrado/
    });
    await expect(dissertacaoLink).toBeVisible();
    await expect(dissertacaoLink).toHaveAttribute(
      'href',
      'https://www.academia.edu/88065978'
    );

    const anaisLink = section.getByRole('link', {
      name: /Anais Eletrônicos da XXXIV Semana de História da UFJF/
    });
    await expect(anaisLink).toBeVisible();
    await expect(anaisLink).toHaveAttribute(
      'href',
      'https://www.academia.edu/124845124/'
    );
  });

  test('academic websites service renders simple list with links and screenshots', async ({
    page
  }) => {
    await page.goto('/servicos/sites-academicos/');

    const section = page.locator(
      'section[aria-labelledby="cases-showcase-heading"]'
    );
    await expect(section).toBeVisible();
    await expect(
      section.getByRole('heading', {
        name: /Exemplos de Sites Acadêmicos Criados/
      })
    ).toBeVisible();

    // Verify all 6 links
    await expect(
      section.getByRole('link', {
        name: /Observatório da Extrema Direita Latino-Americana \| OEDLA/
      })
    ).toBeVisible();
    await expect(
      section.getByRole('link', {
        name: /Laboratório Interdisciplinar em Inteligência Artificial \| LABIIA/
      })
    ).toBeVisible();
    await expect(
      section.getByRole('link', {
        name: /II Seminário Discente do Programa de Pós-graduação em Ciência Política da Unicamp/
      })
    ).toBeVisible();
    await expect(
      section.getByRole('link', {
        name: /Site de Análise de processos seletivos/
      })
    ).toBeVisible();
    await expect(
      section.getByRole('link', { name: /Site acadêmico profissional/ })
    ).toBeVisible();
    await expect(
      section.getByRole('link', { name: /Texto em Voz/ })
    ).toBeVisible();

    // External links have rel noopener
    const externalLinks = section.locator('a[href^="http"]');
    const linkCount = await externalLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < linkCount; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute('rel', /noopener/);
    }

    // Screenshots rendered
    const images = section.locator('img');
    await expect(images).toHaveCount(6);
  });

  test('dashboards service renders its example projects and images below FAQ', async ({
    page
  }) => {
    await page.goto('/servicos/dashboards-e-visualizacao/');

    const section = page.locator(
      'section[aria-labelledby="cases-showcase-heading"]'
    );
    await expect(section).toBeVisible();
    await expect(
      section.getByRole('heading', {
        name: /Exemplos de Dashboards Criados/
      })
    ).toBeVisible();

    await expect(
      section.getByText(/Python e D3.js — Visualização de Redes e Clusters/)
    ).toBeVisible();
    await expect(
      section.getByText(/Power BI — LR Instalações Especiais/)
    ).toBeVisible();

    await expect(
      section.getByRole('img', { name: 'Mapa Global da Rede de Organizações' })
    ).toBeVisible();
    await expect(
      section.getByRole('img', { name: 'Rede de Articulações e Polos' })
    ).toBeVisible();
    await expect(
      section.getByRole('img', { name: 'Clustermap Bipartido' })
    ).toBeVisible();

    // No links taking user to separate case pages
    const standaloneLinks = section.locator('a[href*="/casos/"]');
    await expect(standaloneLinks).toHaveCount(0);
  });

  test('examples do not appear on audience pages or services index', async ({
    page
  }) => {
    await page.goto('/servicos/');
    await expect(
      page.locator('section[aria-labelledby="cases-showcase-heading"]')
    ).toHaveCount(0);

    await page.goto('/para/empresas/');
    await expect(
      page.locator('section[aria-labelledby="cases-showcase-heading"]')
    ).toHaveCount(0);
  });

  test('service page with simple examples passes accessibility', async ({
    page
  }) => {
    await page.goto('/servicos/sites-academicos/');
    await expectA11y(page);
  });
});
