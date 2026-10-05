import { site } from '../../site.config';
import { execSync } from 'node:child_process';

test('site.url is absolute https without trailing slash', () => {
  expect(site.url).toMatch(/^https:\/\/[^/]+$/);
});
test('domain string appears only in site.config.ts', () => {
  const out = execSync(
    'grep -rl "universitas-io.github.io" src scripts astro.config.mjs || true'
  )
    .toString()
    .trim();
  expect(out).toBe('');
});
test('locales map', () => {
  expect(site.locales).toEqual({ pt: 'pt-BR', en: 'en' });
});
