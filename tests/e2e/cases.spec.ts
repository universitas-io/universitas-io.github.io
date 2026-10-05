import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

test('cases index lists 5 case studies', async ({ page }) => {
  await page.goto('/casos/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Casos/);
  await expect(page.locator('article')).toHaveCount(5);
});

const casePairs = [
  ['base-de-dados-youtube-tese', 'youtube-database-doctoral-thesis'],
  ['analise-de-redes-clusterizacao', 'network-analysis-clustering'],
  ['dashboard-power-bi-lr-instalacoes', 'power-bi-dashboard-lr-instalacoes'],
  ['sites-academicos-e-de-pesquisa', 'academic-and-research-websites'],
  ['diagramacao-dissertacao-e-anais', 'dissertation-and-proceedings-layout']
] as const;

for (const [pt, en] of casePairs) {
  test(`case study ${pt} seo, h1, image and switcher`, async ({
    page,
    isMobile
  }) => {
    await page.goto(`/casos/${pt}/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const coverImg = page.locator('main img').first();
    await expect(coverImg).toBeVisible();
    await expect(coverImg).toHaveAttribute('alt', /.+/);

    await expectSeo(page, {
      canonical: `/casos/${pt}/`,
      hreflang: {
        'pt-BR': `/casos/${pt}/`,
        en: `/en/cases/${en}/`,
        'x-default': `/casos/${pt}/`
      }
    });

    await expectJsonLdTypes(page, ['Article', 'BreadcrumbList']);

    if (isMobile) {
      await page.getByRole('button', { name: /menu/i }).click();
      const mobileNav = page.getByRole('dialog');
      await mobileNav.getByRole('link', { name: 'English' }).click();
    } else {
      await page.getByRole('link', { name: 'English' }).click();
    }

    await expect(page).toHaveURL(new RegExp(`/en/cases/${en}/$`));
  });
}

test('digital data collection service links to youtube thesis case', async ({
  page
}) => {
  await page.goto('/servicos/coleta-de-dados-digitais/');
  const caseLink = page.locator(
    'main a[href*="/casos/base-de-dados-youtube-tese/"]'
  );
  await expect(caseLink.first()).toBeVisible();
});

test('external links in case studies have rel noopener', async ({ page }) => {
  await page.goto('/casos/base-de-dados-youtube-tese/');
  const externalLinks = page.locator('main a[href^="http"]');
  const count = await externalLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(externalLinks.nth(i)).toHaveAttribute('rel', /noopener/);
  }
});

test('cases pages a11y', async ({ page }) => {
  await page.goto('/casos/');
  await expectA11y(page);

  await page.goto('/casos/base-de-dados-youtube-tese/');
  await expectA11y(page);

  await page.goto('/en/cases/academic-and-research-websites/');
  await expectA11y(page);
});
