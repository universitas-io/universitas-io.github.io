import { test, expect } from 'vitest';
import {
  findMissingTranslations,
  findBadSlugs,
  findBrokenKeyRefs,
  findMissingRequiredPublished,
  type RawEntry
} from '../../src/lib/content-integrity';

const e = (
  collection: string,
  lang: 'pt' | 'en' | null,
  slug: string,
  data: Record<string, unknown>
): RawEntry => ({ collection, lang, slug, data });

test('findMissingTranslations detects unpaired translationKeys', () => {
  expect(
    findMissingTranslations([
      e('services', 'pt', 'pesquisa-quantitativa', {
        translationKey: 'quant',
        draft: false
      })
    ])
  ).toEqual([expect.stringContaining('services/pt/pesquisa-quantitativa')]);

  expect(
    findMissingTranslations([
      e('services', 'pt', 'a', { translationKey: 'k', draft: false }),
      e('services', 'en', 'b', { translationKey: 'k', draft: false })
    ])
  ).toEqual([]);

  expect(
    findMissingTranslations([
      e('services', 'pt', 'a', { translationKey: 'k', draft: false }),
      e('services', 'en', 'b', { translationKey: 'k', draft: true })
    ])
  ).toHaveLength(1);

  expect(
    findMissingTranslations([
      e('insights', 'pt', 'a', {
        translationKey: 'k',
        draft: false,
        translationOptional: true
      })
    ])
  ).toEqual([]);
});

test('findBadSlugs flags non-kebab-case or non-ascii slugs', () => {
  expect(findBadSlugs([e('cases', 'pt', 'diagramação', {})])).toHaveLength(1);
  expect(findBadSlugs([e('cases', 'pt', 'diagramacao', {})])).toEqual([]);
});

test('findBrokenKeyRefs flags invalid translationKeys in references', () => {
  expect(
    findBrokenKeyRefs([
      e('services', 'pt', 'a', { translationKey: 's', audiences: ['nope'] })
    ])
  ).toHaveLength(1);

  expect(
    findBrokenKeyRefs([
      e('audiences', 'pt', 'aud-a', { translationKey: 'aud-key' }),
      e('services', 'pt', 'a', {
        translationKey: 's',
        audiences: ['aud-key']
      })
    ])
  ).toEqual([]);
});

test('findMissingRequiredPublished requires at least one published team member', () => {
  expect(
    findMissingRequiredPublished([e('team', null, 'x', { draft: true })])
  ).toHaveLength(1);
  expect(
    findMissingRequiredPublished([e('team', null, 'x', { draft: false })])
  ).toEqual([]);
});
