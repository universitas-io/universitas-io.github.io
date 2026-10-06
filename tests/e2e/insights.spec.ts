import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

test.describe('insights preview (production mode - port 4321)', () => {
  test('pt index lists published articles and valid seo', async ({ page }) => {
    await page.goto('/insights/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Insights'
    );
    await expect(
      page.getByRole('heading', {
        name: /Como Escolher a Abordagem de Pesquisa/i
      })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Coleta de Dados em Redes Sociais/i
      })
    ).toBeVisible();

    await expectSeo(page, {
      canonical: '/insights/',
      hreflang: {
        'pt-BR': '/insights/',
        en: '/en/insights/',
        'x-default': '/insights/'
      }
    });

    await expectA11y(page);
  });

  test('en index lists published articles and valid seo', async ({ page }) => {
    await page.goto('/en/insights/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Insights'
    );
    await expect(
      page.getByRole('heading', {
        name: /Choosing a Research Approach/i
      })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Social media data harvesting/i
      })
    ).toBeVisible();

    await expectSeo(page, {
      canonical: '/en/insights/',
      hreflang: {
        'pt-BR': '/insights/',
        en: '/en/insights/',
        'x-default': '/insights/'
      }
    });

    await expectA11y(page);
  });

  test('pt rss feed is valid xml', async ({ request }) => {
    const response = await request.get('/insights/rss.xml');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(
      /(application|text)\/xml/
    );

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('<title>Universitas: Insights</title>');
  });

  test('en rss feed is valid xml', async ({ request }) => {
    const response = await request.get('/en/insights/rss.xml');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(
      /(application|text)\/xml/
    );

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('<title>Universitas: Insights</title>');
  });
});

test.describe('insights dev mode (port 4322)', () => {
  const DEV_BASE = 'http://localhost:4322';

  test('dev index lists articles', async ({ page }) => {
    await page.goto(`${DEV_BASE}/insights/`);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Insights'
    );

    // Should find the 2 main articles
    await expect(
      page.getByRole('heading', {
        name: /Como Escolher a Abordagem de Pesquisa/i
      })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Coleta de Dados em Redes Sociais/i
      })
    ).toBeVisible();
  });

  test('article detail page: metadata, jsonld, seo and a11y', async ({
    page
  }) => {
    await page.goto(
      `${DEV_BASE}/insights/como-escolher-abordagem-de-pesquisa/`
    );

    // Heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /Como Escolher a Abordagem de Pesquisa/i
    );

    // Reading time and date in time tag
    await expect(page.getByText(/minutos de leitura/i)).toBeVisible();
    const timeEl = page.locator('time');
    await expect(timeEl.first()).toBeVisible();
    await expect(timeEl.first()).toHaveAttribute('datetime', /2026-03-15/);

    // SEO with paired EN article
    await expectSeo(page, {
      canonical: '/insights/como-escolher-abordagem-de-pesquisa/',
      hreflang: {
        'pt-BR': '/insights/como-escolher-abordagem-de-pesquisa/',
        en: '/en/insights/choosing-a-research-approach/',
        'x-default': '/insights/como-escolher-abordagem-de-pesquisa/'
      }
    });

    // JSON-LD article schema
    await expectJsonLdTypes(page, ['Article', 'BreadcrumbList']);

    // Accessibility check
    await expectA11y(page);
  });
});
