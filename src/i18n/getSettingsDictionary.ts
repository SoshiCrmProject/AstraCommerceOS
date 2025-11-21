import type { Locale } from './config';

export async function getSettingsDictionary(locale: Locale) {
  const dict = await import(`./locales/${locale}/app.settings.json`);
  return dict.default || dict;
}
