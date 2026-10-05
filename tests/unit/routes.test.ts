import { test, expect } from 'vitest';
import { path, staticAlternate, langFromPath } from '../../src/i18n/routes';

test('path helper generates localized paths with trailing slashes', () => {
  expect(path('pt', 'home')).toBe('/');
  expect(path('en', 'home')).toBe('/en/');
  expect(path('pt', 'services', 'pesquisa-quantitativa')).toBe(
    '/servicos/pesquisa-quantitativa/'
  );
  expect(path('en', 'audiences', 'public-sector')).toBe(
    '/en/for/public-sector/'
  );
  expect(path('en', 'thanks')).toBe('/en/contact/thank-you/');
  expect(path('pt', 'privacy')).toBe('/privacidade/');
});

test('staticAlternate maps static routes across locales', () => {
  expect(staticAlternate('/sobre/', 'en')).toBe('/en/about/');
  expect(staticAlternate('/en/privacy/', 'pt')).toBe('/privacidade/');
  expect(staticAlternate('/', 'en')).toBe('/en/');
  expect(staticAlternate('/en/', 'pt')).toBe('/');
  expect(staticAlternate('/contato/obrigado/', 'en')).toBe(
    '/en/contact/thank-you/'
  );
  expect(staticAlternate('/servicos/', 'en')).toBe('/en/services/');
  expect(staticAlternate('/servicos/pesquisa-quantitativa/', 'en')).toBeNull();
});

test('langFromPath extracts locale from pathname', () => {
  expect(langFromPath('/en/cases/')).toBe('en');
  expect(langFromPath('/casos/')).toBe('pt');
  expect(langFromPath('/en')).toBe('en');
});
