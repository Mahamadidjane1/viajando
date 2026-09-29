"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { searchFlights } from "@/lib/amadeus-service"
import { isAmadeusConfigured } from "@/lib/api-config"
import { isDemoDataEnabled } from "@/lib/env"
import { buildDemoOffers, mapAmadeusOffer, saveOffers, toPublicOffer, type TravelOffer } from "@/lib/offers"
import { getClientIp, hashIdentifier, rateLimit, RATE_LIMITS } from "@/lib/rate-limit"

export type SearchResponse =
  | { status: "ok" | "demo"; offers: TravelOffer[] }
  | { status: "invalid" | "rate_limited" | "unavailable"; offers: []; message: string }

const searchSchema = z
  .object({
    origin: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
    destination: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    adults: z.number().int().min(1).max(9).default(1),
  })
  .refine((v) => v.origin !== v.destination, { message: "Origem e destino iguais" })
  .refine((v) => v.date >= new Date().toISOString().slice(0, 10), { message: "Data no passado" })

export async function searchFlightsAction(input: {
  origin: string
  destination: string
  date: string
  adults?: number
}): Promise<SearchResponse> {
  const parsed = searchSchema.safeParse(input)
  if (!parsed.success) {
    return { status: "invalid", offers: [], message: "Pesquisa inválida. Verifique a origem, o destino e a data." }
  }

  const ip = await getClientIp()
  if (!(await rateLimit("search", ip, RATE_LIMITS.search))) {
    return { status: "rate_limited", offers: [], message: "Demasiadas pesquisas seguidas. Aguarde um minuto." }
  }

  const { origin, destination, date, adults } = parsed.data
  const startedAt = Date.now()
  let status: "ok" | "demo" | "unavailable" = "unavailable"
  let offers: Parameters<typeof saveOffers>[0] = []

  if (isAmadeusConfigured()) {
    const result = await searchFlights({ origin, destination, date, adults })
    if (result) {
      status = "ok"
      offers = result.offers
        .map((raw) => mapAmadeusOffer(raw, result.carriers))
        .filter((offer): offer is NonNullable<typeof offer> => offer !== null)
    }
  }

  if (status === "unavailable" && isDemoDataEnabled()) {
    status = "demo"
    offers = buildDemoOffers(origin, destination, date)
  }

  await saveOffers(offers)

  prisma.searchLog
    .create({
      data: {
        origin,
        destination,
        date: new Date(`${date}T00:00:00Z`),
        source: status,
        resultCount: offers.length,
        latencyMs: Date.now() - startedAt,
        ipHash: hashIdentifier(ip),
      },
    })
    .catch((error) => console.warn("[search] Failed to write SearchLog:", error))

  if (status === "unavailable") {
    return {
      status,
      offers: [],
      message: "O serviço de pesquisa está temporariamente indisponível. Tente novamente dentro de momentos.",
    }
  }

  return { status, offers: offers.map(toPublicOffer) }
}
