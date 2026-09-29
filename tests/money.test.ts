import { describe, expect, it } from "vitest"
import { decimalToCents, formatMoney } from "@/lib/money"

describe("decimalToCents", () => {
  it.each([
    ["123.45", 12345],
    ["0.1", 10],
    ["99", 9900],
    ["19.99", 1999],
    ["0.29", 29], // 0.29 * 100 = 28.999... em virgula flutuante
    ["10.005", 1001],
    [85, 8500],
  ])("%s -> %i", (input, expected) => {
    expect(decimalToCents(input)).toBe(expected)
  })

  it("rejeita valores invalidos", () => {
    expect(() => decimalToCents("-1")).toThrow()
    expect(() => decimalToCents("abc")).toThrow()
  })
})

describe("formatMoney", () => {
  it("formata em euros no formato portugues", () => {
    expect(formatMoney(8550, "EUR", "pt").replace(/\s/g, " ")).toBe("85,50 €")
  })
})
