import common from "../data/common.yaml";
import home from "../data/home.yaml";
import projects from "../data/projects.yaml";
import teaching from "../data/teaching.yaml";
import people from "../data/people.yaml";
import visit from "../data/visit.yaml";
import publications from "../data/publications.yaml";
import legal from "../data/legal.yaml";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function getLocale(astroLocale: string | undefined): Locale {
  return astroLocale === "es" ? "es" : "en";
}

const translations = {
  en: {
    ...common.en,
    home: home.en,
    projects: projects.en,
    teaching: teaching.en,
    people: people.en,
    visit: visit.en,
    publications: publications.en,
    legal: legal.en,
  },
  es: {
    ...common.es,
    home: home.es,
    projects: projects.es,
    teaching: teaching.es,
    people: people.es,
    visit: visit.es,
    publications: publications.es,
    legal: legal.es,
  },
};

export function useTranslations(locale: Locale) {
  return translations[locale];
}
