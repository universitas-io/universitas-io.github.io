import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

const audiencePairs = [
  ['academia', 'academia'],
  ['empresas', 'business'],
  ['setor-publico', 'public-sector']
] as const;

for (const [pt, en] of audiencePairs) {
  test(`audience ${pt} seo, switcher, and links`, async ({
    page,
    isMobile
  }) => {
    await page.goto(`/para/${pt}/`);

    await expectSeo(page, {
      canonical: `/para/${pt}/`,
      hreflang: {
        'pt-BR': `/para/${pt}/`,
        en: `/en/for/${en}/`,
        'x-default': `/para/${pt}/`
      }
    });

    await expectJsonLdTypes(page, ['WebPage', 'FAQPage', 'BreadcrumbList']);

    // Check at least 2 service links in content
    const serviceLinks = page.locator('main a[href*="/servicos/"]');
    await expect(serviceLinks).toHaveCount(await serviceLinks.count());
    expect(await serviceLinks.count()).toBeGreaterThanOrEqual(2);

    // Check audiences dropdown links in header / mobile menu
    if (isMobile) {
      await page.getByRole('button', { name: /menu/i }).click();
      const mobileNav = page.getByRole('dialog');
      await expect(
        mobileNav.getByRole('link', { name: 'Academia', exact: true })
      ).toBeVisible();
      await expect(
        mobileNav.getByRole('link', { name: 'Empresas', exact: true })
      ).toBeVisible();
      await expect(
        mobileNav.getByRole('link', { name: 'Setor Público', exact: true })
      ).toBeVisible();
      await mobileNav.getByRole('link', { name: 'English' }).click();
    } else {
      const menuButton = page.getByRole('button', { name: /para quem/i });
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      const menuPanel = page.locator('#audiences-menu-panel');
      await expect(
        menuPanel.getByRole('menuitem', { name: 'Academia' })
      ).toBeVisible();
      await expect(
        menuPanel.getByRole('menuitem', { name: 'Empresas' })
      ).toBeVisible();
      await expect(
        menuPanel.getByRole('menuitem', { name: 'Setor Público' })
      ).toBeVisible();
      await page.getByRole('link', { name: 'English' }).click();
    }

    await expect(page).toHaveURL(new RegExp(`/en/for/${en}/$`));
  });
}

test('audience pages a11y', async ({ page }) => {
  await page.goto('/para/academia/');
  await expectA11y(page);

  await page.goto('/en/for/business/');
  await expectA11y(page);
});
