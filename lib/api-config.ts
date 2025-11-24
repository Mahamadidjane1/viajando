export interface APIConfig {
  amadeus: {
    key: string
    secret: string
    active: boolean
    environment: "test" | "production"
  }
  maps: {
    key: string
  }
}

// Direct API configuration - keys are hardcoded
const DIRECT_API_CONFIG: APIConfig = {
  amadeus: {
    key: "QUNShCIUqEpRvIOcIb9Sfb3n5syRGZ5d",
    secret: "5dcC1zFuSIMiLxH0",
    active: true,
    environment: "test",
  },
  maps: {
    key: "", // Add Google Maps key here when available
  },
}

export function getAPIConfig(): APIConfig {
  return DIRECT_API_CONFIG
}

export function isAmadeusConfigured(): boolean {
  const config = getAPIConfig()
  return !!(config.amadeus.key && config.amadeus.active)
}

export function getAmadeusKey(): string {
  return DIRECT_API_CONFIG.amadeus.key
}

export function getAmadeusSecret(): string {
  return DIRECT_API_CONFIG.amadeus.secret
}

export function getAmadeusEnv(): "test" | "production" {
  return DIRECT_API_CONFIG.amadeus.environment
}

export function getGoogleMapsKey(): string {
  return DIRECT_API_CONFIG.maps.key
}

export const API_CONFIG = {
  AMADEUS_API_KEY: DIRECT_API_CONFIG.amadeus.key,
  AMADEUS_API_SECRET: DIRECT_API_CONFIG.amadeus.secret,
  AMADEUS_BASE_URL:
    DIRECT_API_CONFIG.amadeus.environment === "test" ? "https://test.api.amadeus.com" : "https://api.amadeus.com",
}
