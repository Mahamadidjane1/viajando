import "server-only"
import { randomUUID } from "node:crypto"
import { cacheGet, cacheSet } from "./cache"
import { decimalToCents } from "./money"
import type { AmadeusFlightOffer } from "./amadeus-service"
import { parseIsoDuration, type TransportType, type TravelOffer } from "./offer-utils"

export * from "./offer-utils"

type StoredOffer = TravelOffer & { raw?: AmadeusFlightOffer }

/** Validade de uma oferta pesquisada (as ofertas Amadeus caducam rapidamente). */
export const OFFER_TTL_SECONDS = 30 * 60

const offerKey = (id: string) => `offer:${id}`

export async function saveOffers(offers: StoredOffer[]): Promise<void> {
  await Promise.all(offers.map((offer) => cacheSet(offerKey(offer.id), offer, OFFER_TTL_SECONDS)))
}

export async function getStoredOffer(id: string): Promise<StoredOffer | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const offer = await cacheGet<StoredOffer>(offerKey(id))
  if (!offer || offer.expiresAt < Date.now()) return null
  return offer
}

export function toPublicOffer({ raw: _raw, ...offer }: StoredOffer): TravelOffer {
  return offer
}

export function mapAmadeusOffer(raw: AmadeusFlightOffer, carriers: Record<string, string>): StoredOffer | null {
  const itinerary = raw.itineraries?.[0]
  const segments = itinerary?.segments
  if (!itinerary || !segments?.length) return null

  const first = segments[0]
  const last = segments[segments.length - 1]
  const carrierCode = raw.validatingAirlineCodes?.[0] ?? first.carrierCode ?? "??"
  const total = raw.price?.grandTotal ?? raw.price?.total
  if (!total) return null

  return {
    id: randomUUID(),
    source: "amadeus",
    providerRef: raw.id,
    type: "flight",
    carrierCode,
    carrierName: carriers[carrierCode] ? titleCase(carriers[carrierCode]) : carrierCode,
    origin: first.departure.iataCode,
    destination: last.arrival.iataCode,
    departureStation: first.departure.iataCode,
    arrivalStation: last.arrival.iataCode,
    departureAt: first.departure.at,
    arrivalAt: last.arrival.at,
    durationMinutes: parseIsoDuration(itinerary.duration),
    stops: segments.length - 1,
    priceCents: decimalToCents(total),
    currency: raw.price.currency ?? "EUR",
    expiresAt: Date.now() + OFFER_TTL_SECONDS * 1000,
    raw,
  }
}

function titleCase(value: string): string {
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const DEMO_TEMPLATES: Array<{
  type: TransportType
  carrierCode: string
  carrierName: string
  departure: string
  durationMinutes: number
  stops: number
  priceCents: number
}> = [
  { type: "flight", carrierCode: "TP", carrierName: "TAP Air Portugal", departure: "08:00", durationMinutes: 90, stops: 0, priceCents: 8500 },
  { type: "flight", carrierCode: "IB", carrierName: "Iberia", departure: "14:20", durationMinutes: 95, stops: 0, priceCents: 9200 },
  { type: "flight", carrierCode: "FR", carrierName: "Ryanair", departure: "06:35", durationMinutes: 85, stops: 0, priceCents: 4799 },
  { type: "flight", carrierCode: "U2", carrierName: "easyJet", departure: "19:10", durationMinutes: 210, stops: 1, priceCents: 6350 },
  { type: "train", carrierCode: "RENFE", carrierName: "Renfe", departure: "09:15", durationMinutes: 450, stops: 1, priceCents: 4500 },
  { type: "bus", carrierCode: "FLIX", carrierName: "FlixBus", departure: "10:00", durationMinutes: 540, stops: 0, priceCents: 2900 },
]

/** Ofertas ficticias para desenvolvimento/demonstracao, geradas para a rota e data pedidas. */
export function buildDemoOffers(origin: string, destination: string, date: string): StoredOffer[] {
  return DEMO_TEMPLATES.map((template) => {
    const departureAt = `${date}T${template.departure}:00`
    const arrival = new Date(`${departureAt}Z`)
    arrival.setUTCMinutes(arrival.getUTCMinutes() + template.durationMinutes)

    return {
      id: randomUUID(),
      source: "demo" as const,
      providerRef: null,
      type: template.type,
      carrierCode: template.carrierCode,
      carrierName: template.carrierName,
      origin,
      destination,
      departureStation: origin,
      arrivalStation: destination,
      departureAt,
      arrivalAt: arrival.toISOString().slice(0, 19),
      durationMinutes: template.durationMinutes,
      stops: template.stops,
      priceCents: template.priceCents,
      currency: "EUR",
      expiresAt: Date.now() + OFFER_TTL_SECONDS * 1000,
    }
  })
}
