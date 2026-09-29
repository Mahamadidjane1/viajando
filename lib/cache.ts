import { Redis } from "@upstash/redis"

// Singleton instance
let redis: Redis | null = null

const getRedis = () => {
  if (!redis && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    } catch (e) {
      console.warn("[Redis] Failed to initialize:", e)
    }
  }
  return redis
}

// In-memory fallback
const memoryCache = new Map<string, { value: any; expires: number }>()

export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis()
  if (r) {
    try {
      // Upstash Redis automatically parses JSON if possible, but we handle explicit objects
      const data = await r.get(key)
      // If data is returned as an object, return it. If string, try parsing just in case.
      if (typeof data === "string") {
        try {
          return JSON.parse(data)
        } catch {
          return data as unknown as T
        }
      }
      return data as T
    } catch (e) {
      console.warn("[Cache] Redis get failed, falling back to memory", e)
    }
  }

  // Memory fallback
  const item = memoryCache.get(key)
  if (item && item.expires > Date.now()) {
    return item.value
  }
  return null
}

/** Incrementa um contador com janela de expiracao; devolve o valor atual. */
export async function cacheIncr(key: string, ttlSeconds: number): Promise<number> {
  const r = getRedis()
  if (r) {
    try {
      const value = await r.incr(key)
      if (value === 1) await r.expire(key, ttlSeconds)
      return value
    } catch (e) {
      console.warn("[Cache] Redis incr failed, falling back to memory", e)
    }
  }

  const now = Date.now()
  const item = memoryCache.get(key)
  if (!item || item.expires <= now) {
    memoryCache.set(key, { value: 1, expires: now + ttlSeconds * 1000 })
    return 1
  }
  item.value = Number(item.value) + 1
  return item.value
}

export async function cacheSet(key: string, value: any, ttlSeconds = 300): Promise<void> {
  const r = getRedis()
  if (r) {
    try {
      // Upstash Redis handles object serialization automatically
      await r.set(key, value, { ex: ttlSeconds })
      return
    } catch (e) {
      console.warn("[Cache] Redis set failed, falling back to memory", e)
    }
  }

  // Memory fallback
  memoryCache.set(key, {
    value,
    expires: Date.now() + ttlSeconds * 1000,
  })

  // Cleanup memory cache periodically (simple implementation)
  if (memoryCache.size > 1000) {
    const now = Date.now()
    for (const [k, v] of memoryCache.entries()) {
      if (v.expires < now) memoryCache.delete(k)
    }
  }
}
