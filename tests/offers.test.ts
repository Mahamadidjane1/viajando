import { describe, expect, it } from "vitest"
import {
  buildDemoOffers,
  formatDuration,
  getStoredOffer,
  mapAmadeusOffer,
  parseIsoDuration,
  saveOffers,
  toPublicOffer,
} from "@/lib/offers"
import type { AmadeusFlightOffer } from "@/lib/amadeus-service"

const amadeusOffer: AmadeusFlightOffer = {
  id: "1",
  itineraries: [
    {
      duration: "PT3H5M",
      segments: [
        { departure: { at: "2026-11-10T07:00:00", iataCode: "LIS" }, arrival: { at: "2026-11-10T09:00:00", iataCode: "MAD" }, carrierCode: "IB" },
        { departure: { at: "2026-11-10T09:50:00", iataCode: "MAD" }, arrival: { at: "2026-11-10T12:05:00", iataCode: "BCN" }, carrierCode: "IB" },
      ],
    },
  ],
  validatingAirlineCodes: ["IB"],
  price: { total: "120.29", grandTotal: "120.29", currency: "EUR" },
}

describe("durations", () => {
  it("converte ISO 8601 para minutos", () => {
    expect(parseIsoDuration("PT2H15M")).toBe(135)
    expect(parseIsoDuration("PT45M")).toBe(45)
    expect(parseIsoDuration("PT3H")).toBe(180)
    expect(parseIsoDuration("bad")).toBe(0)
  })

  it("formata minutos", () => {
    expect(formatDuration(135)).toBe("2h 15m")
    expect(formatDuration(65)).toBe("1h 05m")
    expect(formatDuration(120)).toBe("2h")
  })
})

describe("mapAmadeusOffer", () => {
  it("normaliza a oferta com preco em centimos e id opaco", () => {
    const offer = mapAmadeusOffer(amadeusOffer, { IB: "IBERIA" })!
    expect(offer.priceCents).toBe(12029)
    expect(offer.origin).toBe("LIS")
    expect(offer.destination).toBe("BCN")
    expect(offer.stops).toBe(1)
    expect(offer.durationMinutes).toBe(185)
    expect(offer.carrierName).toBe("Iberia")
    expect(offer.providerRef).toBe("1")
    expect(offer.id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it("ignora ofertas sem itinerario", () => {
    expect(mapAmadeusOffer({ ...amadeusOffer, itineraries: [] }, {})).toBeNull()
  })
})

describe("armazenamento de ofertas", () => {
  it("guarda e recupera ofertas pelo id; o cliente nunca ve os dados brutos", async () => {
    const offer = mapAmadeusOffer(amadeusOffer, {})!
    await saveOffers([offer])

    const stored = await getStoredOffer(offer.id)
    expect(stored?.priceCents).toBe(12029)
    expect(stored?.raw).toBeDefined()
    expect("raw" in toPublicOffer(stored!)).toBe(false)
  })

  it("rejeita ids desconhecidos ou mal formados", async () => {
    expect(await getStoredOffer("00000000-0000-0000-0000-000000000000")).toBeNull()
    expect(await getStoredOffer("../../etc/passwd")).toBeNull()
  })

  it("nao devolve ofertas expiradas", async () => {
    const [offer] = buildDemoOffers("LIS", "OPO", "2030-01-01")
    await saveOffers([{ ...offer, expiresAt: Date.now() - 1 }])
    expect(await getStoredOffer(offer.id)).toBeNull()
  })
})

describe("buildDemoOffers", () => {
  it("gera ofertas para a rota e data pedidas", () => {
    const offers = buildDemoOffers("OPO", "CDG", "2030-05-01")
    expect(offers.length).toBeGreaterThan(0)
    for (const offer of offers) {
      expect(offer.source).toBe("demo")
      expect(offer.origin).toBe("OPO")
      expect(offer.destination).toBe("CDG")
      expect(offer.departureAt.startsWith("2030-05-01")).toBe(true)
      expect(offer.arrivalAt > offer.departureAt).toBe(true)
    }
    expect(new Set(offers.map((o) => o.id)).size).toBe(offers.length)
  })
})
