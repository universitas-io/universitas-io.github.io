import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/routes';

export function entryLang(id: string): Locale {
  const parts = id.split('/');
  return parts[0] === 'en' ? 'en' : 'pt';
}

export function entrySlug(id: string): string {
  const clean = id.replace(/\.(md|mdx|yaml|yml)$/, '');
  const parts = clean.split('/');
  return parts[parts.length - 1];
}

export function isVisible(
  data: { draft?: boolean },
  prod: boolean = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.PROD
    : true
): boolean {
  if (!prod) return true;
  return data.draft !== true;
}

export async function getLocalized<
  C extends 'services' | 'audiences' | 'cases' | 'insights'
>(collection: C, lang: Locale): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection, (entry) => {
    return entryLang(entry.id) === lang && isVisible(entry.data);
  });

  // Sort by order ascending if present, or pubDate/date descending
  return (entries as CollectionEntry<C>[]).sort((a, b) => {
    const dataA = a.data as Record<string, unknown>;
    const dataB = b.data as Record<string, unknown>;

    if (typeof dataA.order === 'number' && typeof dataB.order === 'number') {
      return dataA.order - dataB.order;
    }
    const dateA =
      (dataA.pubDate as Date) ||
      (dataA.date ? new Date(dataA.date as string) : null);
    const dateB =
      (dataB.pubDate as Date) ||
      (dataB.date ? new Date(dataB.date as string) : null);

    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime();
    }
    return 0;
  });
}

export async function translationOf<
  C extends 'services' | 'audiences' | 'cases' | 'insights'
>(
  entry: CollectionEntry<C>,
  target: Locale
): Promise<CollectionEntry<C> | undefined> {
  const translationKey = (entry.data as Record<string, unknown>).translationKey;
  if (!translationKey) return undefined;

  const targetEntries = await getCollection(entry.collection as C, (item) => {
    return (
      entryLang(item.id) === target &&
      (item.data as Record<string, unknown>).translationKey ===
        translationKey &&
      isVisible(item.data)
    );
  });

  return targetEntries[0] as CollectionEntry<C> | undefined;
}

export async function byTranslationKeys<
  C extends 'services' | 'audiences' | 'cases' | 'insights'
>(collection: C, keys: string[], lang: Locale): Promise<CollectionEntry<C>[]> {
  const keySet = new Set(keys);
  const entries = await getLocalized(collection, lang);
  return entries.filter((e) =>
    keySet.has((e.data as Record<string, unknown>).translationKey as string)
  );
}

export async function getTeam(): Promise<CollectionEntry<'team'>[]> {
  const members = await getCollection('team', (member) => {
    return isVisible(member.data);
  });

  return members.sort((a, b) => {
    return (a.data.order ?? 0) - (b.data.order ?? 0);
  });
}
