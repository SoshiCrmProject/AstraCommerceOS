import { defaultLocale, isLocale, type Locale } from "./config";
import enChannels from "./locales/en/app.channels.json";

export type ChannelsDictionary = typeof enChannels;

export const getChannelsLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getChannelsDictionary = async (
  locale: Locale,
): Promise<ChannelsDictionary> => {
  if (locale === "ja") {
    const dictionary = await import("./locales/ja/app.channels.json");
    return dictionary.default;
  }
  return enChannels;
};
