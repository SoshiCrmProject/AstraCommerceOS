import { type Locale } from "./config";
import enListings from "./locales/en/app.listings.json";

export type ListingsDictionary = typeof enListings;

export const getListingsDictionary = async (locale: Locale): Promise<ListingsDictionary> => {
  if (locale === "ja") {
    const dictionary = await import("./locales/ja/app.listings.json");
    return dictionary.default;
  }
  return enListings;
};