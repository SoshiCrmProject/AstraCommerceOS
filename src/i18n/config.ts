export const supportedLocales = ["en", "ja"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  supportedLocales.includes(value as Locale);
