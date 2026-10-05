# Redesign do site Universitas — Astro (design spec)

- **Data:** 2026-10-05
- **Status:** aguardando revisão
- **Branch:** `redesign-astro`
- **Substitui:** site atual em Hugo + tema Stack

---

## 1. Objetivo e contexto

### 1.1 Objetivo

Refazer completamente o site da Universitas, abandonando o Hugo, numa stack moderna e de fácil manutenção. O site deve transmitir **profissionalismo, modernidade, inovação, respeito e ética** e seguir as melhores práticas atuais de SEO, acessibilidade e performance.

### 1.2 Reposicionamento

| Antes | Depois |
|---|---|
| "Serviços acadêmicos e de pesquisa quantitativa para as Humanidades" | **Consultoria em pesquisa quantitativa e qualitativa** para **academia**, **empresas** e **setor público** (governo, terceiro setor) |
| Catálogo de serviços apresentado como posts de blog | Site institucional de consultoria, com serviços, públicos, casos, equipe e artigos |
| Contato só por WhatsApp | **Formulário de proposta** como CTA principal + WhatsApp + e-mail |

Pesquisa é o carro-chefe. Dashboards, sites acadêmicos e diagramação/formatação continuam como **serviços complementares**.

### 1.3 Critérios de sucesso

1. Lighthouse ≥ 95 em Performance, Acessibilidade, Boas Práticas e SEO nas páginas principais (mobile).
2. Zero violações axe (WCAG 2.2 AA) nos testes automatizados.
3. Todas as páginas com title, description, canonical, hreflang, Open Graph e JSON-LD válidos.
4. Todas as URLs antigas do Hugo redirecionam para uma página nova equivalente.
5. Para adicionar um serviço, artigo, caso ou membro da equipe, basta criar **um arquivo Markdown/YAML**, sem tocar em código.
6. Para trocar o domínio, basta editar **um arquivo** (`site.config.ts`) e adicionar `public/CNAME`.
7. Nenhum conteúdo inventado (números, depoimentos, membros da equipe) chega à produção.

### 1.4 Fora do escopo (YAGNI)

Busca interna, newsletter, comentários, CMS visual, tags/categorias nos Insights, área do cliente, chat ao vivo, backend próprio. O CMS baseado em Git (Sveltia/Decap) pode ser adicionado depois sem reestruturar o projeto.

---

## 2. Decisões tomadas

| Tema | Decisão |
|---|---|
| Idiomas | Bilíngue: PT-BR na raiz (`/`), EN em `/en/`, slugs traduzidos |
| Serviços não-pesquisa | Mantidos como complementares |
| Blog | **Insights** desde o lançamento, com 2 artigos iniciais |
| Domínio | `https://universitas-io.github.io` por ora; troca futura via `site.config.ts` |
| Contato | Formulário (Web3Forms) + WhatsApp + e-mail |
| Logo | Conceito do `assets/img/logo.png` redesenhado como SVG; demais variantes descartadas |
| Prova social | Equipe **com nomes e perfis** + casos/projetos |
| Analytics | GoatCounter (sem cookies) + Google Search Console |
| Stack | Astro + TypeScript + Tailwind CSS v4 + MDX |
| Direção visual | **C · Moderno equilibrado** |

---

## 3. Mapa do site e rotas

### 3.1 Tabela de rotas

