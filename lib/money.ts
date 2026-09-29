/** Converte um valor decimal em texto ("123.45") para centimos sem erros de virgula flutuante. */
export function decimalToCents(value: string | number): number {
  const text = typeof value === "number" ? value.toFixed(2) : value.trim()
  if (!/^\d+(\.\d+)?$/.test(text)) throw new Error(`Valor monetario invalido: ${value}`)
  const [whole, fraction = ""] = text.split(".")
  const cents = Number(whole) * 100 + Number((fraction + "00").slice(0, 2))
  // arredonda a terceira casa decimal, se existir
  return fraction.length > 2 && Number(fraction[2]) >= 5 ? cents + 1 : cents
}

const LOCALE_TAGS: Record<string, string> = { pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR" }

export function formatMoney(cents: number, currency = "EUR", locale = "pt"): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale] ?? locale, { style: "currency", currency }).format(cents / 100)
}
