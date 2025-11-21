import type { Locale } from './config';

export async function getAnalyticsDictionary(locale: Locale) {
  const dict = await import(`./locales/${locale}/app.analytics.json`);
  return dict.default;
}
