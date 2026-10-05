export const site = {
  url: 'https://universitas-io.github.io',
  name: 'Universitas',
  defaultLocale: 'pt',
  locales: {
    pt: 'pt-BR',
    en: 'en'
  },
  contact: {
    email: 'geraldohomero+universitas@pm.me',
    whatsapp: '551992400792'
  },
  social: {
    instagram: 'https://instagram.com/universitas.solutions',
    linkedin: 'https://www.linkedin.com/company/universitas-solutions'
  },
  integrations: {
    web3formsKey:
      (typeof process !== 'undefined' && process.env?.PUBLIC_WEB3FORMS_KEY) ||
      '',
    goatcounter: '', // ex.: 'universitas' → universitas.goatcounter.com
    googleSiteVerification: ''
  }
} as const;