| Página | PT-BR | EN |
|---|---|---|
| Home | `/` | `/en/` |
| Serviços (índice) | `/servicos/` | `/en/services/` |
| Pesquisa Quantitativa | `/servicos/pesquisa-quantitativa/` | `/en/services/quantitative-research/` |
| Pesquisa Qualitativa | `/servicos/pesquisa-qualitativa/` | `/en/services/qualitative-research/` |
| Coleta de Dados Digitais | `/servicos/coleta-de-dados-digitais/` | `/en/services/digital-data-collection/` |
| Dashboards & Visualização | `/servicos/dashboards-e-visualizacao/` | `/en/services/dashboards-and-data-visualization/` |
| Sites Acadêmicos | `/servicos/sites-academicos/` | `/en/services/academic-websites/` |
| Diagramação & Formatação | `/servicos/diagramacao-e-formatacao/` | `/en/services/document-layout-and-formatting/` |
| Para a academia | `/para/academia/` | `/en/for/academia/` |
| Para empresas | `/para/empresas/` | `/en/for/business/` |
| Para o setor público | `/para/setor-publico/` | `/en/for/public-sector/` |
| Casos (índice) | `/casos/` | `/en/cases/` |
| Caso | `/casos/[slug]/` | `/en/cases/[slug]/` |
| Insights (índice) | `/insights/` | `/en/insights/` |
| Artigo | `/insights/[slug]/` | `/en/insights/[slug]/` |
| Sobre (missão, valores, ética, equipe, ferramentas) | `/sobre/` | `/en/about/` |
| Contato | `/contato/` | `/en/contact/` |
| Obrigado (`noindex`) | `/contato/obrigado/` | `/en/contact/thank-you/` |
| Privacidade | `/privacidade/` | `/en/privacy/` |
| 404 | `/404.html` (bilíngue) | — |

### 3.2 Conteúdo de cada página

- **Home:** hero (proposta de valor + CTA "Solicitar proposta" e "Ver serviços") → três públicos (cards para `/para/*`) → serviços principais (3) + complementares (3) → "Como trabalhamos" (Briefing → Desenho metodológico → Coleta → Análise → Entrega e acompanhamento) → casos em destaque (até 3) → compromissos éticos (LGPD, ética em pesquisa, transparência metodológica, reprodutibilidade) → últimos Insights (até 3) → CTA final.
- **Página de serviço:** o que é → para quem → como fazemos → entregáveis → ferramentas (ícones) → casos relacionados → FAQ (com `FAQPage`) → CTA.
- **Página de público:** dores típicas → serviços indicados → casos relacionados → FAQ → CTA.
- **Caso:** contexto → desafio → método → resultado → ferramentas → links externos (quando públicos) → CTA.
- **Artigo:** título, autor (link para o perfil em `/sobre/#slug`), data de publicação/atualização, tempo de leitura, sumário (para artigos longos), corpo em MDX, CTA ao final.
- **Sobre:** missão, valores e princípios éticos, equipe (foto, nome, formação, áreas, links Lattes/ORCID/LinkedIn), ferramentas por área (Pesquisa Quantitativa: R, Python, SQLite, MySQL, PostgreSQL · Pesquisa Qualitativa: NVivo, Atlas.ti, MAXQDA, QCAmap, Gephi · Visualização: Power BI, Tableau, Looker Studio · Web: HTML, CSS, JavaScript, React, Next.js, Astro, ASP.NET), com ícones SVG locais.
- **Contato:** formulário de proposta, WhatsApp, e-mail, redes, nota "Emitimos nota fiscal para pessoas físicas e jurídicas".
- **Privacidade:** política LGPD curta: quais dados o formulário coleta, finalidade, operador (Web3Forms), retenção, direitos do titular, contato do controlador; analytics sem cookies e sem dados pessoais.

### 3.3 Elementos globais

- **Cabeçalho fixo:** logo · Serviços · Para quem (dropdown) · Casos · Insights · Sobre · seletor PT/EN · botão "Solicitar proposta". No mobile, menu em gaveta acessível.
- **Barra fixa no mobile:** "Solicitar proposta" + ícone do WhatsApp.
- **Rodapé:** logo + tagline, mapa de links, contatos (WhatsApp, e-mail), redes (Instagram, LinkedIn), Privacidade, "Emitimos nota fiscal", © ano.
- **Breadcrumbs** visíveis em todas as páginas internas.
- **Seletor de idioma** leva à página equivalente no outro idioma (via `translationKey`), não à home.

### 3.4 Redirecionamentos das URLs antigas

