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

const amadeusEnvironment =
  process.env.AMADEUS_ENVIRONMENT === "production" ? "production" : "test"

const API_CONFIG_FROM_ENV: APIConfig = {
  amadeus: {
    key: process.env.AMADEUS_API_KEY ?? "",
    secret: process.env.AMADEUS_API_SECRET ?? "",
    active: process.env.AMADEUS_ACTIVE !== "false",
    environment: amadeusEnvironment,
  },
  maps: {
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  },
}

export function getAPIConfig(): APIConfig {
  return API_CONFIG_FROM_ENV
}

export function isAmadeusConfigured(): boolean {
  const config = getAPIConfig()
  return !!(config.amadeus.key && config.amadeus.secret && config.amadeus.active)
}

export function getAmadeusKey(): string {
  return API_CONFIG_FROM_ENV.amadeus.key
}

export function getAmadeusSecret(): string {
  return API_CONFIG_FROM_ENV.amadeus.secret
}

export function getAmadeusEnv(): "test" | "production" {
  return API_CONFIG_FROM_ENV.amadeus.environment
}

export function getGoogleMapsKey(): string {
  return API_CONFIG_FROM_ENV.maps.key
}

export const API_CONFIG = {
  AMADEUS_API_KEY: API_CONFIG_FROM_ENV.amadeus.key,
  AMADEUS_API_SECRET: API_CONFIG_FROM_ENV.amadeus.secret,
  AMADEUS_BASE_URL:
    process.env.AMADEUS_BASE_URL ??
    (API_CONFIG_FROM_ENV.amadeus.environment === "test" ? "https://test.api.amadeus.com" : "https://api.amadeus.com"),
}
