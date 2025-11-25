import 'server-only';
import type { Locale } from './config';

const dictionaries = {
  en: () => import('./locales/en/automation').then((module) => module.default),
  ja: () => import('./locales/ja/automation').then((module) => module.default),
};

export const getAutomationDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