| URL antiga | Destino |
|---|---|
| `/p/python-r/` | `/servicos/pesquisa-quantitativa/` |
| `/p/site-academico/` | `/servicos/sites-academicos/` |
| `/p/dashboard-dados/` | `/servicos/dashboards-e-visualizacao/` |
| `/p/diagramacao-formatacao/` | `/servicos/diagramacao-e-formatacao/` |
| `/archives/` | `/insights/` |
| `/categories/` e `/tags/` | `/servicos/` |
| `/pt-br/` | `/` |
| `/en/p/quantitative-research/` | `/en/services/quantitative-research/` |
| `/en/p/academic-website/` | `/en/services/academic-websites/` |
| `/en/p/dashboard-dados/` | `/en/services/dashboards-and-data-visualization/` |
| `/en/p/diagramacao-formatacao/` | `/en/services/document-layout-and-formatting/` |
| `/en/archives/` | `/en/insights/` |

`/sobre/` e `/en/about/` mantêm a mesma URL. Os redirecionamentos usam o recurso `redirects` do Astro, que gera HTML estático com `meta refresh` + `canonical`. O GitHub Pages não oferece redirect 301 de servidor.

---

## 4. Identidade visual e UX

### 4.1 Tokens de design

| Token | Valor | Uso |
|---|---|---|
| `navy-900` | `#0F2340` | Títulos, texto forte |
| `navy-700` | `#1F3A5F` | Botões primários, cabeçalho, logo |
| `blue-500` | `#2A8FC7` | Links, rótulos (eyebrows) |
| `green-600` | `#2E9E6B` | Destaques, ícones de ética |
| `brand-gradient` | `#3BA7E0 → #6CC24A` | Somente logo e detalhes pontuais |
| `surface` | `#FFFFFF` / `#F3F7FB` | Fundos alternados entre seções |
| `ink-600` | `#4B5B70` | Texto corrido |

O modo escuro tem tokens equivalentes (fundo `#0B1626`, texto `#E8EEF6`, destaques clareados). Todas as combinações texto/fundo têm contraste ≥ 4.5:1 (AA). Os tokens ficam em `src/styles/global.css` via `@theme` do Tailwind v4.

### 4.2 Tipografia

- Títulos: **Manrope Variable** (700–800, `letter-spacing` levemente negativo).
- Texto: **Inter Variable** (400–600).
- As fontes são auto-hospedadas via `@fontsource-variable/*`, com `font-display: swap` e preload da fonte do hero. Nenhuma requisição a Google Fonts.

### 4.3 Logo

O SVG é redesenhado fiel ao `assets/img/logo.png`: "U" azul-marinho e treliça de nós em gradiente azul→verde no braço esquerdo. Variantes:

1. `logo-mark.svg`: símbolo sozinho (favicon, ícones de app, avatar).
2. `logo-horizontal.svg`: símbolo + "Universitas" em Manrope.
3. `logo-horizontal-dark.svg`: versão para fundo escuro.

Gerados a partir do símbolo: `favicon.svg`, `favicon.ico` (32px), `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png`, `site.webmanifest`. As variantes PNG antigas (`logo1/2/5.png`) são descartadas.

### 4.4 Princípios de UX

- Pensado primeiro para o celular, com breakpoints do Tailwind e largura máxima de leitura de cerca de 70 caracteres nos artigos.
- A rede de nós aparece como motivo gráfico sutil (SVG inline, baixa opacidade) no hero e em fundos de seção.
- Animações mínimas: revelação suave ao rolar a página em CSS (`@starting-style`/`animation-timeline` com fallback), desativadas com `prefers-reduced-motion`.
- Modo escuro segue `prefers-color-scheme`, com botão manual que persiste em `localStorage` e script inline mínimo para evitar flash.
- Sem fotos de banco de imagens. As imagens são prints reais dos projetos, fotos da equipe e ilustrações SVG próprias.
- JavaScript só onde necessário: menu mobile, alternância de tema e envio progressivo do formulário. Nenhum framework de UI no cliente.

### 4.5 Acessibilidade (WCAG 2.2 AA)

HTML semântico com landmarks, link "pular para o conteúdo", foco visível, navegação completa por teclado (incluindo dropdown e gaveta), `aria-current` na navegação, `alt` obrigatório no schema de imagens, rótulos e mensagens de erro associados aos campos do formulário, alvos de toque ≥ 24px.

---

## 5. SEO e conteúdo

### 5.1 SEO técnico

