import { test, expect } from 'vitest';
import { ui, t } from '../../src/i18n/ui';
import { locales } from '../../src/i18n/routes';

test('ui dictionaries have matching keys and non-empty values', () => {
  expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.pt).sort());
  for (const l of locales) {
    for (const v of Object.values(ui[l])) {
      expect(v.trim()).not.toBe('');
    }
  }
});

test('t helper returns localized string', () => {
  expect(t('pt', 'nav.services')).toBeTruthy();
  expect(t('en', 'nav.services')).toBeTruthy();
  expect(t('pt', 'footer.invoice')).toBe(
    'Emitimos nota fiscal para pessoas físicas e jurídicas.'
  );
});
