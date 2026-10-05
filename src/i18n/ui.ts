import type { Locale } from './routes';

export const ui = {
  pt: {
    'nav.services': 'Serviços',
    'nav.audiences': 'Para quem',
    'nav.cases': 'Casos',
    'nav.insights': 'Insights',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'cta.proposal': 'Solicitar proposta',
    'cta.services': 'Ver serviços',
    'cta.whatsapp': 'Falar no WhatsApp',
    'cta.more': 'Saiba mais',
    skip: 'Pular para o conteúdo',
    'theme.toggle': 'Alternar tema claro/escuro',
    'lang.switch': 'English',
    'footer.invoice': 'Emitimos nota fiscal para pessoas físicas e jurídicas.',
    'footer.rights': 'Todos os direitos reservados.',
    'breadcrumb.home': 'Início',
    'draft.badge': 'RASCUNHO',
    'section.cases': 'Casos relacionados',
    'section.faq': 'Perguntas frequentes',
    'nav.main': 'Navegação principal',
    'nav.menu': 'Abrir menu',
    'nav.close': 'Fechar menu',
    'nav.breadcrumbs': 'Navegação estrutural',
    'footer.privacy': 'Privacidade',
    'footer.tagline': 'Pesquisa quantitativa e qualitativa com rigor metodológico, ética e transparência.',
  },
  en: {
    'nav.services': 'Services',
    'nav.audiences': 'For whom',
    'nav.cases': 'Cases',
    'nav.insights': 'Insights',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'cta.proposal': 'Request a proposal',
    'cta.services': 'View services',
    'cta.whatsapp': 'Chat on WhatsApp',
    'cta.more': 'Learn more',
    skip: 'Skip to content',
    'theme.toggle': 'Toggle light/dark theme',
    'lang.switch': 'Português',
    'footer.invoice': 'We issue official tax invoices for individuals and organizations.',
    'footer.rights': 'All rights reserved.',
    'breadcrumb.home': 'Home',
    'draft.badge': 'DRAFT',
    'section.cases': 'Related cases',
    'section.faq': 'Frequently asked questions',
    'nav.main': 'Main navigation',
    'nav.menu': 'Open menu',
    'nav.close': 'Close menu',
    'nav.breadcrumbs': 'Breadcrumbs',
    'footer.privacy': 'Privacy',
    'footer.tagline': 'Quantitative and qualitative research grounded in rigor, ethics, and transparency.',
  },
} as const;

export type UiKey = keyof (typeof ui)['pt'];

export function t(lang: Locale, key: UiKey): string {
  return ui[lang][key] || ui.pt[key] || key;
}
