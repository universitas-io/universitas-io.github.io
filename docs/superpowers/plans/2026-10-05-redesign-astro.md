# Redesign Universitas em Astro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o site Hugo por um site Astro bilíngue (PT-BR/EN) de consultoria em pesquisa, estático, acessível e com SEO completo, publicado no GitHub Pages.

**Architecture:** Astro com saída estática. Conteúdo em Content Collections (Markdown/MDX/YAML) validado por Zod e por um script de integridade que roda antes do build. Rotas finas em `src/pages/` e `src/pages/en/` delegam para `src/views/`, compartilhadas entre idiomas. Helpers puros e testados (`src/i18n`, `src/lib`) concentram as regras de rota, SEO e conteúdo. Toda configuração específica do site fica em `site.config.ts`.

**Tech Stack:** Astro 7.x · TypeScript strict · Tailwind CSS 4.x (`@tailwindcss/vite`, `@tailwindcss/typography`) · `@astrojs/mdx` · `@astrojs/sitemap` · `@astrojs/rss` · `astro-icon` + `@iconify-json/lucide` + `@iconify-json/simple-icons` · `@fontsource-variable/inter` · `@fontsource-variable/manrope` · `@fontsource/manrope` (WOFF para OG) · `satori` + `sharp` · `gray-matter` · Vitest · Playwright + `@axe-core/playwright` · `@lhci/cli` · ESLint (`eslint-plugin-astro`, `typescript-eslint`) · Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`) · Node 24 LTS · npm.

**Spec:** `docs/superpowers/specs/2026-10-05-redesign-astro-design.md`. Leia a spec inteira antes de começar; as seções citadas como §N referem-se a ela.

## Global Constraints

- Branch de trabalho: `redesign-astro`. Nunca commitar em `master`.
- Node `>=22.12.0` (exigência do Astro 7); `.nvmrc` = `24`; `package.json#engines.node` = `">=22.12.0"`. Localmente a máquina tem Node 20: rode `nvm install 24 && nvm use 24` antes de tudo.
- `npm install`, `npx playwright install` e qualquer acesso à rede exigem rodar fora do sandbox.
- Se uma API do Astro 7 diferir do descrito aqui (content layer, `astro:assets`, i18n, redirects), siga a documentação oficial do Astro 7 e mantenha os nomes e interfaces deste plano.
- `output: 'static'`, `trailingSlash: 'always'`, `build.format: 'directory'`. Todo link interno termina com `/` e é gerado por `path()` (Task 2), nunca escrito à mão.
- O domínio `https://universitas-io.github.io` aparece **somente** em `site.config.ts`.
- Idiomas: `pt` (padrão, sem prefixo, `<html lang="pt-BR">`) e `en` (prefixo `/en/`, `<html lang="en">`).
- Slugs: somente `^[a-z0-9-]+$` (sem acentos).
- Tokens de cor exatos de §4.1; fontes Manrope Variable (títulos) e Inter Variable (texto), auto-hospedadas. Nenhuma requisição a Google Fonts nem a CDNs.
- JS no cliente apenas em: menu mobile, alternância de tema, envio progressivo do formulário, GoatCounter. Nenhum framework de UI no cliente.
- `description` ≤ 155 caracteres; `title` obrigatório; toda imagem tem `alt` não vazio.
- Textos: tom consultivo, claro, sem jargão vazio; **nenhum número, depoimento, cliente ou pessoa inventados** (§5.5). EN é tradução natural, não literal.
- Conteúdo `draft: true` aparece só em `astro dev` com selo "RASCUNHO" e nunca no build de produção.
- WCAG 2.2 AA; zero violações axe em claro e escuro.
- Commits pequenos, no estilo Conventional Commits, ao final de cada task (ou de cada step de commit).

## Review Focus

1. **Seletor de idioma numa página sem par publicado** (artigo só em PT, ou par em `draft`): deve levar ao índice equivalente do outro idioma (`/en/insights/`), nunca a um 404. Teste na Task 11.
2. **Formulário com JavaScript desativado:** precisa enviar por POST nativo para o Web3Forms com `redirect` para a página de obrigado do idioma correto. Teste na Task 13 com `javaScriptEnabled: false`.
3. **Troca de domínio:** canonical, `og:url`, `og:image`, sitemap, robots e RSS derivam todos de `site.url`. Teste na Task 1 (string do domínio só em `site.config.ts`) e na Task 3 (`buildMeta` usa `site.url`).
4. **Modo escuro:** sem flash ao carregar com tema escuro salvo e sem violações de contraste. Teste axe em `colorScheme: 'dark'` na Task 6, repetido nas páginas das Tasks 7–13.
5. **Links internos quebrados ou sem barra final** (incluindo `/en/`): verificação de links sobre `dist/` na Task 15 e redirecionamentos antigos testados na Task 14.

---

## File Structure

```
.nvmrc                          node 24
package.json                    scripts, engines, deps
astro.config.mjs                integrações, i18n, redirects, vite tailwind
site.config.ts                  ÚNICA fonte de domínio, contatos, redes, chaves
tsconfig.json                   strict + alias "~/*" → "src/*"
eslint.config.js, .prettierrc.json, .prettierignore
vitest.config.ts, playwright.config.ts, lighthouserc.json
scripts/
  check-content.ts              integridade de conteúdo (roda antes do build)
  generate-icons.ts             PNGs/ICO a partir do logo-mark.svg
src/
  content.config.ts             schemas Zod
  content/{services,audiences,cases,insights}/{pt,en}/…  team/*.yaml
  i18n/routes.ts                Locale, path(), staticAlternate(), langFromPath()
  i18n/ui.ts                    textos de interface + t()
  i18n/redirects.ts             mapa de URLs antigas
  lib/content.ts                consultas: published(), byLang(), translationOf(), entryLang(), entrySlug()
  lib/content-integrity.ts      funções puras usadas por scripts/check-content.ts
  lib/seo/meta.ts               buildMeta(), formatTitle()
  lib/seo/jsonld.ts             geradores JSON-LD
  lib/og.ts                     ogPathFor(), listOgPages()
  lib/reading-time.ts           readingTime()
  components/layout/…  components/seo/…  components/ui/…  components/sections/…  components/forms/…
  layouts/BaseLayout.astro, PageLayout.astro, ArticleLayout.astro
  views/…                       uma view por tipo de página, recebe `lang`
  pages/…  pages/en/…  pages/og/[...slug].png.ts  pages/robots.txt.ts  pages/404.astro
  scripts/theme.ts, scripts/mobile-nav.ts, scripts/contact-form.ts   (JS de cliente)
  styles/global.css
  assets/brand/*.svg  assets/images/cases/<slug>/*  assets/images/team/*
public/ favicon.svg favicon.ico apple-touch-icon.png icon-192.png icon-512.png site.webmanifest
tests/unit/*.test.ts  tests/e2e/*.spec.ts  tests/e2e/helpers.ts
.github/workflows/ci.yml  .github/workflows/deploy.yml
```

---

### Task 1: Scaffold Astro + ferramentas de qualidade

