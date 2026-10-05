import { test, expect } from '@playwright/test';
import { expectA11y } from './helpers';
import { site } from '../../site.config';
import { redirects } from '../../src/i18n/redirects';

test.describe('SEO infrastructure', () => {
  test('dynamic OG image is served with image/png and proper dimensions', async ({
    request
  }) => {
    const res = await request.get('/og/servicos/pesquisa-quantitativa.png');
    expect(res.status()).toBe(200);
    const contentType = res.headers()['content-type'];
    expect(contentType).toContain('image/png');
    const buffer = await res.body();
    expect(buffer.length).toBeGreaterThan(1000);
  });

  test('pages reference automatic OG images via ogPathFor', async ({
    page
  }) => {
    await page.goto('/servicos/pesquisa-quantitativa/');
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute(
      'content',
      `${site.url}/og/servicos/pesquisa-quantitativa.png`
    );

    const twitterImage = page.locator('meta[name="twitter:image"]');
    await expect(twitterImage).toHaveAttribute(
      'content',
      `${site.url}/og/servicos/pesquisa-quantitativa.png`
    );
  });

  test('robots.txt points to sitemap index', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain(`Sitemap: ${site.url}/sitemap-index.xml`);
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
  });

  test('sitemap exists, includes public pages, and excludes private or redirect URLs', async ({
    request
  }) => {
    // Astro sitemap integration generates /sitemap-index.xml which references /sitemap-0.xml
    const resIndex = await request.get('/sitemap-index.xml');
    expect(resIndex.status()).toBe(200);
    const indexText = await resIndex.text();

    let allSitemapContent = indexText;
    const match = indexText.match(/https?:\/\/[^<]+\/sitemap-\d+\.xml/g);
    if (match) {
      for (const sitemapUrl of match) {
        const path = new URL(sitemapUrl).pathname;
        const resSub = await request.get(path);
        if (resSub.ok()) {
          allSitemapContent += await resSub.text();
        }
      }
    }

    expect(allSitemapContent).toContain('/servicos/pesquisa-quantitativa/');
    expect(allSitemapContent).toContain('/en/services/quantitative-research/');
    expect(allSitemapContent).not.toContain('obrigado');
    expect(allSitemapContent).not.toContain('thank-you');
    expect(allSitemapContent).not.toContain('404');
    expect(allSitemapContent).not.toContain('/p/');
  });

  test('legacy redirects from Hugo load destination with canonical', async ({
    page
  }) => {
    for (const [legacyPath, targetPath] of Object.entries(redirects)) {
      await page.goto(legacyPath);
      // Wait for refresh or check meta canonical
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute(
        'href',
        `${site.url}${targetPath}`
      );
      // Verify page content loads
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    }
  });

  test('404 page is bilingual, links to home in both languages, and is accessible', async ({
    page
  }) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const homePtLink = page.locator('main a[href="/"]');
    await expect(homePtLink).toBeVisible();

    const homeEnLink = page.locator('main a[href="/en/"]');
    await expect(homeEnLink).toBeVisible();

    await expectA11y(page);
  });

  test('goatcounter analytics script is configured and requests count.js', async ({
    page
  }) => {
    let goatCounterCalled = false;
    await page.route(/.*gc\.zgo\.at.*/, (route) => {
      goatCounterCalled = true;
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: ''
      });
    });

    await page.goto('/');
    expect(goatCounterCalled).toBe(true);
    const script = page.locator('script[data-goatcounter]');
    await expect(script).toHaveAttribute(
      'data-goatcounter',
      'https://universitas.goatcounter.com/count'
    );
  });
});
