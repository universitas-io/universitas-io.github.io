import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getLocalized, entrySlug } from '../../lib/content';
import { site } from '../../../site.config';
import { path } from '../../i18n/routes';

export async function GET(context: APIContext) {
  const posts = await getLocalized('insights', 'pt');

  return rss({
    title: 'Universitas — Insights',
    description:
      'Artigos, reflexões metodológicas e guias práticos sobre pesquisa empírica e análise de dados.',
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${path('pt', 'insights')}${entrySlug(post.id)}/`
    }))
  });
}
