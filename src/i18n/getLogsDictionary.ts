import type { Locale } from './config';

export async function getLogsDictionary(locale: Locale) {
  const dict = await import(`./locales/${locale}/app.logs.json`);
  return dict.default;
}