**Files:**
- Create: `.nvmrc`, `package.json`, `astro.config.mjs`, `site.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `vitest.config.ts`, `src/pages/index.astro` (provisório), `src/styles/global.css` (provisório: só `@import "tailwindcss";`), `tests/unit/site-config.test.ts`
- Modify: `.gitignore`
- Delete (local, não versionados, conflitam com o `public/` do Astro): `public/`, `resources/`, `.hugo_build.lock`

**Interfaces:**
- Produces: `import { site } from '~/../site.config'` (ou alias `@site` → `./site.config.ts`), com a forma exata de §6.7, mais `site.locales = { pt: 'pt-BR', en: 'en' } as const`. O alias `~/*` aponta para `src/*`.

- [ ] **Step 1: Preparar Node.** Rode `nvm install 24 && nvm use 24`. Esperado: `node --version` → `v24.x`.
- [ ] **Step 2: Remover saídas locais do Hugo.** `rm -rf public resources .hugo_build.lock`. Esses itens já estão no `.gitignore` e não aparecem no diff.
- [ ] **Step 3: Criar `package.json` e instalar dependências** (fora do sandbox). Use `npm init -y`, depois `npm i astro @astrojs/mdx @astrojs/sitemap @astrojs/rss astro-icon @iconify-json/lucide @iconify-json/simple-icons tailwindcss @tailwindcss/vite @tailwindcss/typography @fontsource-variable/inter @fontsource-variable/manrope` e `npm i -D typescript @astrojs/check vitest @playwright/test @axe-core/playwright @lhci/cli eslint eslint-plugin-astro typescript-eslint prettier prettier-plugin-astro prettier-plugin-tailwindcss satori sharp @fontsource/manrope gray-matter linkinator`. Configure `"type": "module"`, `"private": true`, `engines.node ">=22.12.0"` e os scripts:

```json
"dev": "astro dev",
"check:content": "node scripts/check-content.ts",
"check": "astro check",
"build": "npm run check:content && astro build",
"preview": "astro preview",
"lint": "eslint . && prettier --check .",
"format": "prettier --write .",
"test": "vitest run",
"test:e2e": "playwright test",
"icons": "node scripts/generate-icons.ts",
"lhci": "lhci autorun"
```

  Até a Task 4, `scripts/check-content.ts` pode ser um arquivo que só faz `process.exit(0)`.
- [ ] **Step 4: Criar a configuração.** `astro.config.mjs` com `site: site.url`, `trailingSlash: 'always'`, `build: { format: 'directory' }`, `i18n: { defaultLocale: 'pt', locales: ['pt','en'], routing: { prefixDefaultLocale: false } }`, `vite: { plugins: [tailwindcss()] }` e integrações `mdx()`, `icon()` (sitemap entra na Task 14). `tsconfig.json` estende `astro/tsconfigs/strict` com `paths: { "~/*": ["src/*"] }`. `.gitignore` recebe as entradas de §8 item 5.
- [ ] **Step 5: Escrever o teste que falha** em `tests/unit/site-config.test.ts`:

```ts
import { site } from '../../site.config';
import { execSync } from 'node:child_process';

test('site.url is absolute https without trailing slash', () => {
  expect(site.url).toMatch(/^https:\/\/[^/]+$/);
});
test('domain string appears only in site.config.ts', () => {
  const out = execSync('grep -rl "universitas-io.github.io" src scripts astro.config.mjs || true').toString().trim();
  expect(out).toBe('');
});
test('locales map', () => {
  expect(site.locales).toEqual({ pt: 'pt-BR', en: 'en' });
});
```

- [ ] **Step 6: Rodar.** `npm test`. Esperado: FAIL (`site.config` inexistente).
- [ ] **Step 7: Criar `site.config.ts`** exatamente como em §6.7, mais `locales`.
- [ ] **Step 8: Verificar.** `npm test` → PASS. `npm run build` → sucesso, com `dist/index.html` gerado. `npm run check` → 0 erros. `npm run lint` → sem erros (configure `.prettierignore` para `dist`, `.astro`, `node_modules`, `content/` (Hugo), `config/`, `docs/`).
- [ ] **Step 9: Commit.** `git add -A && git commit -m "chore: scaffold Astro project with Tailwind, lint, and tests"`.

---

### Task 2: i18n — rotas e textos de interface

**Files:**
- Create: `src/i18n/routes.ts`, `src/i18n/ui.ts`
- Test: `tests/unit/routes.test.ts`, `tests/unit/ui.test.ts`

**Interfaces:**
- Produces (`src/i18n/routes.ts`):
  - `export const locales = ['pt', 'en'] as const; export type Locale = typeof locales[number];`
  - `export const defaultLocale: Locale = 'pt';`
  - `export type RouteKey = 'home' | 'services' | 'audiences' | 'cases' | 'insights' | 'about' | 'contact' | 'thanks' | 'privacy';`
  - `export const segments: Record<Exclude<RouteKey,'home'>, Record<Locale,string>>` com os valores: services `servicos`/`services`, audiences `para`/`for`, cases `casos`/`cases`, insights `insights`/`insights`, about `sobre`/`about`, contact `contato`/`contact`, thanks `contato/obrigado`/`contact/thank-you`, privacy `privacidade`/`privacy`.
  - `export function path(lang: Locale, key: RouteKey, slug?: string): string`
  - `export function staticAlternate(pathname: string, target: Locale): string | null` resolve só páginas fixas e índices; retorna `null` para páginas de conteúdo (`/servicos/x/`).
  - `export function langFromPath(pathname: string): Locale`
- Produces (`src/i18n/ui.ts`): `export const ui: Record<Locale, Record<UiKey,string>>` e `export function t(lang: Locale, key: UiKey): string`. Chaves mínimas: `nav.services`, `nav.audiences`, `nav.cases`, `nav.insights`, `nav.about`, `cta.proposal`, `cta.services`, `cta.whatsapp`, `skip`, `theme.toggle`, `lang.switch`, `footer.invoice` ("Emitimos nota fiscal para pessoas físicas e jurídicas."), `footer.rights`, `breadcrumb.home`, `draft.badge` ("RASCUNHO"/"DRAFT"), mais as que as tasks seguintes precisarem (adicione sempre nos dois idiomas).

- [ ] **Step 1: Escrever os testes que falham**:

```ts
// routes.test.ts
expect(path('pt','home')).toBe('/');
expect(path('en','home')).toBe('/en/');
expect(path('pt','services','pesquisa-quantitativa')).toBe('/servicos/pesquisa-quantitativa/');
expect(path('en','audiences','public-sector')).toBe('/en/for/public-sector/');
expect(path('en','thanks')).toBe('/en/contact/thank-you/');
expect(path('pt','privacy')).toBe('/privacidade/');
expect(staticAlternate('/sobre/','en')).toBe('/en/about/');
expect(staticAlternate('/en/privacy/','pt')).toBe('/privacidade/');
expect(staticAlternate('/','en')).toBe('/en/');
expect(staticAlternate('/en/','pt')).toBe('/');
expect(staticAlternate('/contato/obrigado/','en')).toBe('/en/contact/thank-you/');
expect(staticAlternate('/servicos/','en')).toBe('/en/services/');
expect(staticAlternate('/servicos/pesquisa-quantitativa/','en')).toBeNull();
expect(langFromPath('/en/cases/')).toBe('en');
expect(langFromPath('/casos/')).toBe('pt');
expect(langFromPath('/en')).toBe('en');
// ui.test.ts
expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.pt).sort());
for (const l of locales) for (const v of Object.values(ui[l])) expect(v.trim()).not.toBe('');
```

- [ ] **Step 2: Rodar.** `npm test`. Esperado: FAIL (módulos inexistentes).
- [ ] **Step 3: Implementar** `routes.ts` e `ui.ts` com as assinaturas acima. `staticAlternate` compara o pathname (normalizado com barra final) com `path(lang, key)` de cada `RouteKey` no idioma de origem.
- [ ] **Step 4: Rodar.** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat(i18n): add route map and UI strings"` (inclua os arquivos novos com `git add`).

---

### Task 3: SEO — metadados e JSON-LD

**Files:**
- Create: `src/lib/seo/meta.ts`, `src/lib/seo/jsonld.ts`
- Test: `tests/unit/meta.test.ts`, `tests/unit/jsonld.test.ts`

**Interfaces:**
- Consumes: `site`, `Locale`, `path`.
- Produces (`meta.ts`):

```ts
export interface MetaInput {
  title: string; description: string; lang: Locale; pathname: string;
  alternates: Partial<Record<Locale, string>>;   // pathnames
  ogImage?: string;                               // pathname, ex.: '/og/servicos/x.png'
  type?: 'website' | 'article'; noindex?: boolean;
  publishedTime?: string; modifiedTime?: string;
}
export interface PageMeta {
  title: string; description: string; canonical: string; robots: string;
  hreflang: { lang: string; href: string }[];    // inclui x-default
  og: Record<string, string | string[]>;         // og:* e twitter:*
}
export function formatTitle(title: string): string;
export function buildMeta(input: MetaInput): PageMeta;
```

- Produces (`jsonld.ts`), todas retornando `Record<string, unknown>` com `@context`, exceto `graph()`: `organization()`, `website(lang)`, `breadcrumbs(items: {name: string; pathname: string}[])`, `service({name, description, pathname, lang, audience?: string[]})`, `faqPage(items: {q: string; a: string}[])`, `article({headline, description, pathname, lang, datePublished, dateModified?, image?, author: PersonInput})`, `person(p: PersonInput)`, `aboutPage({pathname, lang, members: PersonInput[]})`, `contactPage({pathname, lang})`, `graph(...nodes)` (`{ '@context': 'https://schema.org', '@graph': nodes }`). `PersonInput = { name: string; jobTitle?: string; url?: string; sameAs?: string[]; alumniOf?: string[] }`.

- [ ] **Step 1: Escrever os testes que falham**:

```ts
const m = buildMeta({ title: 'Pesquisa Quantitativa', description: 'x'.repeat(100), lang: 'pt',
  pathname: '/servicos/pesquisa-quantitativa/', alternates: { pt: '/servicos/pesquisa-quantitativa/', en: '/en/services/quantitative-research/' } });
expect(m.title).toBe('Pesquisa Quantitativa | Universitas');
expect(formatTitle('Universitas — Consultoria em pesquisa')).toBe('Universitas — Consultoria em pesquisa');
expect(m.canonical).toBe(`${site.url}/servicos/pesquisa-quantitativa/`);
expect(m.hreflang).toEqual([
  { lang: 'pt-BR', href: `${site.url}/servicos/pesquisa-quantitativa/` },
  { lang: 'en', href: `${site.url}/en/services/quantitative-research/` },
  { lang: 'x-default', href: `${site.url}/servicos/pesquisa-quantitativa/` },
]);
expect(m.robots).toBe('index, follow');
expect(m.og['og:locale']).toBe('pt_BR');
expect(m.og['og:locale:alternate']).toEqual(['en_US']);
expect(m.og['twitter:card']).toBe('summary_large_image');
expect(buildMeta({ ...base, noindex: true }).robots).toBe('noindex, follow');
expect(() => buildMeta({ ...base, description: 'x'.repeat(156) })).toThrow(/155/);
// hreflang de página sem par: só o próprio idioma + x-default apontando para PT se existir, senão para a própria
// jsonld
expect(organization()).toMatchObject({ '@type': 'Organization', name: 'Universitas', url: site.url });
expect((organization() as any).sameAs).toContain(site.social.linkedin);
expect(faqPage([{ q: 'A?', a: 'B' }])).toMatchObject({ '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'A?', acceptedAnswer: { '@type': 'Answer', text: 'B' } }] });
expect(breadcrumbs([{ name: 'Início', pathname: '/' }, { name: 'Serviços', pathname: '/servicos/' }]))
  .toMatchObject({ '@type': 'BreadcrumbList', itemListElement: [{ position: 1, item: `${site.url}/` }, { position: 2 }] });
expect(article({ ...a, author: { name: 'Fulano', sameAs: ['https://orcid.org/x'] } })).toMatchObject({ '@type': 'Article', inLanguage: 'pt-BR', author: { '@type': 'Person', name: 'Fulano' } });
expect(service({ ...s })).toMatchObject({ '@type': 'Service', provider: { '@type': 'Organization' }, areaServed: { '@type': 'Country', name: 'Brasil' } });
```

- [ ] **Step 2: Rodar.** `npm test`. Esperado: FAIL.
- [ ] **Step 3: Implementar** `meta.ts` e `jsonld.ts`. A imagem OG padrão é `/og/default.png` quando `ogImage` está ausente. URLs absolutas sempre via `new URL(pathname, site.url).href`. O mapa de locale OG é `pt → pt_BR`, `en → en_US`.
- [ ] **Step 4: Rodar.** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat(seo): add meta builder and JSON-LD generators"`.

---

### Task 4: Content Collections, consultas e integridade

**Files:**
- Create: `src/content.config.ts`, `src/lib/content.ts`, `src/lib/content-integrity.ts`, `scripts/check-content.ts` (substitui o stub), `src/content/team/exemplo-pesquisadora.yaml` (draft), fixtures mínimas
- Test: `tests/unit/content-integrity.test.ts`, `tests/unit/content.test.ts`

**Interfaces:**
- Produces (`content.config.ts`): coleções `services`, `audiences`, `cases`, `insights` (loader `glob` com `base: './src/content/<col>'` e padrão `**/*.{md,mdx}`) e `team` (`glob` `*.yaml`). Campos conforme §6.3, com estes detalhes:
  - Campos comuns: `title: z.string().min(1)`, `description: z.string().min(1).max(155)`, `translationKey: z.string().regex(/^[a-z0-9-]+$/)`, `draft: z.boolean().default(false)`.
  - Listas que referenciam outras coleções (`services[]`, `audiences[]`) guardam **`translationKey`s** (strings), resolvidos por `lib/content`.
  - Imagens: `cover: z.object({ src: image(), alt: z.string().min(1) })`; `gallery` usa o mesmo formato.
  - `insights`: `author: reference('team')`, `pubDate: z.coerce.date()`, `updatedDate: z.coerce.date().optional()`, `translationOptional: z.boolean().default(false)`.
  - `team`: `photo` é **opcional** (sem foto, o avatar mostra as iniciais; isso permite lançar sem fotos), `role: z.object({ pt, en })`, `bio: z.object({ pt, en })`, `education: z.array(z.string())`, `areas: z.array(z.string())`, `links: z.object({ lattes, orcid, linkedin, website }).partial()` (URLs), `order: z.number()`, `draft`.
  - `services.icon`/`audiences.icon`: nome de ícone Lucide (`string`). `tools[]`: nomes de ícone Simple Icons ou rótulos livres; veja Task 10 para o mapeamento.
- Produces (`lib/content.ts`):
  - `entryLang(id: string): Locale` (primeiro segmento do id: `pt/x` → `pt`)
  - `entrySlug(id: string): string` (último segmento sem extensão)
  - `isVisible(data: { draft: boolean }, prod = import.meta.env.PROD): boolean`
  - `getLocalized<C extends 'services'|'audiences'|'cases'|'insights'>(c: C, lang: Locale): Promise<CollectionEntry<C>[]>`: visíveis no idioma, ordenados por `order` ou por data decrescente.
  - `translationOf<C>(entry: CollectionEntry<C>, target: Locale): Promise<CollectionEntry<C> | undefined>`: par visível com o mesmo `translationKey`.
  - `byTranslationKeys<C>(c: C, keys: string[], lang: Locale): Promise<CollectionEntry<C>[]>`
  - `getTeam(): Promise<CollectionEntry<'team'>[]>`: visíveis, por `order`.
- Produces (`lib/content-integrity.ts`), funções puras:

```ts
export interface RawEntry { collection: string; lang: 'pt' | 'en' | null; slug: string; data: Record<string, unknown> }
export function findMissingTranslations(entries: RawEntry[]): string[];       // mensagens "services/pt/x: sem par en (translationKey=y)"
export function findBadSlugs(entries: RawEntry[]): string[];                  // slug fora de ^[a-z0-9-]+$
export function findBrokenKeyRefs(entries: RawEntry[]): string[];             // services[]/audiences[] apontando p/ translationKey inexistente
export function findMissingRequiredPublished(entries: RawEntry[]): string[];  // team sem nenhum item draft:false → mensagem
```

- `scripts/check-content.ts`: lê `src/content/**` com `gray-matter` (MD/MDX) e `yaml` do gray-matter (YAML), monta `RawEntry[]`, roda as quatro funções e sai com código 1 listando as mensagens. Em produção, entradas `draft: true` não contam como par válido nem como membro publicado. A flag `--allow-drafts` (usada no CI de PR e localmente) desliga só `findMissingRequiredPublished`. Use apenas sintaxe TS apagável (`node` executa direto).

- [ ] **Step 1: Escrever os testes que falham**:

```ts
const e = (collection, lang, slug, data) => ({ collection, lang, slug, data });
expect(findMissingTranslations([
  e('services','pt','pesquisa-quantitativa',{ translationKey:'quant', draft:false }),
])).toEqual([expect.stringContaining('services/pt/pesquisa-quantitativa')]);
expect(findMissingTranslations([
  e('services','pt','a',{ translationKey:'k', draft:false }), e('services','en','b',{ translationKey:'k', draft:false }),
])).toEqual([]);
expect(findMissingTranslations([
  e('services','pt','a',{ translationKey:'k', draft:false }), e('services','en','b',{ translationKey:'k', draft:true }),
])).toHaveLength(1);                                   // par em draft não conta
expect(findMissingTranslations([
  e('insights','pt','a',{ translationKey:'k', draft:false, translationOptional:true }),
])).toEqual([]);
expect(findBadSlugs([e('cases','pt','diagramação',{})])).toHaveLength(1);
expect(findBrokenKeyRefs([e('services','pt','a',{ translationKey:'s', audiences:['nope'] })])).toHaveLength(1);
expect(findMissingRequiredPublished([e('team',null,'x',{ draft:true })])).toHaveLength(1);
expect(findMissingRequiredPublished([e('team',null,'x',{ draft:false })])).toEqual([]);
// content.test.ts
expect(entryLang('en/quantitative-research')).toBe('en');
expect(entrySlug('pt/pesquisa-quantitativa.md')).toBe('pesquisa-quantitativa');
expect(isVisible({ draft: true }, true)).toBe(false);
expect(isVisible({ draft: true }, false)).toBe(true);
```

- [ ] **Step 2: Rodar.** `npm test`. Esperado: FAIL.
- [ ] **Step 3: Implementar** `content-integrity.ts`, `content.ts`, `content.config.ts` e `scripts/check-content.ts`.
- [ ] **Step 4: Criar `src/content/team/exemplo-pesquisadora.yaml`** com `draft: true`, nome "Pesquisadora Exemplo" e textos explicitamente marcados como exemplo. Mude o script `build` para `npm run check:content && astro build` e crie `build:preview` = `node scripts/check-content.ts --allow-drafts && astro build`.
- [ ] **Step 5: Rodar.** `npm test` → PASS. `node scripts/check-content.ts` → sai com 1 e mensagem sobre equipe sem membro publicado (esperado e desejado, §5.5). `node scripts/check-content.ts --allow-drafts` → sai com 0. `npm run check` → 0 erros.
- [ ] **Step 6: Commit.** `git commit -m "feat(content): add collections, queries, and integrity checks"`.

---

### Task 5: Marca — logo SVG e ícones

**Files:**
- Create: `src/assets/brand/logo-mark.svg`, `src/assets/brand/logo-horizontal.svg`, `src/assets/brand/logo-horizontal-dark.svg`, `src/components/ui/Logo.astro`, `scripts/generate-icons.ts`, `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`
- Reference: `assets/img/logo.png` (Hugo), fonte visual. Não copie o PNG.

**Interfaces:**
- Produces: `<Logo variant="mark" | "horizontal" class?: string />`. A variante `horizontal` usa `currentColor` no "U" e no texto, para funcionar em claro e escuro. O gradiente da treliça é fixo (`#3BA7E0 → #6CC24A`), com `id` de gradiente único por instância para evitar colisão de `<defs>` inline.

- [ ] **Step 1: Desenhar `logo-mark.svg`** (viewBox `0 0 64 64`), fiel ao `logo.png`: "U" largo azul-marinho `#1F3A5F` (braço direito alto, curva inferior que afina até a ponta esquerda) e, no braço esquerdo, uma treliça de nós (dois losangos empilhados com diagonais, nós circulares e um traço descendo até a curva) com gradiente vertical `#3BA7E0 → #6CC24A`. Formas simples, legíveis a 16px.
- [ ] **Step 2: Criar as variantes horizontais** (símbolo + "Universitas" em Manrope 700 convertido em `<path>` ou como `<text>` com fallback; prefira path para não depender de fonte). A versão `-dark` usa `#E8EEF6` no lugar do azul-marinho.
- [ ] **Step 3: Escrever `scripts/generate-icons.ts`** usando `sharp` para gerar a partir de `logo-mark.svg`: `apple-touch-icon.png` (180, fundo branco, margem 12%), `icon-192.png`, `icon-512.png` e `favicon.ico` (32×32, PNG embutido em container ICO). Copie também o SVG para `public/favicon.svg`. `site.webmanifest` com `name: "Universitas"`, `theme_color: "#1F3A5F"`, `background_color: "#FFFFFF"` e os ícones.
- [ ] **Step 4: Rodar.** `npm run icons`. Esperado: os 5 arquivos de `public/` criados. Abra `public/favicon.svg` e `public/icon-512.png` (visualizador de imagem) e compare lado a lado com `assets/img/logo.png`: mesmo conceito, legível.
- [ ] **Step 5: Implementar `Logo.astro`**, importando os SVGs como componentes (`?raw` ou import de SVG do Astro), e usá-lo na página provisória.
- [ ] **Step 6: Verificar.** `npm run build` → sucesso.
- [ ] **Step 7: Commit.** `git commit -m "feat(brand): add vector logo, favicons, and web manifest"`.

---

### Task 6: Design system, layout base e harness de e2e

**Files:**
- Create: `src/styles/global.css` (definitivo), `src/components/seo/Seo.astro`, `src/components/seo/JsonLd.astro`, `src/layouts/BaseLayout.astro`, `src/layouts/PageLayout.astro`, `src/components/layout/{Header,Footer,MobileNav,MobileCtaBar,LanguageSwitcher,ThemeToggle,Breadcrumbs,SkipLink}.astro`, `src/components/ui/{Button,Card,SectionHeading,Eyebrow,Icon,NetworkPattern,DraftBadge,Container}.astro`, `src/scripts/theme.ts`, `src/scripts/mobile-nav.ts`, `playwright.config.ts`, `tests/e2e/helpers.ts`, `tests/e2e/layout.spec.ts`
- Modify: `src/pages/index.astro` (provisório usando `BaseLayout`), criar `src/pages/en/index.astro` provisório

**Interfaces:**
- Consumes: `buildMeta`, `organization`, `website`, `breadcrumbs`, `t`, `path`, `staticAlternate`, `Logo`.
- Produces:
  - `BaseLayout` props: `{ lang: Locale; title: string; description: string; pathname: string; alternates: Partial<Record<Locale,string>>; ogImage?: string; type?: 'website'|'article'; noindex?: boolean; jsonLd?: Record<string,unknown>[]; publishedTime?: string; modifiedTime?: string }`. Injeta `organization()` e `website(lang)` em todo `<head>`.
  - `PageLayout` props: as de `BaseLayout` mais `{ crumbs: {name: string; pathname: string}[]; heading: string; lead?: string; eyebrow?: string }`. Renderiza breadcrumbs visíveis + JSON-LD `breadcrumbs(crumbs)` e um único `<h1>`.
  - `LanguageSwitcher` recebe `alternates` e mostra o link para o outro idioma. Se o idioma alvo estiver ausente em `alternates`, usa `fallbackPathname` (prop obrigatória: índice da seção no idioma alvo).
  - `tests/e2e/helpers.ts`: `expectSeo(page, { canonical: string; hreflang: Record<string,string>; robots?: string })`, `expectA11y(page)` (axe, tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`; falha se `violations.length > 0`, imprimindo-as), `expectJsonLdTypes(page, types: string[])`.
  - Tokens Tailwind em `global.css` via `@theme`: `--color-navy-900: #0F2340`, `--color-navy-700: #1F3A5F`, `--color-blue-500: #2A8FC7`, `--color-green-600: #2E9E6B`, `--color-surface: #FFFFFF`, `--color-surface-alt: #F3F7FB`, `--color-ink-600: #4B5B70`, `--font-display: "Manrope Variable"`, `--font-sans: "Inter Variable"`. O modo escuro usa a variante `dark:` ligada a `[data-theme="dark"]` em `<html>` (`@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`), com fundo `#0B1626`, texto `#E8EEF6` e destaques clareados que mantêm AA.

- [ ] **Step 1: Configurar Playwright.** `playwright.config.ts` com `webServer: { command: 'npm run build:preview && npm run preview -- --port 4321', port: 4321, reuseExistingServer: !process.env.CI }`, projetos `chromium` desktop e `Pixel 7` (mobile). Rode `npx playwright install --with-deps chromium` fora do sandbox.
- [ ] **Step 2: Escrever o teste e2e que falha** `tests/e2e/layout.spec.ts`:

```ts
test('pt home shell: lang, skip link, header nav, footer invoice note', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await expect(page.getByRole('navigation', { name: /principal/i })).toBeVisible();   // desktop project
  await expect(page.getByText('Emitimos nota fiscal para pessoas físicas e jurídicas.')).toBeVisible();
  await expectSeo(page, { canonical: '/', hreflang: { 'pt-BR': '/', en: '/en/', 'x-default': '/' } });
  await expectJsonLdTypes(page, ['Organization', 'WebSite']);
});
test('language switcher goes to /en/', async ({ page }) => { await page.goto('/'); await page.getByRole('link', { name: 'English' }).click(); await expect(page).toHaveURL(/\/en\/$/); });
test('theme toggle persists without flash', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: /tema|theme/i }).click();
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('mobile nav opens with keyboard and traps Escape', async ({ page, isMobile }) => { test.skip(!isMobile); /* abre com Enter, fecha com Escape, foco volta ao botão */ });
test('a11y light and dark', async ({ page }) => {
  await page.goto('/'); await expectA11y(page);
  await page.emulateMedia({ colorScheme: 'dark' }); await page.goto('/'); await expectA11y(page);
});
```

  (`expectSeo` resolve os pathnames contra `site.url`.)
- [ ] **Step 3: Rodar.** `npm run test:e2e`. Esperado: FAIL.
- [ ] **Step 4: Implementar** `global.css`, `Seo`, `JsonLd` e os layouts e componentes listados. Requisitos:
  - Script inline no `<head>`, antes do CSS, que lê `localStorage.theme` ou `prefers-color-scheme` e define `data-theme`. Esse é o único script bloqueante.
  - Header fixo com nav "principal" (`aria-label`), dropdown "Para quem" acessível por teclado (botão com `aria-expanded`), botão "Solicitar proposta" → `path(lang,'contact')`.
  - `MobileNav`: gaveta `<dialog>` com foco preso e fechamento por Escape.
  - `MobileCtaBar`: só abaixo de `md`, com "Solicitar proposta" + WhatsApp (`https://wa.me/${site.contact.whatsapp}`).
  - Footer conforme §3.3.
  - Preload da fonte Manrope do hero.
  - `NetworkPattern`: SVG decorativo com `aria-hidden="true"`.
  - `@media (prefers-reduced-motion: reduce)` desativa as animações de revelação.
  - `DraftBadge`: só renderiza quando `import.meta.env.DEV`.
