import { test, expect } from '@playwright/test';
import { expectSeo, expectA11y, expectJsonLdTypes } from './helpers';
import { site } from '../../site.config';

test.describe('contact page pt - interactive js', () => {
  test('required fields block submission', async ({ page }) => {
    let requestSent = false;
    await page.route('https://api.web3forms.com/submit', (route) => {
      requestSent = true;
      route.fulfill({ json: { success: true } });
    });

    await page.goto('/contato/');
    const submitBtn = page.getByRole('button', { name: /enviar solicitação/i });
    await expect(submitBtn).toBeVisible();

    // Click without filling anything
    await submitBtn.click();
    expect(requestSent).toBe(false);

    // Name field should be invalid or focused
    const nameInput = page.locator('input[name="name"]');
    const isInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
    expect(isInvalid).toBe(true);
  });

  test('successful submission shows aria-live confirmation message', async ({
    page
  }) => {
    await page.route('https://api.web3forms.com/submit', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Message sent successfully'
        })
      });
    });

    await page.goto('/contato/');

    await page.fill('input[name="name"]', 'Pesquisador Silva');
    await page.fill('input[name="email"]', 'pesquisador@universidade.edu.br');
    await page.fill('input[name="organization"]', 'Universidade de Teste');
    await page.fill('input[name="phone"]', '+55 11 99999-9999');
    await page.selectOption('select[name="org_type"]', { index: 1 });
    await page.selectOption('select[name="service"]', { index: 1 });
    await page.fill('input[name="deadline"]', '3 meses');
    await page.fill(
      'textarea[name="message"]',
      'Gostaria de solicitar uma proposta para desenho amostral e coleta de dados.'
    );
    await page.check('input[name="consent"]');

    await page.getByRole('button', { name: /enviar solicitação/i }).click();

    // Success notification in aria-live region
    const statusRegion = page.locator('[data-form-status]');
    await expect(statusRegion).toBeVisible();
    await expect(statusRegion).toContainText(/sucesso|recebida/i);
  });

  test('server error 500 displays error message with direct whatsapp link', async ({
    page
  }) => {
    await page.route('https://api.web3forms.com/submit', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Server error' })
      });
    });

    await page.goto('/contato/');

    await page.fill('input[name="name"]', 'Pesquisador Silva');
    await page.fill('input[name="email"]', 'pesquisador@universidade.edu.br');
    await page.selectOption('select[name="org_type"]', { index: 1 });
    await page.selectOption('select[name="service"]', { index: 1 });
    await page.fill(
      'textarea[name="message"]',
      'Demanda de teste para simulação de falha.'
    );
    await page.check('input[name="consent"]');

    await page.getByRole('button', { name: /enviar solicitação/i }).click();

    const statusRegion = page.locator('[data-form-status]');
    await expect(statusRegion).toBeVisible();
    await expect(statusRegion).toContainText(/erro|falha|whatsapp/i);

    // Error message must include link to WhatsApp fallback
    const waLink = statusRegion.locator(
      'a[href*="wa.me"], a[href*="whatsapp"]'
    );
    await expect(waLink).toBeVisible();
  });

  test('contact page pt: seo, jsonld, a11y light & dark', async ({ page }) => {
    await page.goto('/contato/');

    await expectSeo(page, {
      canonical: '/contato/',
      hreflang: {
        'pt-BR': '/contato/',
        en: '/en/contact/',
        'x-default': '/contato/'
      }
    });

    await expectJsonLdTypes(page, ['ContactPage']);
    await expectA11y(page);

    // Dark mode a11y
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await expectA11y(page);
  });
});

test.describe('contact page no-js (Review Focus 2)', () => {
  test.use({ javaScriptEnabled: false });

  test('pt no-js form has valid post action and redirect to obrigado', async ({
    page
  }) => {
    await page.goto('/contato/');

    const form = page.locator('form[data-contact-form]');
    await expect(form).toHaveAttribute('method', /post/i);
    await expect(form).toHaveAttribute(
      'action',
      'https://api.web3forms.com/submit'
    );

    const redirectInput = form.locator('input[name="redirect"]');
    await expect(redirectInput).toHaveAttribute(
      'value',
      `${site.url}/contato/obrigado/`
    );

    const botcheckInput = form.locator('input[name="botcheck"]');
    await expect(botcheckInput).toHaveCount(1);
  });

  test('en no-js form has valid post action and redirect to thank-you', async ({
    page
  }) => {
    await page.goto('/en/contact/');

    const form = page.locator('form[data-contact-form]');
    await expect(form).toHaveAttribute('method', /post/i);
    await expect(form).toHaveAttribute(
      'action',
      'https://api.web3forms.com/submit'
    );

    const redirectInput = form.locator('input[name="redirect"]');
    await expect(redirectInput).toHaveAttribute(
      'value',
      `${site.url}/en/contact/thank-you/`
    );
  });
});

test.describe('thank you and privacy pages', () => {
  test('pt thank you page has noindex, follow and confirmation', async ({
    page
  }) => {
    await page.goto('/contato/obrigado/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectSeo(page, {
      canonical: '/contato/obrigado/',
      hreflang: {
        'pt-BR': '/contato/obrigado/',
        en: '/en/contact/thank-you/',
        'x-default': '/contato/obrigado/'
      },
      robots: 'noindex, follow'
    });

    await expectA11y(page);
  });

  test('en thank you page has noindex, follow', async ({ page }) => {
    await page.goto('/en/contact/thank-you/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectSeo(page, {
      canonical: '/en/contact/thank-you/',
      hreflang: {
        'pt-BR': '/contato/obrigado/',
        en: '/en/contact/thank-you/',
        'x-default': '/contato/obrigado/'
      },
      robots: 'noindex, follow'
    });

    await expectA11y(page);
  });

  test('privacy policy pages pt and en: seo and a11y', async ({ page }) => {
    await page.goto('/privacidade/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/LGPD/i).first()).toBeVisible();
    await expect(page.getByText(/Web3Forms/i).first()).toBeVisible();
    await expect(page.getByText(/GoatCounter/i).first()).toBeVisible();

    await expectSeo(page, {
      canonical: '/privacidade/',
      hreflang: {
        'pt-BR': '/privacidade/',
        en: '/en/privacy/',
        'x-default': '/privacidade/'
      }
    });
    await expectA11y(page);

    await page.goto('/en/privacy/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Privacy/i).first()).toBeVisible();
    await expectSeo(page, {
      canonical: '/en/privacy/',
      hreflang: {
        'pt-BR': '/privacidade/',
        en: '/en/privacy/',
        'x-default': '/privacidade/'
      }
    });
    await expectA11y(page);
  });
});
