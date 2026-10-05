import type { Locale } from './routes';

export interface ToolItem {
  name: string;
  icon?: string;
}

export interface ToolArea {
  key: 'quant' | 'qual' | 'viz' | 'web';
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  tools: ToolItem[];
}

export const toolAreas: ToolArea[] = [
  {
    key: 'quant',
    label: {
      pt: 'Pesquisa Quantitativa & Estatística',
      en: 'Quantitative Research & Statistics'
    },
    description: {
      pt: 'Modelagem estatística, testes de hipóteses, econometria e manipulação de grandes bases de dados.',
      en: 'Statistical modeling, hypothesis testing, econometrics, and large-scale data manipulation.'
    },
    tools: [
      { name: 'R', icon: 'simple-icons:r' },
      { name: 'Python', icon: 'simple-icons:python' },
      { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
      { name: 'SQLite', icon: 'simple-icons:sqlite' },
      { name: 'MySQL', icon: 'simple-icons:mysql' },
      { name: 'Stata' },
      { name: 'SPSS' },
      { name: 'Jamovi' }
    ]
  },
  {
    key: 'qual',
    label: {
      pt: 'Pesquisa Qualitativa & CAQDAS',
      en: 'Qualitative Research & CAQDAS'
    },
    description: {
      pt: 'Análise de conteúdo, análise de discurso, codificação temática e métodos mistos com apoio computacional.',
      en: 'Content analysis, discourse analysis, thematic coding, and computer-assisted mixed methods.'
    },
    tools: [
      { name: 'NVivo' },
      { name: 'ATLAS.ti' },
      { name: 'MAXQDA' },
      { name: 'QCAmap' },
      { name: 'Iramuteq' },
      { name: 'Gephi' }
    ]
  },
  {
    key: 'viz',
    label: {
      pt: 'Visualização de Dados & BI',
      en: 'Data Visualization & BI'
    },
    description: {
      pt: 'Dashboards interativos, observatórios públicos e relatórios executivos para comunicação clara de evidências.',
      en: 'Interactive dashboards, public observatories, and executive reporting for clear evidence communication.'
    },
    tools: [
      { name: 'Power BI', icon: 'simple-icons:powerbi' },
      { name: 'Tableau', icon: 'simple-icons:tableau' },
      { name: 'Looker Studio', icon: 'simple-icons:looker' },
      { name: 'D3.js', icon: 'simple-icons:d3' },
      { name: 'RAWGraphs' },
      { name: 'Datawrapper' }
    ]
  },
  {
    key: 'web',
    label: {
      pt: 'Desenvolvimento Web & Editorial',
      en: 'Web Development & Publishing'
    },
    description: {
      pt: 'Portais acadêmicos estáticos de alta performance e editoração eletrônica de publicações científicas.',
      en: 'High-performance static academic portals and electronic publishing of scientific works.'
    },
    tools: [
      { name: 'Astro', icon: 'simple-icons:astro' },
      { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
      { name: 'React', icon: 'simple-icons:react' },
      { name: 'JavaScript', icon: 'simple-icons:javascript' },
      { name: 'HTML5', icon: 'simple-icons:html5' },
      { name: 'CSS3', icon: 'simple-icons:css3' },
      { name: '.NET', icon: 'simple-icons:dotnet' },
      { name: 'LaTeX', icon: 'simple-icons:latex' },
      { name: 'Markdown', icon: 'simple-icons:markdown' }
    ]
  }
];