- [ ] **Step 5: Rodar.** `npm run test:e2e` → PASS nos dois projetos. `npm test` → PASS. `npm run check` → 0 erros.
- [ ] **Step 6: Commit.** `git commit -m "feat(ui): add design tokens, base layouts, header/footer, and e2e harness"`.

---

### Task 7: Serviços — conteúdo e páginas

**Files:**
- Create: `src/content/services/pt/{pesquisa-quantitativa,pesquisa-qualitativa,coleta-de-dados-digitais,dashboards-e-visualizacao,sites-academicos,diagramacao-e-formatacao}.md`, `src/content/services/en/{quantitative-research,qualitative-research,digital-data-collection,dashboards-and-data-visualization,academic-websites,document-layout-and-formatting}.md`, `src/views/ServicesIndexView.astro`, `src/views/ServiceView.astro`, `src/components/sections/{ServiceGrid,Faq,CtaBanner,ToolList}.astro`, `src/pages/servicos/index.astro`, `src/pages/servicos/[slug].astro`, `src/pages/en/services/index.astro`, `src/pages/en/services/[slug].astro`, `tests/e2e/services.spec.ts`
- Reference: `content/post/python-r/index.md`, `content/post/dashboard-dados/index.md`, `content/post/site-academico/index.md`, `content/post/diagramação-formatação/index.md` (e os `.en.md`)

