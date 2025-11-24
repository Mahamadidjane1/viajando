import { cacheGet, cacheSet } from "./cache"
import { API_CONFIG } from "./api-config"

// Types
interface AmadeusToken {
  access_token: string
  expires_in: number
  generated_at: number
}

// Constants
const TOKEN_CACHE_KEY = "amadeus:token"
const CACHE_TTL = 600 // 10 minutes for flight results

/**
 * Securely gets a valid Amadeus access token
 * Handles caching and regeneration
 */
async function getAmadeusToken(): Promise<string | null> {
  try {
    // 1. Check Cache
    const cached = await cacheGet<AmadeusToken>(TOKEN_CACHE_KEY)
    if (cached) {
      const now = Date.now()
      const expiresAt = cached.generated_at + cached.expires_in * 1000
      // Return if token has at least 60 seconds of life left
      if (expiresAt - now > 60000) {
        return cached.access_token
      }
    }

    // 2. Verify Credentials
    if (!API_CONFIG.AMADEUS_API_KEY || !API_CONFIG.AMADEUS_API_SECRET) {
      console.error("[Amadeus] Missing credentials in environment variables")
      return null
    }

    // 3. Fetch New Token
    const params = new URLSearchParams()
    params.append("grant_type", "client_credentials")
    params.append("client_id", API_CONFIG.AMADEUS_API_KEY)
    params.append("client_secret", API_CONFIG.AMADEUS_API_SECRET)

    const response = await fetch(`${API_CONFIG.AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Amadeus] Token generation failed: ${response.status} ${errorText}`)
      return null
    }

    const data = await response.json()

    const tokenData: AmadeusToken = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      generated_at: Date.now(),
    }

    // Cache the token (expires slightly before actual expiration)
    await cacheSet(TOKEN_CACHE_KEY, tokenData, data.expires_in - 60)

    return data.access_token
  } catch (error) {
    console.error("[Amadeus] Token system error:", error)
    return null
  }
}

/**
 * Safe Fetch Wrapper
 */
async function safeFetch(url: string, token: string) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    if (response.status === 429) {
      console.warn("[Amadeus] Rate limit exceeded (429)")
      return { status: 429, data: null }
    }

    if (!response.ok) {
      console.warn(`[Amadeus] API error: ${response.status}`)
      return { status: response.status, data: null }
    }

    const data = await response.json()
    return { status: 200, data }
  } catch (error) {
    console.warn("[Amadeus] Network error:", error)
    return { status: 500, data: null }
  }
}

/**
 * Main Search Function
 */
export async function searchFlightsSafe(params: {
  origin: string
  destination: string
  date: string
  adults?: string
}) {
  const { origin, destination, date, adults = "1" } = params

  // 1. Cache Key Generation
  const cacheKey = `search:${origin}:${destination}:${date}:${adults}`

  try {
    // 2. Check Cache
    const cachedResult = await cacheGet(cacheKey)
    if (cachedResult) {
      console.log("[Amadeus] Cache hit")
      return cachedResult // Return raw Amadeus data from cache
    }

    // 3. Get Token
    const token = await getAmadeusToken()
    if (!token) {
      console.warn("[Amadeus] No valid token available")
      return [] // Return empty to trigger fallback
    }

    // 4. Call API
    const url = `${API_CONFIG.AMADEUS_BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&max=10&currencyCode=EUR`

    const result = await safeFetch(url, token)

    // 5. Handle Result
    if (result.status === 200 && result.data && result.data.data) {
      // Success - Cache the result
      await cacheSet(cacheKey, result.data.data, CACHE_TTL)
      return result.data.data
    }

    // Fallback for any failure
    return []
  } catch (error) {
    console.error("[Amadeus] Critical search error:", error)
    return []
  }
}
