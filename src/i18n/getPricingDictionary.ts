import type { Locale } from './config';

export async function getPricingDictionary(locale: Locale) {
  const dict = await import(`./locales/${locale}/app.pricing.json`);
  return dict.default;
}
