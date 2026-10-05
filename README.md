# Universitas — Consultoria em Pesquisa Empírica

Site institucional e plataforma bilíngue (Português / Inglês) da **Universitas**, consultoria especializada em pesquisa empírica, quantitativa e qualitativa, atendendo Academia, Empresas, Setor Público e Terceiro Setor (ONGs).

Construído com **Astro 7**, **Tailwind CSS v4**, **TypeScript estrito**, geração estática (`output: 'static'`) e hospedado no **GitHub Pages**.

---

## 1. Requisitos e Como Rodar Localmente

- **Node.js**: versão `>=22.12.0` (recomendado **Node 24 LTS** via `.nvmrc`).
- **npm**: versão `>=10`.

### Instalação e Desenvolvimento

```bash
# Ativar Node 24 (se estiver usando nvm)
nvm use 24

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (com suporte a rascunhos em tempo real)
npm run dev
```

O site estará acessível em `http://localhost:4321`.

### Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor local de desenvolvimento (exibe rascunhos com selo visual) |
| `npm run build` | Compila o site para produção (valida integridade e exige equipe publicada) |
| `npm run build:preview` | Compila o site permitindo rascunhos (usado para testes E2E locais e no CI) |
| `npm run preview` | Serve o diretório `dist/` gerado pelo build localmente |
| `npm run check` | Executa o `astro check` para validação de tipos TypeScript e schemas |
| `npm run lint` | Executa ESLint e verifica formatação Prettier |
| `npm run format` | Corrige a formatação automaticamente com Prettier |
| `npm test` | Executa a suíte de testes unitários com Vitest |
| `npm run test:e2e` | Executa a suíte de testes ponta a ponta com Playwright e axe-core |
| `npm run links` | Valida integridade de todos os links internos no `dist/` com linkinator |
| `npm run lhci` | Executa auditoria Lighthouse CI (Performance, Acessibilidade, Boas Práticas, SEO) |
| `npm run icons` | Regenera favicons e manifest a partir de `src/assets/brand/logo-mark.svg` |

---

## 2. Estrutura do Projeto

```text
├── .github/workflows/         # Pipelines de CI e Deploy automático para GitHub Pages
├── .devcontainer/             # Ambiente de desenvolvimento em contêiner (Node 24)
├── public/                    # Arquivos estáticos servidos diretamente na raiz (favicons, manifest)
├── scripts/                   # Scripts de manutenção (check-content.ts, generate-icons.ts)
├── site.config.ts             # Fonte ÚNICA de domínio, contatos, redes sociais e chaves de API
├── src/
│   ├── assets/                # Logos SVG e imagens dos casos de estudo
│   ├── components/            # Componentes reutilizáveis (layout, ui, sections, forms, seo)
│   ├── content/               # Content Collections (Markdown/MDX/YAML):
│   │   ├── services/          # Serviços nos idiomas pt/ e en/
│   │   ├── audiences/         # Públicos-alvo nos idiomas pt/ e en/
│   │   ├── cases/             # Casos de estudo nos idiomas pt/ e en/
│   │   ├── insights/          # Artigos técnicos em MDX nos idiomas pt/ e en/
│   │   └── team/              # Membros da equipe em arquivos YAML bilíngues
│   ├── content.config.ts      # Schemas Zod de todas as coleções
│   ├── i18n/                  # Rotas (routes.ts), textos de interface (ui.ts) e redirects
│   ├── layouts/               # BaseLayout, PageLayout e ArticleLayout
│   ├── lib/                   # Helpers puros (content, seo, og, reading-time, content-integrity)
│   ├── pages/                 # Rotas estáticas (pt na raiz, en em /en/, og/, 404.astro, robots.txt.ts)
│   ├── styles/global.css      # Design tokens Tailwind v4 e tipografia Manrope/Inter
│   └── views/                 # Views completas compartilhadas entre idiomas
└── tests/
    ├── unit/                  # Testes unitários Vitest (i18n, SEO, JSON-LD, integridade)
    └── e2e/                   # Testes Playwright (SEO, navegação, acessibilidade axe, formulário)
```

---

## 3. Receitas Passo a Passo

### 3.1 Adicionar ou Editar um Serviço