- Um único componente `<Seo>` gera: `<title>` (50–60 caracteres, padrão `Título | Universitas`), `meta description` (≤ 155), `canonical` absoluto, `hreflang` (pt-BR, en, x-default → PT), Open Graph (`og:type`, `og:locale` + `og:locale:alternate`, `og:image` 1200×630) e Twitter Card `summary_large_image`.
- `title` e `description` são **obrigatórios** nos schemas de conteúdo e nas props das páginas.
- `@astrojs/sitemap` com `i18n` (alternates por idioma). Páginas `noindex` (obrigado, 404, redirecionamentos) ficam fora do sitemap.
- `robots.txt` gerado a partir de `site.config.ts`, apontando para o sitemap.
- Feed RSS dos Insights por idioma (`/insights/rss.xml`, `/en/insights/rss.xml`).
- Imagens Open Graph geradas no build por página (satori + sharp): fundo da marca, logo e título.
- Performance: HTML estático, CSS inline crítico pelo Astro, imagens via `astro:assets` (AVIF/WebP, `width`/`height`, `loading="lazy"` exceto no hero), JS mínimo e deferido.
- Um `h1` por página, hierarquia de títulos sem saltos.

### 5.2 Dados estruturados (JSON-LD)

| Escopo | Tipos |
|---|---|
| Todas as páginas | `Organization` (name, url, logo, sameAs, contactPoint), `WebSite` (inLanguage), `BreadcrumbList` |
| Serviço | `Service` (serviceType, provider → Organization, areaServed: BR, audience), `FAQPage` |
| Público | `WebPage` + `FAQPage` |
| Artigo | `Article` (headline, datePublished, dateModified, inLanguage, image, author → `Person` com `sameAs`) |
| Caso | `Article` (ou `CreativeWork`) com `about` |
| Sobre | `AboutPage` + `Person` por membro (jobTitle, alumniOf, sameAs Lattes/ORCID/LinkedIn) |
| Contato | `ContactPage` |

O JSON-LD é gerado por helpers tipados em `src/lib/seo/` e testado com Vitest.

### 5.3 Palavras-chave por página (direção)

| Página | PT-BR | EN |
|---|---|---|
| Home | consultoria em pesquisa; pesquisa quantitativa e qualitativa | research consultancy; quantitative and qualitative research |
| Quantitativa | consultoria estatística; análise de dados em R e Python; survey; modelagem estatística | statistical consulting; data analysis in R and Python; survey research |
| Qualitativa | análise qualitativa NVivo / Atlas.ti / MAXQDA; análise de conteúdo; entrevistas em profundidade; grupos focais | qualitative data analysis; content analysis; in-depth interviews; focus groups |
| Coleta digital | web scraping para pesquisa; coleta de dados de redes sociais; banco de dados para pesquisa | web scraping for research; social media data collection |
| Academia | consultoria estatística para tese e dissertação; análise de dados para mestrado e doutorado | thesis statistics help; dissertation data analysis |
| Empresas | pesquisa de mercado; pesquisa de satisfação; análise de dados de clientes | market research; customer satisfaction research |
| Setor público | avaliação de políticas públicas; pesquisa de opinião; diagnóstico socioeconômico | public policy evaluation; opinion research |

### 5.4 Conteúdo

- **Reescrita completa** dos textos atuais para o novo posicionamento, em tom consultivo, claro e preciso. Traduções EN revisadas e naturais.
- **Serviços:** 6 páginas (3 principais + 3 complementares), cada uma com FAQ de 3 a 5 perguntas.
- **Públicos:** 3 páginas.
- **Casos iniciais** (do conteúdo atual):
  1. Base de dados do YouTube para tese de doutorado: mais de 100 mil vídeos, 50 milhões de comentários, 49 canais, BERTopic; link para o repositório `geraldohomero/dh-youtube-database`.
  2. Análise de redes e clusterização: dashboard em Python + D3.js.
  3. Dashboard Power BI: LR Instalações Especiais.
  4. Sites acadêmicos: OEDLA, LABIIA, Seminário Discente PPGCP-Unicamp 2025, site de análise de processos seletivos.
  5. Diagramação e formatação: Dissertação de Mestrado; Anais da XXXIV Semana de História da UFJF.
