export interface RawEntry {
  collection: string;
  lang: 'pt' | 'en' | null;
  slug: string;
  data: Record<string, unknown>;
}

export function findMissingTranslations(entries: RawEntry[]): string[] {
  const errors: string[] = [];

  // Group by collection and translationKey
  // Ignore team (has both languages in single file)
  const translatable = entries.filter(
    (e) => e.collection !== 'team' && e.lang !== null
  );

  const byCollection: Record<string, RawEntry[]> = {};
  for (const entry of translatable) {
    if (!byCollection[entry.collection]) {
      byCollection[entry.collection] = [];
    }
    byCollection[entry.collection].push(entry);
  }

  for (const [col, items] of Object.entries(byCollection)) {
    // For insights, check translationOptional
    for (const item of items) {
      if (item.data.translationOptional) continue;
      const key = item.data.translationKey as string;
      if (!key) continue;

      const otherLang = item.lang === 'pt' ? 'en' : 'pt';
      const hasPair = items.some(
        (other) =>
          other.lang === otherLang &&
          other.data.translationKey === key &&
          !other.data.draft
      );

      // If item is not draft, its pair must exist and not be draft
      if (!item.data.draft && !hasPair) {
        errors.push(
          `${col}/${item.lang}/${item.slug}: sem par ${otherLang} (translationKey=${key})`
        );
      }
    }
  }

  return errors;
}

export function findBadSlugs(entries: RawEntry[]): string[] {
  const errors: string[] = [];
  const slugRegex = /^_?[a-z0-9-]+$/;

  for (const entry of entries) {
    if (!slugRegex.test(entry.slug)) {
      errors.push(
        `${entry.collection}/${entry.lang ? `${entry.lang}/` : ''}${entry.slug}: slug fora de ^[a-z0-9-]+$`
      );
    }
  }

  return errors;
}

export function findBrokenKeyRefs(entries: RawEntry[]): string[] {
  const errors: string[] = [];

  // Collect all known translationKeys per collection
  const allKeysByCollection: Record<string, Set<string>> = {};
  for (const entry of entries) {
    if (entry.data.translationKey) {
      if (!allKeysByCollection[entry.collection]) {
        allKeysByCollection[entry.collection] = new Set();
      }
      allKeysByCollection[entry.collection].add(
        entry.data.translationKey as string
      );
    }
  }

  for (const entry of entries) {
    // If services has audiences[]: each must exist in audiences collection
    if (Array.isArray(entry.data.audiences)) {
      const knownAudiences = allKeysByCollection['audiences'] || new Set();
      for (const audKey of entry.data.audiences) {
        if (!knownAudiences.has(audKey as string)) {
          errors.push(
            `${entry.collection}/${entry.lang ? `${entry.lang}/` : ''}${entry.slug}: referência quebrada para audience '${audKey}'`
          );
        }
      }
    }

    // If audiences or cases has services[]: each must exist in services collection
    if (Array.isArray(entry.data.services)) {
      const knownServices = allKeysByCollection['services'] || new Set();
      for (const srvKey of entry.data.services) {
        if (!knownServices.has(srvKey as string)) {
          errors.push(
            `${entry.collection}/${entry.lang ? `${entry.lang}/` : ''}${entry.slug}: referência quebrada para service '${srvKey}'`
          );
        }
      }
    }
  }

  return errors;
}

export function findMissingRequiredPublished(entries: RawEntry[]): string[] {
  const errors: string[] = [];
  const teamEntries = entries.filter((e) => e.collection === 'team');
  const publishedTeam = teamEntries.filter((e) => !e.data.draft);

  if (publishedTeam.length === 0) {
    errors.push(
      'Nenhum membro da equipe publicado com draft: false. Adicione os dados reais da equipe para o build de produção (§5.5).'
    );
  }

  return errors;
}
