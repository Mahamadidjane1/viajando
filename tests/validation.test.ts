import { describe, expect, it, vi } from "vitest"
import { checkoutSchema, passengerSchema } from "@/lib/validations/booking"
import { registerSchema } from "@/lib/auth-helpers"
import { safeCallbackUrl } from "@/lib/session"

vi.mock("next/headers", () => ({ headers: async () => new Headers() }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))
vi.mock("@/auth", () => ({ auth: vi.fn() }))

const passenger = {
  firstName: "Ana",
  lastName: "Silva",
  email: "ANA@Example.com ",
  dateOfBirth: "1990-04-01",
  documentType: "passport" as const,
  documentNumber: "ab12345",
  phone: "",
}

describe("passengerSchema", () => {
  it("normaliza email e numero do documento", () => {
    const parsed = passengerSchema.parse(passenger)
    expect(parsed.email).toBe("ana@example.com")
    expect(parsed.documentNumber).toBe("AB12345")
  })

  it("rejeita data de nascimento no futuro", () => {
    expect(passengerSchema.safeParse({ ...passenger, dateOfBirth: "2999-01-01" }).success).toBe(false)
  })
})

describe("checkoutSchema", () => {
  const valid = {
    offerId: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    lang: "pt",
    passenger,
    acceptTerms: true,
  }

  it("aceita um pedido valido", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true)
  })

  it("nao aceita preco vindo do cliente (campo ignorado)", () => {
    const parsed = checkoutSchema.parse({ ...valid, price: 0.01 })
    expect("price" in parsed).toBe(false)
  })

  it("exige aceitar os termos", () => {
    expect(checkoutSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("exige password com pelo menos 8 caracteres, letras e numeros", () => {
    expect(registerSchema.safeParse({ name: "Ana", email: "a@b.pt", password: "abc123" }).success).toBe(false)
    expect(registerSchema.safeParse({ name: "Ana", email: "a@b.pt", password: "abcdefgh" }).success).toBe(false)
    expect(registerSchema.safeParse({ name: "Ana", email: "a@b.pt", password: "abcdefg1" }).success).toBe(true)
  })
})

describe("safeCallbackUrl", () => {
  it.each([
    ["/pt/book?offer=1", "/pt/book?offer=1"],
    ["https://evil.example", "/fallback"],
    ["//evil.example", "/fallback"],
    ["/\\evil.example", "/fallback"],
    [undefined, "/fallback"],
  ])("%s -> %s", (input, expected) => {
    expect(safeCallbackUrl(input, "/fallback")).toBe(expected)
  })
})
