import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y } from './helpers';

test.describe('home page pt', () => {
  test('pt home: h1, sections order, audiences, services, cases, hero cta, seo, a11y', async ({
    page
  }) => {
    await page.goto('/');

    // Exact H1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveText(
      'Evidências rigorosas para decisões e descobertas.'
    );

    // Hero CTA button links to /contato/
    const heroCta = page
      .locator('[data-section="hero"]')
      .getByRole('link', { name: 'Solicitar proposta' });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveAttribute('href', '/contato/');

    // Section ordering via data-section
    const sections = page.locator('[data-section]');
    const sectionNames = await sections.evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-section'))
    );

    // Expected section order (insights may be omitted in preview when empty)
    const expectedBase = [
      'hero',
      'audiences',
      'services',
      'process',
      'cases',
      'ethics',
      'cta'
    ];
    // Filter out insights if not rendered, but check relative order
    const filtered = sectionNames.filter((s) => s !== 'insights');
    expect(filtered).toEqual(expectedBase);

    // 4 audience cards (academia, empresas, setor-publico, ongs)
    const audienceCards = page.locator('[data-section="audiences"] article');
    await expect(audienceCards).toHaveCount(4);

    // Services: 3 core + 3 complementary (6 total cards in services section)
    const serviceCards = page.locator('[data-section="services"] article');
    await expect(serviceCards).toHaveCount(6);

    // Cases: 3 featured cases
    const caseCards = page.locator('[data-section="cases"] article');
    await expect(caseCards).toHaveCount(3);

    // Process section has 5 steps
    const processSteps = page.locator('[data-process-step]');
    await expect(processSteps).toHaveCount(5);

    // No above-the-fold image has loading="lazy"
    const heroImages = page.locator('[data-section="hero"] img');
    const heroImgCount = await heroImages.count();
    for (let i = 0; i < heroImgCount; i++) {
      const loading = await heroImages.nth(i).getAttribute('loading');
      expect(loading).not.toBe('lazy');
    }

    // SEO
    await expectSeo(page, {
      canonical: '/',
      hreflang: {
        'pt-BR': '/',
        en: '/en/',
        'x-default': '/'
      }
    });

    // A11y light mode
    await expectA11y(page);

    // A11y dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await expectA11y(page);
  });
});

test.describe('home page en', () => {
  test('en home: h1, hero cta, audiences, seo, a11y', async ({ page }) => {
    await page.goto('/en/');

    // Exact H1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveText(
      'Rigorous evidence for decisions and discoveries.'
    );

    // Hero CTA button links to /en/contact/
    const heroCta = page
      .locator('[data-section="hero"]')
      .getByRole('link', { name: 'Request a proposal' });
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveAttribute('href', '/en/contact/');

    // 4 audience cards
    const audienceCards = page.locator('[data-section="audiences"] article');
    await expect(audienceCards).toHaveCount(4);

    // SEO
    await expectSeo(page, {
      canonical: '/en/',
      hreflang: {
        'pt-BR': '/',
        en: '/en/',
        'x-default': '/'
      }
    });

    // A11y
    await expectA11y(page);
  });
});
