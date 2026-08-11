import translations from "../data/translations.json";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function getLocale(astroLocale: string | undefined): Locale {
  return astroLocale === "es" ? "es" : "en";
}

export function useTranslations(locale: Locale) {
  return translations[locale];
}
