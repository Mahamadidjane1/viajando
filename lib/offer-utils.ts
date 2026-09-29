export type TransportType = "flight" | "train" | "bus"

/** Oferta normalizada. O preco vive apenas no servidor; o cliente so envia o `id`. */
export type TravelOffer = {
  id: string
  source: "amadeus" | "demo"
  providerRef: string | null
  type: TransportType
  carrierCode: string
  carrierName: string
  origin: string
  destination: string
  departureStation: string
  arrivalStation: string
  /** Data/hora local de partida, ISO sem fuso (ex.: 2026-11-10T08:00:00). */
  departureAt: string
  arrivalAt: string
  durationMinutes: number
  stops: number
  priceCents: number
  currency: string
  /** Epoch ms apos o qual a oferta deixa de ser valida para compra. */
  expiresAt: number
}

/** "PT2H15M" -> 135 */
export function parseIsoDuration(value: string | undefined): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?$/.exec(value ?? "")
  if (!match) return 0
  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0)
}

/** 135 -> "2h 15m" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${String(m).padStart(2, "0")}m` : `${h}h`
}
