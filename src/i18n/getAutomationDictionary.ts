import type { Locale } from './config';

export async function getAutomationDictionary(locale: Locale) {
  const dict = await import(`./locales/${locale}/app.automation.json`);
  return dict.default;
}