- **Insights iniciais** (rascunhados por mim, revisados por você):
  1. "Pesquisa quantitativa, qualitativa ou métodos mistos: como escolher a abordagem certa"
  2. "Coleta de dados de redes sociais com ética e conformidade à LGPD"
- **Equipe:** você fornece os dados. Até lá, os perfis de exemplo usam `draft: true`.

### 5.5 Regra anti-conteúdo inventado

Todo conteúdo tem um campo `draft` (padrão `false`). Itens `draft: true` aparecem em `npm run dev` com um selo "RASCUNHO", mas **são excluídos do build de produção**. O build de produção falha se uma página obrigatória (por exemplo, a seção de equipe em `/sobre/`) ficar sem nenhum item publicado. Números, depoimentos e logos de clientes só entram se você confirmar.

---

## 6. Arquitetura técnica

### 6.1 Stack

- **Astro** (versão estável atual) com saída estática (`output: 'static'`), `trailingSlash: 'always'`.
- **TypeScript** (strict).
- **Tailwind CSS v4** via `@tailwindcss/vite` + `@tailwindcss/typography` para o corpo de artigos e casos.
- **MDX** (`@astrojs/mdx`) nos Insights, para permitir componentes como callouts e figuras.
- `@astrojs/sitemap`, `@astrojs/rss`, `astro-icon` (com `@iconify-json/lucide` e `@iconify-json/simple-icons`), `@fontsource-variable/inter`, `@fontsource-variable/manrope`, `satori` + `sharp` (imagens OG).
- **Node 24 LTS**, **npm**, versão fixada em `.nvmrc` e `engines`.

### 6.2 Estrutura de pastas

```
site.config.ts                 # domínio, nome, contatos, redes, chaves (Web3Forms, GoatCounter, GSC)
astro.config.mjs               # integrações, i18n, redirects (importa site.config)
src/
  content.config.ts            # schemas Zod de todas as coleções
  content/
    services/pt/*.md  services/en/*.md
    audiences/pt/*.md audiences/en/*.md
    cases/pt/*.md     cases/en/*.md
    insights/pt/*.mdx insights/en/*.mdx
    team/*.yaml
  i18n/
    ui.ts                      # textos de interface por idioma
    routes.ts                  # mapa de segmentos de rota PT↔EN + helpers (getLocalizedPath, getAlternate)
  lib/
    seo/                       # helpers de meta + JSON-LD
    content.ts                 # helpers de consulta (filtra draft, ordena, resolve tradução)
  components/
    layout/   Header, Footer, MobileNav, MobileCtaBar, LanguageSwitcher, ThemeToggle, Breadcrumbs, SkipLink
    seo/      Seo, JsonLd
    ui/       Button, Card, SectionHeading, Eyebrow, Icon, NetworkPattern, Logo
    sections/ Hero, AudienceGrid, ServiceGrid, Process, CaseGrid, EthicsPledges, InsightList, CtaBanner, Faq
    forms/    ContactForm
  layouts/
    BaseLayout.astro           # <html>, <head> (Seo), header, footer
    PageLayout.astro           # página com breadcrumbs + h1
    ArticleLayout.astro        # artigos e casos
  pages/
    index.astro, servicos/…, para/…, casos/…, insights/…, sobre.astro, contato/…, privacidade.astro, 404.astro
    og/[...slug].png.ts        # imagens Open Graph
    robots.txt.ts
    en/…                       # rotas EN, finas, reutilizando as mesmas views
  views/                       # a página real, por tipo, recebendo `lang` (HomeView, ServiceView, …)
  styles/global.css
  assets/brand/*.svg, assets/images/…
public/
  favicon.svg, favicon.ico, apple-touch-icon.png, icon-*.png, site.webmanifest
tests/
  unit/*.test.ts               # Vitest
  e2e/*.spec.ts                # Playwright + @axe-core/playwright
```

**Regra de organização:** os arquivos em `pages/` só resolvem rota e dados e delegam para uma `view` compartilhada. Toda a marcação fica em `views/` e `components/`, para que PT e EN nunca divirjam.

### 6.3 Schemas de conteúdo (resumo)

