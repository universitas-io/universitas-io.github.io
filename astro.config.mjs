import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './site.config';
import { redirects } from './src/i18n/redirects';

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  redirects,
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    mdx(),
    icon(),
    sitemap({
      filter: (page) =>
        !page.includes('obrigado') &&
        !page.includes('thank-you') &&
        !page.includes('404') &&
        !page.includes('/p/') &&
        !page.includes('/archives/') &&
        !page.includes('/categories/') &&
        !page.includes('/tags/') &&
        !page.includes('/pt-br/') &&
        !page.includes('/casos/') &&
        !page.includes('/cases/')
    })
  ]
});