1. Crie o arquivo em português em `src/content/services/pt/<slug-pt>.md`.
2. Crie a versão em inglês em `src/content/services/en/<slug-en>.md`.
3. Garanta que ambos compartilhem exatamente a mesma `translationKey`.
4. Preencha os campos obrigatórios no frontmatter:
   - `title`: Nome do serviço.
   - `description`: Resumo conciso de até 155 caracteres para SEO.
   - `translationKey`: Identificador comum entre os idiomas.
   - `tier`: `'core'` (serviço principal) ou `'complementary'` (complementar).
   - `order`: Número para ordenação na listagem.
   - `icon`: Nome do ícone Lucide (ex.: `'lucide:bar-chart-3'`).
   - `summary`: Resumo expandido de 1 parágrafo.
   - `audiences`: Lista de `translationKey`s dos públicos atendidos.
   - `tools`: Lista de softwares/ferramentas utilizadas (ex.: `['R', 'Python']`).
   - `deliverables`: Lista de produtos entregues (relatório, scripts, base tratada).
   - `faq`: Lista com perguntas e respostas (`q` e `a`).

### 3.2 Adicionar ou Editar um Público ("Para quem")

1. Crie `src/content/audiences/pt/<slug-pt>.md` e `src/content/audiences/en/<slug-en>.md`.
2. Configure a mesma `translationKey` em ambos.
3. Defina `painPoints` (desafios enfrentados pelo público), `services` recomendados e `faq`.

### 3.3 Adicionar ou Editar um Caso de Estudo

1. Crie uma pasta para imagens em `src/assets/images/cases/<slug>/` e adicione a imagem de capa e eventuais imagens da galeria.
2. Crie `src/content/cases/pt/<slug-pt>.md` e `src/content/cases/en/<slug-en>.md`.
3. Ambos devem possuir:
   - `translationKey`: chave comum.
   - `sector`: `'academia'`, `'business'`, `'public'` ou `'ngo'`.
   - `cover`: `{ src: '../../assets/images/cases/...', alt: 'Descrição acessível da imagem' }`.
   - `tools`: Ferramentas aplicadas no projeto.
   - `featured`: `true` se deve aparecer na página inicial.
   - `date`: Data do projeto no formato `YYYY-MM-DD`.

### 3.4 Adicionar um Artigo nos Insights

1. Crie `src/content/insights/pt/<slug-pt>.mdx` e `src/content/insights/en/<slug-en>.mdx`.
2. Formato MDX permite componentes interativos como `<Callout>` e `<Figure>`.
3. No frontmatter, informe `pubDate`, `author` (referência ao arquivo do autor em `team/`) e `description`.

### 3.5 Adicionar um Membro da Equipe

1. Adicione a foto em `src/assets/images/team/<slug>.jpg`.
2. Crie o arquivo `src/content/team/<slug>.yaml`. Os dados são bilíngues no mesmo arquivo:
   ```yaml
   name: "Nome Completo"
   role:
     pt: "Coordenação de Pesquisa Quantitativa"
     en: "Lead Quantitative Researcher"
   education:
     pt: "Doutorado em Ciência Política (Unicamp)"
     en: "Ph.D. in Political Science (Unicamp)"
   areas:
     pt: ["Análise de Sobrevivência", "Ciência Política", "Estatística"]
     en: ["Survival Analysis", "Political Science", "Statistics"]
   avatar: "../../assets/images/team/<slug>.jpg"
   bio:
     pt: "Trajetória acadêmica e profissional detalhada..."
     en: "Professional background and experience..."
   links:
     lattes: "http://lattes.cnpq.br/..."
     orcid: "https://orcid.org/..."
     linkedin: "https://www.linkedin.com/in/..."
   order: 1
   draft: false
   ```
3. O membro da equipe ganha automaticamente um card no grid de Sobre e uma **página de perfil dedicada** em `/sobre/<slug>/` e `/en/about/<slug>/`.

### 3.6 Marcar como Rascunho (`draft: true`)

Qualquer item em serviços, públicos, casos, insights ou equipe pode conter `draft: true` no frontmatter:
- **No servidor de desenvolvimento (`npm run dev`)**: o item aparece normalmente com o selo visual de **RASCUNHO**.
- **No build de produção (`npm run build`)**: o item é totalmente omitido.
- **Regra anti-conteúdo fictício**: O build de produção falha de propósito caso não haja nenhum membro real publicado na equipe (`draft: false`), garantindo que o site nunca seja publicado com perfis inventados.