**Interfaces:**
- Consumes: `getLocalized`, `translationOf`, `byTranslationKeys`, `PageLayout`, `service()`, `faqPage()`, `path`, `t`.
- Produces: `ServiceGrid` props `{ services: CollectionEntry<'services'>[]; lang: Locale; variant?: 'full' | 'compact' }` (reutilizado em home e públicos), `Faq` props `{ items: {q: string; a: string}[]; lang: Locale }` (renderiza `<details>` e não emite JSON-LD; a view emite), `CtaBanner` props `{ lang: Locale; title?: string; text?: string }`, `ToolList` props `{ tools: string[] }`.
- `translationKey`s fixos (usados pelas Tasks 8, 9 e 12): `quantitative`, `qualitative`, `digital-data`, `dashboards`, `academic-websites`, `document-formatting`. `tier: core` para os três primeiros, `complementary` para os demais. `order` de 1 a 6 nessa sequência.

- [ ] **Step 1: Escrever o teste e2e que falha** `tests/e2e/services.spec.ts`:

```ts
test('services index lists 3 core + 3 complementary', async ({ page }) => {
  await page.goto('/servicos/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Serviços/);
  await expect(page.locator('[data-tier="core"] article')).toHaveCount(3);
  await expect(page.locator('[data-tier="complementary"] article')).toHaveCount(3);
});
for (const [pt, en] of [['pesquisa-quantitativa','quantitative-research'], ['pesquisa-qualitativa','qualitative-research'], ['coleta-de-dados-digitais','digital-data-collection'], ['dashboards-e-visualizacao','dashboards-and-data-visualization'], ['sites-academicos','academic-websites'], ['diagramacao-e-formatacao','document-layout-and-formatting']]) {
  test(`service ${pt} seo + switcher`, async ({ page }) => {
    await page.goto(`/servicos/${pt}/`);
    await expectSeo(page, { canonical: `/servicos/${pt}/`, hreflang: { 'pt-BR': `/servicos/${pt}/`, en: `/en/services/${en}/`, 'x-default': `/servicos/${pt}/` } });
    await expectJsonLdTypes(page, ['Service', 'FAQPage', 'BreadcrumbList']);
    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(new RegExp(`/en/services/${en}/$`));
  });
}
test('service pages a11y', async ({ page }) => { for (const p of ['/servicos/','/servicos/pesquisa-quantitativa/','/en/services/qualitative-research/']) { await page.goto(p); await expectA11y(page); } });
```

