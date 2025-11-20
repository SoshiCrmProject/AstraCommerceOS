import { defaultLocale, isLocale, type Locale } from "./config";
import enSite from "./locales/en/site.json";

export type SiteDictionary = typeof enSite;

export const getSiteLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getSiteDictionary = async (locale: Locale): Promise<SiteDictionary> => {
  if (locale === "ja") {
    const dictionary = await import("./locales/ja/site.json");
    return dictionary.default;
  }
  return enSite;
};
