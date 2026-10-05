import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  findMissingTranslations,
  findBadSlugs,
  findBrokenKeyRefs,
  findMissingRequiredPublished,
  type RawEntry
} from '../src/lib/content-integrity.ts';

const allowDrafts = process.argv.includes('--allow-drafts');
const contentDir = path.resolve(process.cwd(), 'src/content');

const entries: RawEntry[] = [];

if (fs.existsSync(contentDir)) {
  const collections = fs.readdirSync(contentDir);

  for (const col of collections) {
    const colPath = path.join(contentDir, col);
    if (!fs.statSync(colPath).isDirectory()) continue;

    function walk(dir: string, currentLang: 'pt' | 'en' | null = null) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const nextLang =
            item === 'pt' || item === 'en'
              ? (item as 'pt' | 'en')
              : currentLang;
          walk(fullPath, nextLang);
        } else if (
          stat.isFile() &&
          /\.(md|mdx|yaml|yml)$/.test(item) &&
          !item.startsWith('.')
        ) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const slug = item.replace(/\.(md|mdx|yaml|yml)$/, '');
          let data: Record<string, unknown> = {};

          if (/\.(yaml|yml)$/.test(item)) {
            // parse yaml
            try {
              data = matter(`---\n${content}\n---`).data;
            } catch (e) {
              console.error(`Error parsing YAML ${fullPath}:`, e);
            }
          } else {
            const parsed = matter(content);
            data = parsed.data;
          }

          entries.push({
            collection: col,
            lang: currentLang,
            slug,
            data
          });
        }
      }
    }

    walk(colPath);
  }
}

const allErrors: string[] = [];

allErrors.push(...findBadSlugs(entries));
allErrors.push(...findMissingTranslations(entries));
allErrors.push(...findBrokenKeyRefs(entries));

if (!allowDrafts) {
  allErrors.push(...findMissingRequiredPublished(entries));
}

if (allErrors.length > 0) {
  console.error('\n❌ Erros de integridade no conteúdo:');
  for (const err of allErrors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('✅ Integridade do conteúdo validada com sucesso.');
  process.exit(0);
}
