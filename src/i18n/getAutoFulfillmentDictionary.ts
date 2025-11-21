import type { Locale } from './config';

export async function getAutoFulfillmentDictionary(locale: Locale) {
  const dict = await import(`./locales/${locale}/app.autoFulfillment.json`);
  return dict.default || dict;
}
