import { defaultLocale, isLocale, type Locale } from "./config";
import enOrders from "./locales/en/app.orders.json";

export type OrdersDictionary = typeof enOrders;

export const getOrdersLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getOrdersDictionary = async (
  locale: Locale,
): Promise<OrdersDictionary> => {
  if (locale === "ja") {
    const dict = await import("./locales/ja/app.orders.json");
    return dict.default;
  }
  return enOrders;
};
