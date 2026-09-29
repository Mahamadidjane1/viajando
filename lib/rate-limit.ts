import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { cacheIncr } from "./cache"

export type RateLimitRule = {
  /** Numero maximo de pedidos na janela. */
  limit: number
  /** Duracao da janela em segundos. */
  windowSeconds: number
}

export const RATE_LIMITS = {
  login: { limit: 10, windowSeconds: 15 * 60 },
  register: { limit: 5, windowSeconds: 60 * 60 },
  search: { limit: 30, windowSeconds: 60 },
  checkout: { limit: 10, windowSeconds: 10 * 60 },
} satisfies Record<string, RateLimitRule>

/**
 * Janela fixa sobre Redis (Upstash) com fallback em memoria.
 * Devolve true se o pedido e permitido.
 */
export async function rateLimit(bucket: string, identifier: string, rule: RateLimitRule): Promise<boolean> {
  const windowId = Math.floor(Date.now() / (rule.windowSeconds * 1000))
  const key = `ratelimit:${bucket}:${hashIdentifier(identifier)}:${windowId}`
  const count = await cacheIncr(key, rule.windowSeconds)
  return count <= rule.limit
}

export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32)
}

/** IP do cliente a partir dos cabecalhos do proxy (Vercel, Cloudflare, nginx). */
export async function getClientIp(): Promise<string> {
  const h = await headers()
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
}
