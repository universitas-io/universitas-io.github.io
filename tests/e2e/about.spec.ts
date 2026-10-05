import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';

test('about page pt: seo, jsonld, tools, team placeholder, and a11y', async ({
  page,
  isMobile
}) => {
  const requestedShields: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('img.shields.io')) {
      requestedShields.push(req.url());
    }
  });

  await page.goto('/sobre/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await expectSeo(page, {
    canonical: '/sobre/',
    hreflang: {
      'pt-BR': '/sobre/',
      en: '/en/about/',
      'x-default': '/sobre/'
    }
  });

  await expectJsonLdTypes(page, ['AboutPage', 'BreadcrumbList']);

  // Check 4 tool areas
  await expect(page.locator('[data-tool-area]')).toHaveCount(4);

  // Verify NO img.shields.io requests were triggered
  expect(requestedShields).toHaveLength(0);

  // In preview build (PROD mode), team placeholder is in draft so neutral notice is shown
  await expect(
    page.getByText(/Em breve apresentaremos nossa equipe/i)
  ).toBeVisible();
  await expect(page.getByText('Pesquisadora Exemplo')).not.toBeVisible();

  // Language switcher goes to /en/about/
  if (isMobile) {
    await page.getByRole('button', { name: /menu/i }).click();
    const mobileNav = page.getByRole('dialog');
    await mobileNav.getByRole('link', { name: 'English' }).click();
  } else {
    await page.getByRole('link', { name: 'English' }).click();
  }
  await expect(page).toHaveURL(/\/en\/about\/$/);

  // a11y checks
  await expectA11y(page);
});

test('about page en: seo, jsonld, tools, team placeholder, and a11y', async ({
  page
}) => {
  await page.goto('/en/about/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await expectSeo(page, {
    canonical: '/en/about/',
    hreflang: {
      'pt-BR': '/sobre/',
      en: '/en/about/',
      'x-default': '/sobre/'
    }
  });

  await expectJsonLdTypes(page, ['AboutPage', 'BreadcrumbList']);

  await expect(page.locator('[data-tool-area]')).toHaveCount(4);

  await expect(
    page.getByText(/Our team will be presented soon/i)
  ).toBeVisible();

  await expectA11y(page);
});
