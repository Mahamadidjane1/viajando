import { describe, expect, it, vi } from "vitest"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }) }))

describe("rateLimit", () => {
  it("permite ate ao limite e bloqueia depois", async () => {
    const rule = { limit: 3, windowSeconds: 60 }
    const results = []
    for (let i = 0; i < 5; i++) results.push(await rateLimit("test", "user-a", rule))
    expect(results).toEqual([true, true, true, false, false])
  })

  it("isola identificadores diferentes", async () => {
    const rule = { limit: 1, windowSeconds: 60 }
    expect(await rateLimit("iso", "user-b", rule)).toBe(true)
    expect(await rateLimit("iso", "user-c", rule)).toBe(true)
    expect(await rateLimit("iso", "user-b", rule)).toBe(false)
  })

  it("usa o primeiro IP do x-forwarded-for", async () => {
    expect(await getClientIp()).toBe("203.0.113.7")
  })
})
