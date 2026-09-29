const LOCALE_TAGS: Record<string, string> = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR" }

export const localeTag = (lang: string) => LOCALE_TAGS[lang] ?? "pt-PT"

/**
 * As horas das viagens sao guardadas como hora local da estacao (sem fuso),
 * por isso formatamos sempre em UTC para as mostrar tal como foram publicadas.
 */
export function formatTripDate(value: Date | string, lang: string, options: Intl.DateTimeFormatOptions) {
  const date = typeof value === "string" ? new Date(value.endsWith("Z") ? value : `${value}Z`) : value
  return new Intl.DateTimeFormat(localeTag(lang), { timeZone: "UTC", ...options }).format(date)
}

export const formatTime = (value: Date | string, lang: string) =>
  formatTripDate(value, lang, { hour: "2-digit", minute: "2-digit", hour12: false })

export const formatDay = (value: Date | string, lang: string) =>
  formatTripDate(value, lang, { weekday: "short", day: "numeric", month: "short", year: "numeric" })

/** Datas reais (criacao, pagamento) no fuso de Lisboa. */
export function formatTimestamp(value: Date, lang: string) {
  return new Intl.DateTimeFormat(localeTag(lang), {
    timeZone: "Europe/Lisbon",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}