Campos comuns a todas as coleções traduzíveis: `title`, `description` (≤ 155), `translationKey` (string comum ao par PT/EN), `draft` (bool, padrão `false`). O idioma é derivado da pasta (`pt`/`en`) e o slug do nome do arquivo.

| Coleção | Campos específicos |
|---|---|
| `services` | `tier: 'core' \| 'complementary'`, `order`, `icon`, `summary`, `audiences[]` (referência a `audiences` por `translationKey`), `tools[]`, `deliverables[]`, `faq[{q,a}]` |
| `audiences` | `order`, `icon`, `summary`, `painPoints[]`, `services[]`, `faq[{q,a}]` |
| `cases` | `client` (opcional/anonimizado), `sector: 'academia' \| 'business' \| 'public'`, `services[]`, `tools[]`, `cover {src, alt}`, `gallery[{src, alt}]`, `links[{label,url}]`, `featured`, `date` |
| `insights` | `pubDate`, `updatedDate?`, `author` (referência a `team`), `cover? {src, alt}`, `featured` |
| `team` | `name`, `photo {src, alt}`, `role {pt, en}`, `bio {pt, en}`, `education[]`, `areas[]`, `links {lattes?, orcid?, linkedin?, website?}`, `order`, `draft` |

**Validações de build (falham o build):**

- campo obrigatório ausente;
- `description` acima de 155 caracteres;
- imagem sem `alt`;
- referência quebrada;
- `translationKey` sem par no outro idioma (exceto itens marcados `translationOptional: true`, só para Insights).

### 6.4 i18n

- Configuração `i18n` do Astro: `defaultLocale: 'pt'`, `locales: ['pt', 'en']`, `routing.prefixDefaultLocale: false`. O atributo `lang` do HTML é `pt-BR` ou `en`.
- `src/i18n/routes.ts` mapeia segmentos (`servicos`↔`services`, `para`↔`for`, `casos`↔`cases`, `sobre`↔`about`, `contato`↔`contact`, `privacidade`↔`privacy`, `obrigado`↔`thank-you`).
- O link alternativo de páginas de conteúdo vem do `translationKey`. O de páginas fixas vem do mapa de rotas.

### 6.5 Formulário de proposta

- Envio para **Web3Forms** (`https://api.web3forms.com/submit`) com `access_key` em `site.config.ts`. A chave é pública por design do serviço.
- **Campos:**
  - obrigatórios: nome, e-mail, tipo de organização (Academia / Empresa / Setor público / Terceiro setor / Outro), serviço de interesse (lista dos 6 + "Não sei ainda"), descrição do projeto, checkbox de consentimento LGPD com link para `/privacidade/`;
  - opcionais: organização, telefone/WhatsApp, prazo desejado.
- **Anti-spam:** campo honeypot `botcheck`.
- **Sem JS:** POST nativo com `redirect` para `/contato/obrigado/` (ou `/en/contact/thank-you/`).
- **Com JS:** `fetch`, estados de envio/sucesso/erro na própria página (`aria-live`), botão desabilitado durante o envio e, em caso de erro, mensagem com alternativa via WhatsApp/e-mail.
- Validação HTML nativa + mensagens localizadas.
- Se `access_key` estiver vazia, o formulário vira uma mensagem com os links de WhatsApp e e-mail, para nunca mostrar um formulário quebrado.

### 6.6 Analytics e verificação

- **GoatCounter:** script `count.js` `async`, sem cookies, só se `goatcounter` estiver definido em `site.config.ts`.
- **Google Search Console:** meta `google-site-verification` vinda de `site.config.ts`, quando definida.
- Nenhum outro script de terceiros.

### 6.7 `site.config.ts` (forma)

```ts
export const site = {
  url: 'https://universitas-io.github.io',
  name: 'Universitas',
  defaultLocale: 'pt',
  contact: {
    email: 'geraldohomero+universitas@pm.me',
    whatsapp: '551992400792',
  },
  social: {
    instagram: 'https://instagram.com/universitas.solutions',
    linkedin: 'https://www.linkedin.com/company/universitas-solutions',
  },
  integrations: {
    web3formsKey: '',          // preencher
    goatcounter: '',           // ex.: 'universitas' → universitas.goatcounter.com
    googleSiteVerification: '',
  },
} as const;
```

