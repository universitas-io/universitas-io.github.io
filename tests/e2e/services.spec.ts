import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

test('services index lists 3 core + 3 complementary', async ({ page }) => {
  await page.goto('/servicos/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Serviços/);
  await expect(page.locator('[data-tier="core"] article')).toHaveCount(3);
  await expect(page.locator('[data-tier="complementary"] article')).toHaveCount(
    3
  );
});

for (const [pt, en] of [
  ['pesquisa-quantitativa', 'quantitative-research'],
  ['pesquisa-qualitativa', 'qualitative-research'],
  ['coleta-de-dados-digitais', 'digital-data-collection'],
  ['dashboards-e-visualizacao', 'dashboards-and-data-visualization'],
  ['sites-academicos', 'academic-websites'],
  ['diagramacao-e-formatacao', 'document-layout-and-formatting']
]) {
  test(`service ${pt} seo + switcher`, async ({ page, isMobile }) => {
    await page.goto(`/servicos/${pt}/`);
    await expectSeo(page, {
      canonical: `/servicos/${pt}/`,
      hreflang: {
        'pt-BR': `/servicos/${pt}/`,
        en: `/en/services/${en}/`,
        'x-default': `/servicos/${pt}/`
      }
    });
    await expectJsonLdTypes(page, ['Service', 'FAQPage', 'BreadcrumbList']);
    if (isMobile) {
      await page.getByRole('button', { name: /menu/i }).click();
    }
    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(new RegExp(`/en/services/${en}/$`));
  });
}

test('service pages a11y', async ({ page }) => {
  for (const p of [
    '/servicos/',
    '/servicos/pesquisa-quantitativa/',
    '/en/services/qualitative-research/'
  ]) {
    await page.goto(p);
    await expectA11y(page);
  }
});