- [ ] **Step 2: Rodar.** `npm run test:e2e -- services`. Esperado: FAIL.
- [ ] **Step 3: Escrever o conteúdo** (12 arquivos). Cada serviço segue §3.2 "Página de serviço" e as palavras-chave de §5.3. Front matter: `title`, `description` (≤ 155), `translationKey`, `tier`, `order`, `icon` (Lucide: `bar-chart-3`, `messages-square`, `database`, `layout-dashboard`, `globe`, `file-text`), `summary` (1 frase), `audiences` (translationKeys da Task 8: `academia`, `business`, `public-sector`), `tools`, `deliverables` (3 a 6 itens) e `faq` (3 a 5 itens; inclua em todos "Vocês emitem nota fiscal?" e, em quanti, quali e coleta, uma pergunta sobre ética e LGPD). O corpo em Markdown tem as seções "O que é", "Para quem", "Como fazemos".
  - Reaproveite fatos do conteúdo Hugo: lista de análises do `python-r`, os três níveis do `site-academico` (Fácil manutenção / Intermediário estático / Avançado, com as tecnologias citadas), normas ABNT/APA/MLA/Chicago e Zotero/BibTeX da diagramação, e as fontes de dados do dashboard.
  - Pesquisa Qualitativa é conteúdo novo: entrevistas em profundidade, grupos focais, análise de conteúdo e de discurso, codificação em NVivo/Atlas.ti/MAXQDA, QCAmap, análise de redes com Gephi, e métodos mistos.
  - O texto precisa servir para academia, empresas e setor público.
- [ ] **Step 4: Implementar** as views, as seções e as quatro páginas. As páginas `[slug]` usam `getStaticPaths` com `getLocalized('services', lang)` e calculam `alternates` via `translationOf`. A view emite `service()`, `faqPage()` (via `jsonLd` do layout) e uma seção "Casos relacionados" que fica vazia/oculta até a Task 9.
- [ ] **Step 5: Rodar.** `npm run test:e2e -- services` → PASS. `node scripts/check-content.ts --allow-drafts` → 0. `npm run check` → 0 erros.
- [ ] **Step 6: Commit.** `git commit -m "feat(services): add bilingual service content and pages"`.

---

### Task 8: Públicos — conteúdo e páginas

**Files:**
- Create: `src/content/audiences/pt/{academia,empresas,setor-publico}.md`, `src/content/audiences/en/{academia,business,public-sector}.md`, `src/views/AudienceView.astro`, `src/components/sections/AudienceGrid.astro`, `src/pages/para/[slug].astro`, `src/pages/en/for/[slug].astro`, `tests/e2e/audiences.spec.ts`

**Interfaces:**
- Consumes: `ServiceGrid`, `Faq`, `CtaBanner`, `byTranslationKeys`.
- Produces: `AudienceGrid` props `{ audiences: CollectionEntry<'audiences'>[]; lang: Locale }` (usado na home e no dropdown do Header). O Header passa a listar os públicos a partir da coleção. `translationKey`s: `academia`, `business`, `public-sector`.

- [ ] **Step 1: Escrever o teste e2e que falha**: para cada par (`/para/academia/` ↔ `/en/for/academia/`, `/para/empresas/` ↔ `/en/for/business/`, `/para/setor-publico/` ↔ `/en/for/public-sector/`), verificar `expectSeo` com hreflang correto, `expectJsonLdTypes(['WebPage','FAQPage','BreadcrumbList'])`, ao menos 2 links para `/servicos/…` (ou `/en/services/…`) e o dropdown "Para quem" do header contendo os 3 links. Inclua `expectA11y` em uma página por idioma.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Escrever o conteúdo** (6 arquivos): `painPoints` (4 a 6), `services` (translationKeys, os mais relevantes primeiro), `faq` (3 a 4) e corpo curto com as palavras-chave de §5.3.
  - Academia: teses, dissertações, artigos e projetos de grupos de pesquisa; apoio metodológico, sempre com autoria e integridade acadêmica do pesquisador preservadas (deixe explícito: a Universitas não escreve trabalhos por terceiros).
  - Empresas: pesquisa de mercado, satisfação, análise de dados de clientes, dashboards.
  - Setor público: avaliação de políticas, pesquisa de opinião, diagnóstico socioeconômico, transparência e reprodutibilidade.