### 3.7 Imagens e Acessibilidade (`alt` obrigatório)

Toda imagem inserida no projeto deve conter descrição alternativa (`alt`) textual significativa:
- Nunca use `alt=""` nem descrições genéricas como "imagem" ou "foto".
- O linter e os testes automatizados do Playwright barram commits com imagens sem acessibilidade.

---

## 4. Domínio, GitHub Pages e Integrações

### Troca de Domínio

O domínio do site é configurado em um **único lugar**: `site.config.ts`.

Para trocar de domínio:
1. Abra `site.config.ts` e altere a propriedade `url`:
   ```ts
   url: 'https://seunovodominio.com.br',
   ```
2. Adicione o arquivo `public/CNAME` contendo apenas o nome do domínio (ex.: `seunovodominio.com.br`).
3. Nas configurações do repositório no GitHub (`Settings > Pages`), informe o domínio customizado.
4. Todos os links canônicos, Open Graph, sitemaps, RSS e robots.txt passam a usar o novo domínio automaticamente.

### Chaves de Integração

Todas as integrações externas são gerenciadas em `site.config.ts`:

- **Formulário de Proposta (Web3Forms)**:
  - Crie uma chave de acesso gratuita em [web3forms.com](https://web3forms.com).
  - Defina a variável de ambiente `PUBLIC_WEB3FORMS_KEY` no seu ambiente local (ou configure como segredo do repositório no GitHub Actions).
  - Sem a chave, o formulário oculta os campos de envio e exibe canais diretos de contato (WhatsApp e e-mail).
- **GoatCounter (Analytics sem cookies / LGPD)**:
  - Defina o código da sua conta em `site.config.ts` no campo `integrations.goatcounter` (ex.: `'universitas'`).
  - Enquanto vazio, nenhum script de rastreamento é carregado.
- **Google Search Console**:
  - Defina o código de verificação em `site.config.ts` no campo `integrations.googleSiteVerification`.
  - A tag `<meta name="google-site-verification" ... />` é injetada automaticamente.

---

## 5. Testes e CI/CD

O repositório conta com integração contínua rigorosa configurada em `.github/workflows/ci.yml`:

1. **Tipos e Schemas**: `npm run check` valida todos os arquivos `.astro` e `.ts`.
2. **Qualidade e Estilo**: `npm run lint` executa ESLint e Prettier.
3. **Testes Unitários**: `npm test` valida rotas de i18n, geração de metatags, esquemas JSON-LD (Schema.org), cálculo de tempo de leitura e funções de integridade.
4. **Verificação de Links**: `npm run links` garante que nenhum link interno ou imagem no `dist/` retorne erro 404.
5. **Testes E2E e Acessibilidade**: `npm run test:e2e` executa a suíte Playwright cobrindo Desktop e Mobile com verificação de contraste e regras WCAG 2.2 AA via `@axe-core/playwright`.
6. **Auditoria de Performance**: `npm run lhci` exige nota mínima de **0.95** (95%) em Performance, Acessibilidade, Boas Práticas e SEO.

### Deploy Automático

Ao mesclar alterações na branch `master`, o workflow `.github/workflows/deploy.yml` compila e publica a nova versão estática diretamente no GitHub Pages através do `actions/deploy-pages`.

---

## 6. Diretrizes Editoriais e de Conteúdo

1. **Rigor e Transparência**: A Universitas posiciona-se como consultoria de pesquisa baseada em evidências. A comunicação deve ser técnica, direta, acolhedora e precisa, evitando jargões vazios de marketing.
2. **Regra Anti-Invenção**: Nunca invente dados empíricos, depoimentos de clientes, estatísticas ou credenciais de membros da equipe. Se uma informação não puder ser confirmada documentalmente, ela não deve constar no site.
3. **Paridade Bilíngue**: Todo conteúdo publicado em Português deve possuir seu respectivo par traduzido em Inglês com adaptação natural de termos acadêmicos e metodológicos internacionais.
4. **Conformidade à LGPD**: Tratamento de dados no formulário requer consentimento explícito e respeita rigorosamente a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).

---

## Licença

Este projeto é protegido sob os termos da licença [MIT](LICENSE).
