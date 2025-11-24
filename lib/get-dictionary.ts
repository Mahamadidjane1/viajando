"use server"

import type { Locale } from "@/i18n-config"
import { i18n } from "@/i18n-config"

const dictionaries = {
  pt: () => import("@/dictionaries/pt.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  const validLocale = i18n.locales.includes(locale as any) ? locale : i18n.defaultLocale
  const result = await (dictionaries[validLocale]?.() ?? dictionaries.pt())
  return result
}