- [ ] **Step 4: Implementar** a view, a grade, as páginas e o dropdown dinâmico no Header.
- [ ] **Step 5: Rodar.** `npm run test:e2e -- audiences layout` → PASS. `node scripts/check-content.ts --allow-drafts` → 0.
- [ ] **Step 6: Commit.** `git commit -m "feat(audiences): add audience landing pages"`.

---

### Task 9: Casos — conteúdo, imagens e páginas

**Files:**
- Create: `src/assets/images/cases/<slug>/…` (copiados de `content/post/*/`), `src/content/cases/pt/*.md`, `src/content/cases/en/*.md`, `src/layouts/ArticleLayout.astro`, `src/views/CasesIndexView.astro`, `src/views/CaseView.astro`, `src/components/sections/CaseGrid.astro`, `src/pages/casos/index.astro`, `src/pages/casos/[slug].astro`, `src/pages/en/cases/index.astro`, `src/pages/en/cases/[slug].astro`, `tests/e2e/cases.spec.ts`
- Modify: `src/views/ServiceView.astro`, `src/views/AudienceView.astro` (seção "Casos relacionados")

**Interfaces:**
- Produces: `ArticleLayout` props: as de `PageLayout` mais `{ cover?: { src: ImageMetadata; alt: string }; meta?: { label: string; value: string }[] }` (reutilizado na Task 11). `CaseGrid` props `{ cases: CollectionEntry<'cases'>[]; lang: Locale; limit?: number }`.
- Casos (slug PT ↔ slug EN, `translationKey`):
  1. `base-de-dados-youtube-tese` ↔ `youtube-database-doctoral-thesis` (`youtube-thesis`), sector `academia`, services `digital-data`, `quantitative`, `qualitative`; link `https://github.com/geraldohomero/dh-youtube-database`; números exatos do conteúdo atual: mais de 100 mil vídeos, 50 milhões de comentários, 49 canais, BERTopic. Imagens: `python-r/image*.png`.
  2. `analise-de-redes-clusterizacao` ↔ `network-analysis-clustering` (`network-clusters`), dashboard Python + D3.js. Imagem: `dashboard-dados/image-1.png`.
  3. `dashboard-power-bi-lr-instalacoes` ↔ `power-bi-dashboard-lr-instalacoes` (`powerbi-lr`), sector `business`. Imagem: `dashboard-dados/image.png`. Mantenha o nome do cliente como está no site atual e registre em §10 da spec que ele precisa ser confirmado.
  4. `sites-academicos-e-de-pesquisa` ↔ `academic-and-research-websites` (`academic-sites`): OEDLA, LABIIA, Seminário Discente PPGCP-Unicamp 2025, Processo seletivo, com os links e imagens de `site-academico/`.
  5. `diagramacao-dissertacao-e-anais` ↔ `dissertation-and-proceedings-layout` (`formatting-works`): Dissertação de Mestrado e Anais da XXXIV Semana de História da UFJF (links academia.edu).
  - Defina `featured: true` nos casos 1, 3 e 4. O campo `date` usa o ano conhecido; se não houver, use `2025-01-01` e anote no corpo apenas o que for verdadeiro (nunca invente métricas de resultado).

- [ ] **Step 1: Escrever o teste e2e que falha**: o índice `/casos/` lista 5 casos; cada caso tem `h1`, imagem de capa com `alt` não vazio, `expectSeo` com o par EN e `expectJsonLdTypes(['Article','BreadcrumbList'])`; `/servicos/coleta-de-dados-digitais/` mostra link para `/casos/base-de-dados-youtube-tese/`; links externos têm `rel="noopener"`; `expectA11y` no índice e em um caso por idioma.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Copiar as imagens** para `src/assets/images/cases/<translationKey>/` e escrever os 10 arquivos de conteúdo (contexto → desafio → método → resultado, §3.2).
- [ ] **Step 4: Implementar** o layout, as views, a grade, as páginas e as seções "Casos relacionados" (casos cujo `services` contém o serviço, ou cujo `sector` corresponde ao público).
- [ ] **Step 5: Rodar.** `npm run test:e2e -- cases services audiences` → PASS. Confira em `dist/` que as imagens saíram em `.avif`/`.webp` com `width`/`height`.
- [ ] **Step 6: Commit.** `git commit -m "feat(cases): add case studies with optimized images"`.

---

### Task 10: Sobre — missão, ética, equipe e ferramentas

**Files:**
- Create: `src/views/AboutView.astro`, `src/components/sections/{EthicsPledges,TeamGrid,ToolsByArea}.astro`, `src/components/ui/Avatar.astro`, `src/i18n/tools.ts`, `src/pages/sobre.astro`, `src/pages/en/about.astro`, `tests/e2e/about.spec.ts`

**Interfaces:**
- Consumes: `getTeam`, `aboutPage()`, `person()`.
- Produces:
  - `EthicsPledges` props `{ lang: Locale }`: quatro compromissos (LGPD, ética em pesquisa/CEP, transparência metodológica, reprodutibilidade), usados também na home.
  - `TeamGrid` props `{ members: CollectionEntry<'team'>[]; lang: Locale }`. Cada card tem `id={slug}` (âncora usada pela Task 11).
  - `Avatar` props `{ name: string; photo?: { src: ImageMetadata; alt: string } }`, com iniciais quando não há foto.
  - `src/i18n/tools.ts`: `toolAreas: { key: 'quant'|'qual'|'viz'|'web'; label: Record<Locale,string>; tools: { name: string; icon?: string }[] }[]`, com as ferramentas de §3.2 "Sobre". `icon` é nome Simple Icons quando existir (`simple-icons:r`, `simple-icons:python`, `simple-icons:sqlite`, `simple-icons:mysql`, `simple-icons:postgresql`, `simple-icons:tableau`, `simple-icons:looker`, `simple-icons:html5`, `simple-icons:css`, `simple-icons:javascript`, `simple-icons:react`, `simple-icons:nextdotjs`, `simple-icons:astro`, `simple-icons:dotnet`); sem ícone (NVivo, Atlas.ti, MAXQDA, QCAmap, Gephi, Power BI), mostra só o rótulo em chip. Verifique os nomes no pacote instalado; se algum não existir, use só o rótulo.

- [ ] **Step 1: Escrever o teste e2e que falha**: `/sobre/` ↔ `/en/about/` com `expectSeo`; `expectJsonLdTypes(['AboutPage','BreadcrumbList'])`; as 4 áreas de ferramentas visíveis; nenhuma requisição a `img.shields.io` (`page.on('request')`); com o build `build:preview`, o card "Pesquisadora Exemplo" aparece **só** se `DEV`. Em preview de produção ele **não** aparece, e a seção de equipe mostra uma mensagem neutra no lugar ("Em breve apresentaremos nossa equipe.") quando não houver membros visíveis. `expectA11y`.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Implementar** a view, as seções, o avatar, as ferramentas e as páginas. O texto de missão e valores é reescrito a partir de `content/page/Sobre/index.md` no novo posicionamento (equipe multidisciplinar: ciência política, história, ciência ambiental, análise de dados, desenvolvimento web). O JSON-LD `Person` de cada membro entra em `aboutPage({ members })`.
- [ ] **Step 4: Rodar.** `npm run test:e2e -- about` → PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat(about): add about page with ethics, team, and tools"`.

---

### Task 11: Insights — artigos, autoria e RSS

**Files:**
- Create: `src/lib/reading-time.ts`, `src/content/insights/pt/{como-escolher-abordagem-de-pesquisa,coleta-de-dados-redes-sociais-etica-lgpd}.mdx`, `src/content/insights/en/{choosing-a-research-approach,ethical-social-media-data-collection-lgpd}.mdx`, `src/views/InsightsIndexView.astro`, `src/views/InsightView.astro`, `src/components/sections/InsightList.astro`, `src/components/mdx/{Callout,Figure}.astro`, `src/pages/insights/index.astro`, `src/pages/insights/[slug].astro`, `src/pages/insights/rss.xml.ts`, `src/pages/en/insights/index.astro`, `src/pages/en/insights/[slug].astro`, `src/pages/en/insights/rss.xml.ts`, `tests/unit/reading-time.test.ts`, `tests/e2e/insights.spec.ts`

