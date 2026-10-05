import type { APIRoute } from 'astro';
import { site } from '../../site.config';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
