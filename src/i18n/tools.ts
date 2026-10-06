import type { Locale } from './routes';

export interface ToolItem {
  name: string;
  icon?: string;
}

export interface ToolArea {
  key: 'quant' | 'qual' | 'scraping' | 'viz' | 'web' | 'publishing';
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
    key: 'scraping',
    label: {
      pt: 'Coleta de dados e web scraping',
      en: 'Data collection and web scraping'
    },
    description: {
      pt: 'Extração automatizada de dados em websites, raspagem estruturada, consumo de APIs e processamento de fluxos web.',
      en: 'Automated web data extraction, structured scraping, API integration, and web stream processing.'
    },
    tools: [
      { name: 'Python', icon: 'simple-icons:python' },
      { name: 'Scrapy', icon: 'simple-icons:scrapy' },
      { name: 'Playwright', icon: 'simple-icons:playwright' },
      { name: 'Selenium', icon: 'simple-icons:selenium' },
      { name: 'Puppeteer', icon: 'simple-icons:puppeteer' },
      { name: 'R', icon: 'simple-icons:r' },
      { name: 'Beautiful Soup' }
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
      pt: 'Desenvolvimento web',
      en: 'Web development'
    },
    description: {
      pt: 'Aplicações web completas, sites responsivos, plataformas de software sob medida e sistemas de gerenciamento de conteúdo.',
      en: 'Full-stack web applications, responsive websites, bespoke platforms, and content management systems.'
    },
    tools: [
      { name: 'C#', icon: 'simple-icons:csharp' },
      { name: '.NET', icon: 'simple-icons:dotnet' },
      { name: 'Rust', icon: 'simple-icons:rust' },
      { name: 'Python', icon: 'simple-icons:python' },
      { name: 'WordPress', icon: 'simple-icons:wordpress' },
      { name: 'Wix', icon: 'simple-icons:wix' },
      { name: 'Astro', icon: 'simple-icons:astro' },
      { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
      { name: 'React', icon: 'simple-icons:react' },
      { name: 'JavaScript', icon: 'simple-icons:javascript' },
      { name: 'HTML5', icon: 'simple-icons:html5' },
      { name: 'CSS3', icon: 'simple-icons:css3' }
    ]
  },
  {
    key: 'publishing',
    label: {
      pt: 'Editoração e publicação',
      en: 'Document layout and publishing'
    },
    description: {
      pt: 'Diagramação acadêmica e institucional, padronização editorial, anais eletrônicos e relatórios técnicos.',
      en: 'Academic and institutional document layout, editorial standardization, conference proceedings, and technical reports.'
    },
    tools: [
      { name: 'LaTeX', icon: 'simple-icons:latex' },
      { name: 'Markdown', icon: 'simple-icons:markdown' },
      { name: 'Typst' },
      { name: 'Pandoc' },
      { name: 'Quarto' }
    ]
  }
];