**Interfaces:**
- Consumes: `ArticleLayout`, `article()`, `person()`, `getLocalized('insights')`, `translationOf`.
- Produces: `readingTime(text: string): number` (minutos, 200 palavras/min, mínimo 1). `InsightList` props `{ posts: CollectionEntry<'insights'>[]; lang: Locale; limit?: number }`. `translationKey`s: `choosing-approach`, `social-data-ethics`. Autor: `exemplo-pesquisadora` (draft) até haver equipe real. Por isso os artigos também ficam `draft: true` até você revisá-los e indicar o autor.

- [ ] **Step 1: Escrever os testes que falham**:

```ts
expect(readingTime('palavra '.repeat(400))).toBe(2);
expect(readingTime('curto')).toBe(1);
```

  E2E (com `build:preview`, os drafts não aparecem; o projeto Playwright `dev` roda contra `astro dev` só para este spec — adicione o projeto em `playwright.config.ts` com `webServer` próprio na porta 4322):
  - em dev, `/insights/` lista 2 artigos com selo "RASCUNHO";
  - cada artigo tem autor linkando para `/sobre/#exemplo-pesquisadora`, data em `<time datetime>`, tempo de leitura, `expectJsonLdTypes(['Article','BreadcrumbList'])` e `expectSeo` com o par EN;
  - **Review Focus 1:** um artigo de fixture só em PT (crie `src/content/insights/pt/_fixture-somente-pt.mdx` com `translationOptional: true`, `draft: true`) tem o seletor de idioma apontando para `/en/insights/` e `hreflang` contendo só `pt-BR` + `x-default`;
  - em preview de produção, `/insights/` mostra estado vazio amigável e `/insights/rss.xml` é XML válido;
  - `expectA11y` num artigo.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Escrever os 2 artigos** (PT e EN, 900–1400 palavras cada), sem estatísticas inventadas. Cite apenas fontes reais e verificáveis (lei 13.709/2018 – LGPD; Resoluções CNS 466/2012 e 510/2016) e termine com um CTA.
  - Artigo 1: quando usar quanti, quali ou métodos mistos, perguntas que guiam a escolha e exemplos nos três setores.
  - Artigo 2: base legal, anonimização e pseudonimização, termos das plataformas, armazenamento seguro, relatório de conformidade, comitês de ética (CEP/Conep) para pesquisa acadêmica.
- [ ] **Step 4: Implementar** as views, a lista, os componentes MDX, as páginas e o RSS (`@astrojs/rss`, só visíveis, links absolutos via `site.url`). O índice ordena por `pubDate` decrescente.
- [ ] **Step 5: Rodar.** `npm test` e `npm run test:e2e -- insights` → PASS.
- [ ] **Step 6: Commit.** `git commit -m "feat(insights): add articles, author bylines, and RSS"`.

---

### Task 12: Home

**Files:**
- Create: `src/views/HomeView.astro`, `src/components/sections/{Hero,Process}.astro`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro` (deixam de ser provisórios)
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `AudienceGrid`, `ServiceGrid`, `CaseGrid` (featured, limit 3), `EthicsPledges`, `InsightList` (limit 3; oculto se vazio), `CtaBanner`, `NetworkPattern`.
- Copy fixa do hero:
  - PT: eyebrow "Consultoria em pesquisa", h1 "Evidências rigorosas para decisões e descobertas.", lead "Pesquisa quantitativa e qualitativa para universidades, empresas e setor público, com método, ética e transparência."
  - EN: eyebrow "Research consultancy", h1 "Rigorous evidence for decisions and discoveries.", lead "Quantitative and qualitative research for universities, businesses, and the public sector, grounded in method, ethics, and transparency."
  - Title da home (sem sufixo): "Universitas — Consultoria em pesquisa quantitativa e qualitativa" / "Universitas — Quantitative and qualitative research consultancy".
- `Process`: 5 passos (Briefing → Desenho metodológico → Coleta → Análise → Entrega e acompanhamento), uma frase cada.

- [ ] **Step 1: Escrever o teste e2e que falha**: o `h1` exato acima nos dois idiomas; ordem das seções via `data-section` (`hero`, `audiences`, `services`, `process`, `cases`, `ethics`, `insights?`, `cta`); 3 cards de público linkando para `/para/…`; 3 serviços principais + 3 complementares; 3 casos em destaque; botão "Solicitar proposta" no hero linkando para `/contato/`; `expectSeo` para `/` e `/en/`; `expectA11y` claro e escuro; nenhuma imagem acima da dobra com `loading="lazy"`.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Implementar** a view, o hero (com `NetworkPattern` e animação de entrada respeitando `prefers-reduced-motion`), o processo e as páginas.
- [ ] **Step 4: Rodar.** `npm run test:e2e -- home layout` → PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat(home): build bilingual home page"`.

---

### Task 13: Contato, formulário, obrigado e privacidade

**Files:**
- Create: `src/components/forms/ContactForm.astro`, `src/scripts/contact-form.ts`, `src/views/{ContactView,ThanksView,PrivacyView}.astro`, `src/pages/contato/index.astro`, `src/pages/contato/obrigado.astro`, `src/pages/privacidade.astro`, `src/pages/en/contact/index.astro`, `src/pages/en/contact/thank-you.astro`, `src/pages/en/privacy.astro`, `tests/e2e/contact.spec.ts`

**Interfaces:**
- Consumes: `site.integrations.web3formsKey`, `site.contact`, `getLocalized('services')`, `contactPage()`.
- Produces: `ContactForm` props `{ lang: Locale }`. Detalhes:
  - `<form method="POST" action="https://api.web3forms.com/submit">` com hidden `access_key`, `subject` ("Nova solicitação de proposta — site Universitas"), `from_name` ("Site Universitas"), `redirect` (= `site.url + path(lang,'thanks')`) e honeypot `<input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off">`.
  - Campos com `name`: `name`*, `email`*, `organization`, `phone`, `org_type`* (Academia / Empresa / Setor público / Terceiro setor / Outro), `service`* (títulos dos serviços do idioma + "Não sei ainda"/"Not sure yet"), `deadline`, `message`* e `consent`* (checkbox com link para `path(lang,'privacy')`).
  - Com `web3formsKey` vazio, o formulário não é renderizado: aparece um bloco com links de WhatsApp e e-mail.
- `src/scripts/contact-form.ts`: intercepta o submit, valida com `form.reportValidity()`, envia via `fetch` com `Accept: application/json`, desabilita o botão, anuncia o resultado em região `aria-live="polite"` e, em caso de erro, mostra a mensagem com links de WhatsApp e e-mail.

- [ ] **Step 1: Escrever o teste e2e que falha** (com chave de teste injetada: `site.config.ts` lê `import.meta.env.PUBLIC_WEB3FORMS_KEY ?? ''` como fallback; o `webServer` do Playwright define `PUBLIC_WEB3FORMS_KEY=test-key`):
  - campos obrigatórios bloqueiam o envio (submit vazio → o foco vai para "Nome", nenhuma requisição);
  - com JS: `page.route('https://api.web3forms.com/submit', r => r.fulfill({ json: { success: true } }))`, preencher, enviar → mensagem de sucesso visível na região `aria-live`;
  - com JS e a rota respondendo 500 → mensagem de erro com link do WhatsApp;
  - **Review Focus 2:** contexto `javaScriptEnabled: false` → o `form` tem `method=post`, `action` do Web3Forms e hidden `redirect` igual a `${site.url}/contato/obrigado/` (e `/en/contact/thank-you/` na versão EN);
  - `/contato/obrigado/` tem `robots` `noindex, follow`;
  - `/privacidade/` ↔ `/en/privacy/` com `expectSeo`;
  - `expectJsonLdTypes(['ContactPage'])` em contato;
  - `expectA11y` em contato (claro e escuro) e privacidade;
  - build sem chave (rode um teste unitário do componente via `experimental_AstroContainer`, se disponível, ou um e2e separado com env vazio): mostra links em vez do formulário.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Implementar** o formulário, o script, as views e as páginas. A política de privacidade segue §3.2 "Privacidade" e cita Web3Forms como operador e GoatCounter como analytics sem cookies. O controlador é "Universitas", com o e-mail de `site.contact.email`. Não invente CNPJ nem endereço: deixe um comentário `<!-- TODO usuário: CNPJ/endereço, se desejar -->` **apenas no código**, nunca no texto renderizado.
- [ ] **Step 4: Rodar.** `npm run test:e2e -- contact` → PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat(contact): add proposal form, thank-you, and privacy pages"`.

---

### Task 14: Infra de SEO — OG, sitemap, robots, redirects, 404, analytics

