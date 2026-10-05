export const site = {
  url: 'https://universitas-io.github.io',
  name: 'Universitas',
  defaultLocale: 'pt',
  locales: {
    pt: 'pt-BR',
    en: 'en'
  },
  contact: {
    email: 'universitas.contato@gmail.com',
    whatsapp: '551992400792'
  },
  social: {
    instagram: 'https://instagram.com/universitas.solutions',
    linkedin: 'https://www.linkedin.com/company/universitas-solutions'
  },
  integrations: {
    web3formsKey:
      (typeof process !== 'undefined' && process.env?.PUBLIC_WEB3FORMS_KEY) ||
      '567423c7-5968-446e-97ae-1bedb1bcd23c',
    goatcounter: 'universitas', // universitas.goatcounter.com
    googleSiteVerification: 'l808iPj8b6t7l1FTAOWraoR81RDT-eGH2EBxTTfSfTs'
  }
} as const;
