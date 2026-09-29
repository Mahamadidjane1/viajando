const amadeusEnvironment = process.env.AMADEUS_ENVIRONMENT === "production" ? "production" : "test"

export const API_CONFIG = {
  AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ?? "",
  AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ?? "",
  AMADEUS_BASE_URL:
    process.env.AMADEUS_BASE_URL ??
    (amadeusEnvironment === "test" ? "https://test.api.amadeus.com" : "https://api.amadeus.com"),
}

export function isAmadeusConfigured(): boolean {
  return Boolean(API_CONFIG.AMADEUS_API_KEY && API_CONFIG.AMADEUS_API_SECRET && process.env.AMADEUS_ACTIVE !== "false")
}
