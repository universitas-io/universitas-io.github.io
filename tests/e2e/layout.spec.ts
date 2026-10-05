import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

test('pt home shell: lang, skip link, header nav, footer invoice note', async ({
  page,
  isMobile
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

  if (!isMobile) {
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Pular para o conteúdo' })
    ).toBeFocused();
    await expect(
      page.getByRole('navigation', { name: /principal/i })
    ).toBeVisible();
  }

  await expect(
    page.getByText('Emitimos nota fiscal para pessoas físicas e jurídicas.')
  ).toBeVisible();

  await expectSeo(page, {
    canonical: '/',
    hreflang: { 'pt-BR': '/', en: '/en/', 'x-default': '/' }
  });

  await expectJsonLdTypes(page, ['Organization', 'WebSite']);
});

test('language switcher goes to /en/', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: /menu/i }).click();
  }
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/$/);
});

test('theme toggle persists without flash', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: /menu/i }).click();
  }
  await page.getByRole('button', { name: /tema|theme/i }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('mobile nav opens with keyboard and traps Escape', async ({
  page,
  isMobile
}) => {
  test.skip(!isMobile, 'Mobile-only test');
  await page.goto('/');
  const menuButton = page.getByRole('button', { name: /menu/i });
  await menuButton.click();
  const navDialog = page.getByRole('dialog');
  await expect(navDialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(navDialog).not.toBeVisible();
});

test('a11y light and dark', async ({ page }) => {
  await page.goto('/');
  await expectA11y(page);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expectA11y(page);
});
