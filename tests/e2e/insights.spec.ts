import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

test.describe('insights preview (production mode - port 4321)', () => {
  test('pt index shows friendly empty state and valid seo', async ({
    page
  }) => {
    await page.goto('/insights/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Insights'
    );
    await expect(
      page.getByText('Nenhum artigo publicado no momento.')
    ).toBeVisible();
    await expect(
      page.getByText(
        'Em breve compartilharemos novas análises, guias de pesquisa e discussões metodológicas.'
      )
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

  test('en index shows friendly empty state and valid seo', async ({
    page
  }) => {
    await page.goto('/en/insights/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Insights'
    );
    await expect(
      page.getByText('No articles published at the moment.')
    ).toBeVisible();
    await expect(
      page.getByText(
        'We will soon publish new methodological analyses, research guides, and technical discussions.'
      )
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
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toMatch(/xml/i);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('<title>Universitas — Insights</title>');
  });

  test('en rss feed is valid xml', async ({ request }) => {
    const response = await request.get('/en/insights/rss.xml');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toMatch(/xml/i);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('<title>Universitas — Insights</title>');
  });
});

test.describe('insights dev mode (port 4322)', () => {
  const DEV_BASE = 'http://localhost:4322';

  test('dev index lists articles with draft badges', async ({ page }) => {
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

    // Draft badges should be visible in dev mode
    const badges = page.getByText('RASCUNHO');
    await expect(badges.first()).toBeVisible();
  });

  test('article detail page: metadata, author link, jsonld, seo and a11y', async ({
    page
  }) => {
    await page.goto(
      `${DEV_BASE}/insights/como-escolher-abordagem-de-pesquisa/`
    );

    // Heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Como Escolher a Abordagem de Pesquisa'
    );

    // Author byline and link to team anchor
    const authorLink = page.getByRole('link', {
      name: 'Pesquisadora Exemplo'
    });
    await expect(authorLink.first()).toBeVisible();
    await expect(authorLink.first()).toHaveAttribute(
      'href',
      '/sobre/#exemplo-pesquisadora'
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

  test('Review Focus 1: fixture article only in PT has fallback language switcher and no en hreflang', async ({
    page,
    isMobile
  }) => {
    await page.goto(`${DEV_BASE}/insights/_fixture-somente-pt/`);

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Artigo Fixture Somente em Português'
    );

    // hreflang must only contain pt-BR and x-default, NO en
    const enAlternate = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(enAlternate).toHaveCount(0);

    const ptAlternate = page.locator('link[rel="alternate"][hreflang="pt-BR"]');
    await expect(ptAlternate).toHaveCount(1);

    const xDefault = page.locator(
      'link[rel="alternate"][hreflang="x-default"]'
    );
    await expect(xDefault).toHaveCount(1);

    // Language switcher link must point to fallback /en/insights/
    if (isMobile) {
      await page.locator('[data-mobile-menu-trigger]').click();
      const mobileNav = page.getByRole('dialog');
      const langLink = mobileNav.getByRole('link', { name: 'English' });
      await expect(langLink).toHaveAttribute('href', '/en/insights/');
    } else {
      const langLink = page.getByRole('link', { name: 'English' });
      await expect(langLink).toHaveAttribute('href', '/en/insights/');
    }
  });
});
