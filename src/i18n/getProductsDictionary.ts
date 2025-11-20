import { defaultLocale, isLocale, type Locale } from "./config";
import enProducts from "./locales/en/app.products.json";

export type ProductsDictionary = typeof enProducts;

export const getProductsLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getProductsDictionary = async (locale: Locale): Promise<ProductsDictionary> => {
  if (locale === "ja") {
    const dictionary = await import("./locales/ja/app.products.json");
    return dictionary.default;
  }
  return enProducts;
};
