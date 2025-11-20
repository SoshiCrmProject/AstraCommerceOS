import { defaultLocale, isLocale, type Locale } from "./config";
import enDashboard from "./locales/en/app.dashboard.json";

export type DashboardDictionary = typeof enDashboard;

export const getDashboardLocale = (value?: string): Locale =>
  isLocale(value ?? "") ? (value as Locale) : defaultLocale;

export const getDashboardDictionary = async (
  locale: Locale,
): Promise<DashboardDictionary> => {
  if (locale === "ja") {
    const dict = await import("./locales/ja/app.dashboard.json");
    return dict.default;
  }
  return enDashboard;
};
