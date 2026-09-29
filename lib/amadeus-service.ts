import "server-only"
import { cacheGet, cacheSet } from "./cache"
import { API_CONFIG, isAmadeusConfigured } from "./api-config"

interface AmadeusToken {
  access_token: string
  expires_in: number
  generated_at: number
}

export type AmadeusSearchResult = {
  offers: AmadeusFlightOffer[]
  carriers: Record<string, string>
}

export type AmadeusFlightOffer = {
  id: string
  itineraries: Array<{
    duration?: string
    segments: Array<{
      departure: { at: string; iataCode: string }
      arrival: { at: string; iataCode: string }
      carrierCode?: string
    }>
  }>
  validatingAirlineCodes?: string[]
  price: { total: string; grandTotal?: string; currency: string }
  [key: string]: unknown
}

const TOKEN_CACHE_KEY = "amadeus:token"
const SEARCH_CACHE_TTL = 600 // 10 minutos
const REQUEST_TIMEOUT_MS = 10_000

async function getAmadeusToken(): Promise<string | null> {
  try {
    const cached = await cacheGet<AmadeusToken>(TOKEN_CACHE_KEY)
    if (cached && cached.generated_at + cached.expires_in * 1000 - Date.now() > 60_000) {
      return cached.access_token
    }

    if (!isAmadeusConfigured()) return null

    const response = await fetch(`${API_CONFIG.AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: API_CONFIG.AMADEUS_API_KEY,
        client_secret: API_CONFIG.AMADEUS_API_SECRET,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.error(`[Amadeus] Token generation failed: ${response.status}`)
      return null
    }

    const data = await response.json()
    const tokenData: AmadeusToken = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      generated_at: Date.now(),
    }
    await cacheSet(TOKEN_CACHE_KEY, tokenData, Math.max(data.expires_in - 60, 60))
    return data.access_token
  } catch (error) {
    console.error("[Amadeus] Token system error:", error)
    return null
  }
}

async function amadeusFetch(path: string, init: RequestInit = {}) {
  const token = await getAmadeusToken()
  if (!token) return { status: 503, data: null }

  try {
    const response = await fetch(`${API_CONFIG.AMADEUS_BASE_URL}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.warn(`[Amadeus] ${path} -> ${response.status}`)
      return { status: response.status, data: null }
    }

    return { status: 200, data: await response.json() }
  } catch (error) {
    console.warn("[Amadeus] Network error:", error)
    return { status: 500, data: null }
  }
}

/**
 * Pesquisa de voos com cache. Devolve null quando o fornecedor esta indisponivel
 * (sem credenciais, erro de rede, quota esgotada).
 */
export async function searchFlights(params: {
  origin: string
  destination: string
  date: string
  adults?: number
}): Promise<AmadeusSearchResult | null> {
  const { origin, destination, date, adults = 1 } = params
  const cacheKey = `search:v2:${origin}:${destination}:${date}:${adults}`

  const cached = await cacheGet<AmadeusSearchResult>(cacheKey)
  if (cached) return cached

  const query = new URLSearchParams({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate: date,
    adults: String(adults),
    max: "20",
    currencyCode: "EUR",
  })
  const result = await amadeusFetch(`/v2/shopping/flight-offers?${query}`)
  if (result.status !== 200 || !Array.isArray(result.data?.data)) return null

  const payload: AmadeusSearchResult = {
    offers: result.data.data,
    carriers: result.data.dictionaries?.carriers ?? {},
  }
  await cacheSet(cacheKey, payload, SEARCH_CACHE_TTL)
  return payload
}

/**
 * Confirma disponibilidade e preco final de uma oferta antes do pagamento.
 * Devolve a oferta re-cotada ou null se ja nao estiver disponivel.
 */
export async function confirmFlightPrice(offer: AmadeusFlightOffer): Promise<AmadeusFlightOffer | null> {
  const result = await amadeusFetch("/v1/shopping/flight-offers/pricing", {
    method: "POST",
    body: JSON.stringify({ data: { type: "flight-offers-pricing", flightOffers: [offer] } }),
  })
  return result.data?.data?.flightOffers?.[0] ?? null
}
