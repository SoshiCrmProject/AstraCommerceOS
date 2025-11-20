import { defaultLocale, isLocale, type Locale } from "./config";
import enApp from "./locales/en/app.common.json";

export type AppDictionary = typeof enApp;

export const getAppLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getAppDictionary = async (locale: Locale): Promise<AppDictionary> => {
  if (locale === "ja") {
    const dictionary = await import("./locales/ja/app.common.json");
    return dictionary.default;
  }
  return enApp;
};
