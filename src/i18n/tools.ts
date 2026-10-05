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
      pt: 'Pesquisa quantitativa e estatística',
      en: 'Quantitative research and statistics'
    },
    description: {
      pt: 'Modelagem estatística, testes de hipóteses, econometria e manipulação de bases de dados.',
      en: 'Statistical modeling, hypothesis testing, econometrics, and data manipulation.'
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
      pt: 'Pesquisa qualitativa e CAQDAS',
      en: 'Qualitative research and CAQDAS'
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
      pt: 'Visualização de dados e BI',
      en: 'Data visualization and BI'
    },
    description: {
      pt: 'Dashboards interativos, observatórios públicos e relatórios para acompanhamento de indicadores.',
      en: 'Interactive dashboards, public observatories, and reports for tracking indicators.'
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
      pt: 'Desenvolvimento web e editorial',
      en: 'Web development and publishing'
    },
    description: {
      pt: 'Desenvolvimento de websites, portais institucionais e editoração eletrônica de publicações.',
      en: 'Web development, institutional portals, and desktop publishing.'
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
