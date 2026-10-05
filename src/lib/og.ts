import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '../i18n/routes';

export interface OgPage {
  slug: string;
  title: string;
  lang: Locale;
  [key: string]: unknown;
}

export function ogPathFor(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  if (!clean || clean === '') {
    return '/og/index.png';
  }
  if (clean === '/en') {
    return '/og/en/index.png';
  }
  return `/og${clean}.png`;
}

export async function listOgPages(): Promise<OgPage[]> {
  const pages: OgPage[] = [
    { slug: 'default', title: 'Universitas', lang: 'pt' },
    {
      slug: 'index',
      title: 'Universitas — Consultoria em Pesquisa',
      lang: 'pt'
    },
    {
      slug: 'en/index',
      title: 'Universitas — Research Consultancy',
      lang: 'en'
    },
    { slug: 'sobre', title: 'Sobre a Universitas', lang: 'pt' },
    { slug: 'en/about', title: 'About Universitas', lang: 'en' },
    {
      slug: 'contato',
      title: 'Solicite uma Proposta | Universitas',
      lang: 'pt'
    },
    {
      slug: 'en/contact',
      title: 'Request a Proposal | Universitas',
      lang: 'en'
    },
    {
      slug: 'privacidade',
      title: 'Política de Privacidade | Universitas',
      lang: 'pt'
    },
    { slug: 'en/privacy', title: 'Privacy Policy | Universitas', lang: 'en' },
    {
      slug: 'servicos',
      title: 'Serviços de Pesquisa | Universitas',
      lang: 'pt'
    },
    {
      slug: 'en/services',
      title: 'Research Services | Universitas',
      lang: 'en'
    },
    { slug: 'insights', title: 'Insights | Universitas', lang: 'pt' },
    { slug: 'en/insights', title: 'Insights | Universitas', lang: 'en' }
  ];

  const contentDir = path.resolve(process.cwd(), 'src/content');
  const collections: {
    name: string;
    segmentPt: string;
    segmentEn: string;
  }[] = [
    { name: 'services', segmentPt: 'servicos', segmentEn: 'services' },
    { name: 'audiences', segmentPt: 'para', segmentEn: 'for' },
    { name: 'insights', segmentPt: 'insights', segmentEn: 'insights' }
  ];

  for (const col of collections) {
    for (const lang of ['pt', 'en'] as const) {
      const dir = path.join(contentDir, col.name, lang);
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        const filePath = path.join(dir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = matter(raw);

        // Filter out drafts if in production
        const isProd =
          typeof process !== 'undefined' &&
          process.env?.NODE_ENV === 'production';
        if (isProd && parsed.data.draft === true) {
          continue;
        }

        const fileSlug = file.replace(/\.(md|mdx)$/, '');
        const segment = lang === 'pt' ? col.segmentPt : `en/${col.segmentEn}`;
        const pageSlug = `${segment}/${fileSlug}`;
        const title = parsed.data.title || fileSlug;

        pages.push({
          slug: pageSlug,
          title,
          lang
        });
      }
    }
  }

  return pages;
}
