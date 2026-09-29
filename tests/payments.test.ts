import { beforeEach, describe, expect, it } from "vitest"
import type Stripe from "stripe"
import type { BookingStatus } from "@prisma/client"
import { applyStripeEvent } from "@/lib/payments"

type FakeBooking = { id: string; status: BookingStatus; amountCents: number; paymentIntentId: string | null; paidAt?: Date | null }

function createDb(bookings: FakeBooking[]) {
  const events = new Set<string>()
  const byId = new Map(bookings.map((b) => [b.id, { ...b }]))
  const db = {
    webhookEvent: {
      findUnique: async ({ where }: { where: { id: string } }) => (events.has(where.id) ? { id: where.id } : null),
      create: async ({ data }: { data: { id: string } }) => {
        events.add(data.id)
        return data
      },
    },
    booking: {
      findUnique: async ({ where }: { where: { id?: string; paymentIntentId?: string } }) =>
        where.id ? (byId.get(where.id) ?? null) : ([...byId.values()].find((b) => b.paymentIntentId === where.paymentIntentId) ?? null),
      update: async ({ where, data }: { where: { id: string }; data: Partial<FakeBooking> }) => {
        const b = byId.get(where.id)!
        Object.assign(b, data)
        return b
      },
    },
  }
  return { db: db as unknown as Parameters<typeof applyStripeEvent>[0], byId }
}

let counter = 0
function event(type: string, object: Record<string, unknown>): Stripe.Event {
  return { id: `evt_${++counter}`, type, data: { object } } as unknown as Stripe.Event
}

const session = (overrides: Record<string, unknown> = {}) => ({
  metadata: { bookingId: "b1" },
  payment_status: "paid",
  payment_intent: "pi_1",
  amount_total: 8500,
  ...overrides,
})

describe("applyStripeEvent", () => {
  let ctx: ReturnType<typeof createDb>
  beforeEach(() => {
    ctx = createDb([{ id: "b1", status: "PENDING", amountCents: 8500, paymentIntentId: null }])
  })

  it("marca a reserva como paga e guarda o payment intent", async () => {
    const outcome = await applyStripeEvent(ctx.db, event("checkout.session.completed", session()))
    expect(outcome).toMatchObject({ handled: true, status: "PAID", becamePaid: true })
    expect(ctx.byId.get("b1")).toMatchObject({ status: "PAID", paymentIntentId: "pi_1" })
  })

  it("e idempotente: o mesmo evento repetido nao volta a ser aplicado", async () => {
    const e = event("checkout.session.completed", session())
    await applyStripeEvent(ctx.db, e)
    const second = await applyStripeEvent(ctx.db, e)
    expect(second).toEqual({ handled: true, duplicate: true })
  })

  it("pagamento assincrono (Multibanco) fica a aguardar e depois confirma", async () => {
    await applyStripeEvent(ctx.db, event("checkout.session.completed", session({ payment_status: "unpaid" })))
    expect(ctx.byId.get("b1")!.status).toBe("AWAITING_PAYMENT")

    const outcome = await applyStripeEvent(ctx.db, event("checkout.session.async_payment_succeeded", session()))
    expect(outcome.becamePaid).toBe(true)
    expect(ctx.byId.get("b1")!.status).toBe("PAID")
  })

  it("pagamento assincrono falhado marca FAILED", async () => {
    await applyStripeEvent(ctx.db, event("checkout.session.completed", session({ payment_status: "unpaid" })))
    await applyStripeEvent(ctx.db, event("checkout.session.async_payment_failed", session({ payment_status: "unpaid" })))
    expect(ctx.byId.get("b1")!.status).toBe("FAILED")
  })

  it("nunca regride uma reserva paga para expirada", async () => {
    await applyStripeEvent(ctx.db, event("checkout.session.completed", session()))
    const outcome = await applyStripeEvent(ctx.db, event("checkout.session.expired", session({ payment_status: "unpaid" })))
    expect(outcome.becamePaid).toBeFalsy()
    expect(ctx.byId.get("b1")!.status).toBe("PAID")
  })

  it("recusa marcar como paga se o valor cobrado nao corresponder", async () => {
    const outcome = await applyStripeEvent(ctx.db, event("checkout.session.completed", session({ amount_total: 1 })))
    expect(outcome.handled).toBe(false)
    expect(ctx.byId.get("b1")!.status).toBe("PENDING")
  })

  it("reembolso total marca REFUNDED", async () => {
    await applyStripeEvent(ctx.db, event("checkout.session.completed", session()))
    await applyStripeEvent(ctx.db, event("charge.refunded", { payment_intent: "pi_1", refunded: true }))
    expect(ctx.byId.get("b1")!.status).toBe("REFUNDED")
  })

  it("ignora eventos desconhecidos", async () => {
    const outcome = await applyStripeEvent(ctx.db, event("customer.created", {}))
    expect(outcome.handled).toBe(false)
  })
})