**Files:**
- Create: `src/lib/og.ts`, `src/pages/og/[...slug].png.ts`, `src/pages/robots.txt.ts`, `src/pages/404.astro`, `src/i18n/redirects.ts`, `src/components/seo/Analytics.astro`, `tests/unit/og.test.ts`, `tests/unit/redirects.test.ts`, `tests/e2e/seo-infra.spec.ts`
- Modify: `astro.config.mjs` (sitemap + redirects), `src/layouts/BaseLayout.astro` (og padrão via `ogPathFor`, Analytics, GSC meta), todas as páginas passam `ogImage` implicitamente via `BaseLayout` (calcula a partir de `pathname`)

**Interfaces:**
- Produces:
  - `ogPathFor(pathname: string): string` → `'/' → '/og/index.png'`, `'/en/' → '/og/en/index.png'`, `'/servicos/x/' → '/og/servicos/x.png'`.
  - `listOgPages(): Promise<{ slug: string; title: string; lang: Locale }[]>` enumera todas as páginas indexáveis (fixas + coleções visíveis) e inclui `default`.
  - `redirects: Record<string, string>`, exatamente a tabela de §3.4.
  - `Analytics` renderiza `<script data-goatcounter="https://${code}.goatcounter.com/count" async src="https://gc.zgo.at/count.js">` somente se `site.integrations.goatcounter` estiver preenchido. O meta `google-site-verification` aparece somente se `site.integrations.googleSiteVerification` estiver preenchido.
  - Imagem OG 1200×630: fundo `#0F2340` com `NetworkPattern` sutil, `logo-mark` à esquerda, título em Manrope 800 branco (fonte WOFF de `@fontsource/manrope/files/manrope-latin-800-normal.woff`) e rodapé com o domínio (`new URL(site.url).host`).

- [ ] **Step 1: Escrever os testes que falham**:

```ts
expect(ogPathFor('/')).toBe('/og/index.png');
expect(ogPathFor('/en/')).toBe('/og/en/index.png');
expect(ogPathFor('/servicos/pesquisa-quantitativa/')).toBe('/og/servicos/pesquisa-quantitativa.png');
expect(redirects['/p/python-r/']).toBe('/servicos/pesquisa-quantitativa/');
expect(redirects['/en/p/academic-website/']).toBe('/en/services/academic-websites/');
expect(Object.keys(redirects)).toHaveLength(13);   // §3.4: 12 linhas, /categories/ e /tags/ separados
for (const to of Object.values(redirects)) expect(to).toMatch(/\/$/);
```

  E2E:
  - `/og/servicos/pesquisa-quantitativa.png` responde 200 `image/png`;
  - `meta[property="og:image"]` da página aponta para ele (absoluto);
  - `/robots.txt` contém `Sitemap: ${site.url}/sitemap-index.xml`;
  - `/sitemap-index.xml` existe; o sitemap contém `/servicos/pesquisa-quantitativa/` e `/en/services/quantitative-research/` e **não** contém `obrigado`, `thank-you`, `404` nem `/p/`;
  - cada URL antiga de §3.4 carrega uma página cujo `link[rel=canonical]` é o destino e, após o refresh, `page.url()` termina no destino;
  - uma URL inexistente mostra o 404 bilíngue com links para `/` e `/en/`;
  - sem chaves configuradas, nenhuma requisição a `gc.zgo.at`.
- [ ] **Step 2: Rodar.** Esperado: FAIL.
- [ ] **Step 3: Implementar.** `@astrojs/sitemap` com `filter` excluindo thank-you, 404 e origens de redirect. Nota: como os slugs são traduzidos, o `i18n` da integração não consegue parear as URLs. As alternâncias de idioma ficam no `hreflang` do HTML, que o Google aceita como equivalente. Atualize a frase correspondente em §5.1 da spec. Passe `redirects` em `astro.config.mjs`.
- [ ] **Step 4: Rodar.** `npm test` e `npm run test:e2e -- seo-infra` → PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat(seo): add OG images, sitemap, robots, redirects, 404, and analytics hooks"`.

---

### Task 15: CI/CD, Lighthouse e verificação de links

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `lighthouserc.json`
- Delete: `.github/workflows/update-theme.yml` e o workflow Hugo existente (`ls .github/workflows` para o nome exato)
- Modify: `package.json` (script `links`: `linkinator dist --recurse --skip "^(?!http://localhost)" --silent`, ajustado para checar só links internos)

**Interfaces:**
- `ci.yml` (em `pull_request` e `push` para `redesign-astro`): Node 24 (`actions/setup-node`, cache npm) → `npm ci` → `npm run check` → `npm run lint` → `npm test` → `npm run build:preview` → `npm run links` → `npx playwright install --with-deps chromium` → `npm run test:e2e` → `npm run lhci`.
- `deploy.yml` (em `push` para `master` + `workflow_dispatch`): `withastro/action` (versão estável atual, `node-version: 24`; o build roda `npm run build`, que inclui a checagem de equipe publicada) → `actions/deploy-pages`. Permissões `pages: write`, `id-token: write`; concorrência `pages`.
- `lighthouserc.json`: `staticDistDir: ./dist`, URLs `/`, `/servicos/pesquisa-quantitativa/`, `/contato/` e `/en/`, `numberOfRuns: 1`, assertivas `categories:performance|accessibility|best-practices|seo` `minScore 0.95` (error).

- [ ] **Step 1: Rodar o check de links localmente.** `npm run build:preview && npm run links`. Esperado: 0 links quebrados (**Review Focus 5**). Corrija o que aparecer.
- [ ] **Step 2: Rodar o Lighthouse localmente.** `npm run lhci`. Esperado: as quatro categorias ≥ 0.95 nas 4 URLs. Se alguma falhar, corrija a causa (imagem sem dimensão, contraste, ordem de títulos, JS não deferido) antes de seguir.
- [ ] **Step 3: Criar os workflows** e remover os do Hugo.
- [ ] **Step 4: Verificar a sintaxe.** `npx --yes action-validator .github/workflows/ci.yml .github/workflows/deploy.yml` (fora do sandbox), ou `actionlint` se disponível. Esperado: sem erros.
- [ ] **Step 5: Commit e push da branch.** `git commit -m "ci: add CI checks, Lighthouse budget, and Astro Pages deploy"` e `git push -u origin redesign-astro` (fora do sandbox). Confira no GitHub que o `ci.yml` passou.

---

### Task 16: Limpeza do Hugo, devcontainer e README

**Files:**
- Delete: `config/`, `content/`, `i18n/`, `assets/`, `bin/`, `go.mod`, `go.sum`
- Modify: `.devcontainer/devcontainer.json`, `.devcontainer/Dockerfile` (ou remover o Dockerfile e usar a imagem `mcr.microsoft.com/devcontainers/javascript-node:24`), `.vscode/` (`extensions.json` com `astro-build.astro-vscode`, `bradlc.vscode-tailwindcss`, `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`; remover `tasks.json` do Hugo), `README.md`, `.gitignore` (remover entradas do Hugo), `.prettierignore` (remover `content/` e `config/`)

- [ ] **Step 1: Confirmar que nada mais referencia os arquivos do Hugo.** `grep -rn "content/post\|assets/img\|hugo" --include=*.{ts,astro,mjs,json,yml,md} . | grep -v node_modules | grep -v docs/superpowers`. Esperado: nenhuma ocorrência fora do README antigo.
- [ ] **Step 2: Remover os arquivos** listados e atualizar devcontainer, `.vscode`, `.gitignore` e `.prettierignore`.
- [ ] **Step 3: Reescrever `README.md`** em português, cobrindo cada item de §9, com as receitas (adicionar serviço, público, caso, artigo e membro; rascunho; imagem com `alt`; trocar domínio; preencher chaves; testes e CI; regras de tom e "nada inventado").
- [ ] **Step 4: Verificação completa.** `npm ci && npm run check && npm run lint && npm test && npm run build:preview && npm run links && npm run test:e2e`. Tudo deve passar. Depois rode `npm run build`: o resultado esperado é falhar **apenas** com a mensagem de equipe sem membro publicado (§5.5), comportamento intencional até você fornecer os dados.
- [ ] **Step 5: Commit e push.** `git commit -m "chore: remove Hugo, update devcontainer, and rewrite README"` e `git push`.

---

## Pendências para o merge em `master` (fora deste plano, dependem do usuário)

Dados da equipe (tira o perfil exemplo de `draft`; artigos recebem autor real e saem de `draft`), chave do Web3Forms, código do GoatCounter, verificação do Search Console, revisão de textos e confirmação do nome do cliente no caso Power BI. Depois disso: `npm run build` passa, abrir PR `redesign-astro → master` e, após o merge, configurar o GitHub Pages para "GitHub Actions" como fonte.
