import { defaultLocale, isLocale, type Locale } from "./config";
import enMarketing from "./locales/en/marketing.json";

export type MarketingDictionary = typeof enMarketing;

export const getValidatedLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getMarketingDictionary = async (
  locale: Locale,
): Promise<MarketingDictionary> => {
  if (locale === "ja") {
    const dictionary = await import("./locales/ja/marketing.json");
    return dictionary.default;
  }

  return enMarketing;
};
