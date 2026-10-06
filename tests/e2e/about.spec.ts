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

  // Check 6 tool areas
  await expect(page.locator('[data-tool-area]')).toHaveCount(6);

  // Verify NO img.shields.io requests were triggered
  expect(requestedShields).toHaveLength(0);

  /*
  // Active team members are shown with links to their profile pages
  const geraldoLink = page.getByRole('link', { name: /Geraldo.*Couto Neto/i });
  await expect(geraldoLink.first()).toBeVisible();
  await expect(geraldoLink.first()).toHaveAttribute(
    'href',
    '/sobre/geraldo-couto-neto/'
  );

  const janainaLink = page.getByRole('link', { name: 'Janaína Di Lourenço' });
  await expect(janainaLink.first()).toBeVisible();
  await expect(janainaLink.first()).toHaveAttribute(
    'href',
    '/sobre/janaina-di-lourenco/'
  );
  */

  // Language switcher goes to /en/about/
  if (isMobile) {
    await page.locator('[data-mobile-menu-trigger]').click();
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

  await expect(page.locator('[data-tool-area]')).toHaveCount(6);

  /*
  const geraldoEnLink = page.getByRole('link', {
    name: /Geraldo.*Couto Neto/i
  });
  await expect(geraldoEnLink.first()).toBeVisible();
  await expect(geraldoEnLink.first()).toHaveAttribute(
    'href',
    '/en/about/geraldo-couto-neto/'
  );

  const janainaEnLink = page.getByRole('link', { name: 'Janaína Di Lourenço' });
  await expect(janainaEnLink.first()).toBeVisible();
  await expect(janainaEnLink.first()).toHaveAttribute(
    'href',
    '/en/about/janaina-di-lourenco/'
  );
  */

  await expectA11y(page);
});

test('dev: team member profile page displays credentials, areas, and links', async ({
  page
}) => {
  await page.goto('http://localhost:4322/sobre/exemplo-pesquisadora/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Pesquisadora Exemplo'
  );
  await expect(
    page.getByText('Cientista de Dados & Pesquisadora').first()
  ).toBeVisible();
  await expect(page.getByText('Áreas de Especialidade')).toBeVisible();
  await expect(page.getByText('Pesquisa Quantitativa').first()).toBeVisible();
  await expect(page.getByText('Formação & Trajetória')).toBeVisible();

  await expectJsonLdTypes(page, ['Person']);
  await expectA11y(page);
});
