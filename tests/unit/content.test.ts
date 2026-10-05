import { test, expect } from 'vitest';
import { entryLang, entrySlug, isVisible } from '../../src/lib/content';

test('entryLang extracts language from entry id', () => {
  expect(entryLang('en/quantitative-research')).toBe('en');
  expect(entryLang('pt/pesquisa-quantitativa')).toBe('pt');
});

test('entrySlug extracts clean slug from entry id or path', () => {
  expect(entrySlug('pt/pesquisa-quantitativa.md')).toBe(
    'pesquisa-quantitativa'
  );
  expect(entrySlug('en/services/quantitative-research')).toBe(
    'quantitative-research'
  );
});

test('isVisible filters drafts in production mode', () => {
  expect(isVisible({ draft: true }, true)).toBe(false);
  expect(isVisible({ draft: true }, false)).toBe(true);
  expect(isVisible({ draft: false }, true)).toBe(true);
  expect(isVisible({ draft: false }, false)).toBe(true);
});
