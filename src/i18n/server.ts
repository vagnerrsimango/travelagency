import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import en from "./dictionaries/en.json";
import pt from "./dictionaries/pt.json";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  pt,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getLocalizedDictionary(lang: string) {
  if (!isLocale(lang)) {
    notFound();
  }

  return {
    locale: lang,
    dict: getDictionary(lang),
  };
}
