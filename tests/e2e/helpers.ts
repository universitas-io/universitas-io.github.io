import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { site } from '../../site.config';

export async function expectSeo(
  page: Page,
  options: {
    canonical: string;
    hreflang: Record<string, string>;
    robots?: string;
  }
) {
  const expectedCanonical = new URL(options.canonical, site.url).href;
  const canonicalEl = page.locator('link[rel="canonical"]');
  await expect(canonicalEl).toHaveAttribute('href', expectedCanonical);

  for (const [lang, href] of Object.entries(options.hreflang)) {
    const expectedHref = new URL(href, site.url).href;
    const alternateEl = page.locator(
      `link[rel="alternate"][hreflang="${lang}"]`
    );
    await expect(alternateEl).toHaveAttribute('href', expectedHref);
  }

  const expectedRobots = options.robots || 'index, follow';
  const robotsEl = page.locator('meta[name="robots"]');
  await expect(robotsEl).toHaveAttribute('content', expectedRobots);
}

export async function expectA11y(page: Page) {
  const axe = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21aa',
    'wcag22aa'
  ]);

  const results = await axe.analyze();

  if (results.violations.length > 0) {
    const errorDetails = results.violations
      .map(
        (v) =>
          `[${v.id}] ${v.help} (${v.helpUrl})\nNodes:\n${v.nodes
            .map((n) => `  - ${n.target}: ${n.failureSummary}`)
            .join('\n')}`
      )
      .join('\n\n');
    throw new Error(`A11y violations found:\n${errorDetails}`);
  }

  expect(results.violations).toEqual([]);
}

export async function expectJsonLdTypes(page: Page, types: string[]) {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .all();
  expect(scripts.length).toBeGreaterThan(0);

  const foundTypes = new Set<string>();

  for (const s of scripts) {
    const text = await s.textContent();
    if (!text) continue;
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data['@graph'])) {
        for (const node of data['@graph']) {
          if (node['@type']) foundTypes.add(node['@type']);
        }
      } else if (data['@type']) {
        foundTypes.add(data['@type']);
      }
    } catch (e) {
      console.error('Invalid JSON-LD:', e);
    }
  }

  for (const t of types) {
    expect(
      foundTypes.has(t),
      `Expected JSON-LD type "${t}" to be present, found: ${Array.from(foundTypes).join(', ')}`
    ).toBe(true);
  }
}
