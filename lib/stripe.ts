import "server-only"
import Stripe from "stripe"

let client: Stripe | null = null

/** Cliente Stripe partilhado. Devolve null quando o Stripe nao esta configurado. */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
    appInfo: { name: "Viajando" },
  })
  return client
}
