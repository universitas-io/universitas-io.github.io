import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getLocalized, entrySlug } from '../../../lib/content';
import { site } from '../../../../site.config';
import { path } from '../../../i18n/routes';

export async function GET(context: APIContext) {
  const posts = await getLocalized('insights', 'en');

  return rss({
    title: 'Universitas — Insights',
    description:
      'Articles, methodological essays, and practical guides on empirical research and data analytics.',
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${path('en', 'insights')}${entrySlug(post.id)}/`
    }))
  });
}