---

## 7. Qualidade, testes e CI/CD

### 7.1 Ferramentas

- `astro check` (tipos + schemas), ESLint (`eslint-plugin-astro`), Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`).
- **Vitest** (unit): `i18n/routes` (mapeamento de ida e volta, alternates), `lib/seo` (title, canonical, hreflang, JSON-LD por tipo), `lib/content` (filtro de `draft`, pareamento por `translationKey`).
- **Playwright** (e2e, sobre o build com `astro preview`):
  - home PT/EN renderiza, com `h1` e CTA presentes;
  - cada tipo de página tem `title`, `description`, `canonical`, `hreflang` e JSON-LD parseável;
  - o seletor de idioma leva ao equivalente correto;
  - os redirecionamentos antigos apontam para o destino certo;
  - o formulário valida campos obrigatórios (sem envio real; a rede é interceptada);
  - menu mobile e alternância de tema funcionam por teclado;
  - **axe** sem violações nas páginas principais, em claro e escuro.
- **Lighthouse CI** (`@lhci/cli`) nos PRs: assertivas ≥ 0.95 nas quatro categorias para home, um serviço, um artigo e contato.
- Verificação de links internos quebrados no build.

### 7.2 Scripts npm

`dev`, `build`, `preview`, `check`, `lint`, `format`, `test` (Vitest), `test:e2e` (Playwright), `lhci`.

### 7.3 GitHub Actions

- `ci.yml` (pull requests): install → `check` → `lint` → `test` → `build` → `test:e2e` → `lhci`.
- `deploy.yml` (push em `master`): build com `withastro/action` → `actions/deploy-pages`.
- Removido: `.github/workflows/update-theme.yml` (Hugo).
- O workflow Hugo atual é substituído pelo `deploy.yml`.

---

## 8. Migração e limpeza

1. Todo o trabalho acontece na branch `redesign-astro`. O site atual permanece no ar até o merge em `master`.
2. Conteúdo migrado e reescrito em `src/content/`. Imagens úteis movidas para `src/assets/images/` (casos) e otimizadas pelo build.
3. **Removidos:** `config/`, `content/` (após migração), `i18n/` (Hugo), `assets/` (Hugo, após mover o que for útil), `resources/`, `public/` (saída do Hugo), `go.mod`, `go.sum`, `.hugo_build.lock`, `bin/` (contém só o binário `hugo`), workflow `update-theme.yml`.
4. `.devcontainer/` atualizado para imagem Node 24. `.vscode/` com extensões recomendadas (Astro, Tailwind, ESLint, Prettier).
5. `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.superpowers/`, `playwright-report/`, `test-results/`, `.lighthouseci/`, `.DS_Store`.
6. `LICENSE` mantida.

---

## 9. Documentação de manutenção

`README.md` reescrito em português, com:

- requisitos e como rodar localmente (`npm install`, `npm run dev`);
- estrutura do projeto em uma tela;
- receitas passo a passo: adicionar/editar serviço, público, caso, artigo, membro da equipe; marcar como rascunho; adicionar imagem com `alt`;
- como trocar o domínio (`site.config.ts` + `public/CNAME` + configuração do GitHub Pages + Search Console);
- como preencher as chaves do Web3Forms, do GoatCounter e do Search Console;
- como rodar testes e o que o CI verifica;
- convenções de tom e escrita (bilíngue, sem números não verificados).

---

## 10. Pendências do usuário (não bloqueiam a implementação)

| Item | Uso |
|---|---|
| Dados da equipe (nome, foto, formação, áreas, links) | `/sobre/`, autoria dos Insights (E-E-A-T) |
| Chave do Web3Forms | Formulário |
| Código do GoatCounter | Analytics |
| Código de verificação do Search Console | SEO |
| Revisão dos textos PT/EN e dos 2 artigos | Publicação |
| Confirmação de quais casos podem citar o nome do cliente | Casos |

Enquanto a equipe não for preenchida, o build de produção falha de propósito (§5.5). Isso impede publicar o site com perfis fictícios.
