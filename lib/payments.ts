import type Stripe from "stripe"
import type { BookingStatus, PrismaClient } from "@prisma/client"

type Db = Pick<PrismaClient, "booking" | "webhookEvent">

export type WebhookOutcome = {
  handled: boolean
  duplicate?: boolean
  bookingId?: string
  status?: BookingStatus
  /** true quando a reserva acabou de passar a PAID (para enviar a confirmacao). */
  becamePaid?: boolean
}

const paymentIntentId = (value: string | Stripe.PaymentIntent | null) =>
  typeof value === "string" ? value : (value?.id ?? null)

/** Transicoes permitidas: nunca se volta atras de um estado final. */
const ALLOWED_FROM: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [],
  AWAITING_PAYMENT: ["PENDING"],
  PAID: ["PENDING", "AWAITING_PAYMENT", "EXPIRED"],
  FAILED: ["PENDING", "AWAITING_PAYMENT"],
  EXPIRED: ["PENDING"],
  CANCELLED: ["PENDING", "AWAITING_PAYMENT", "PAID"],
  REFUNDED: ["PAID"],
}

/**
 * Aplica um evento do Stripe ao estado das reservas.
 * Idempotente: cada evento e registado em WebhookEvent e ignorado se repetido.
 */
export async function applyStripeEvent(db: Db, event: Stripe.Event): Promise<WebhookOutcome> {
  const seen = await db.webhookEvent.findUnique({ where: { id: event.id } })
  if (seen) return { handled: true, duplicate: true }

  const outcome = await transition(db, event)
  await db.webhookEvent.create({ data: { id: event.id, type: event.type } })
  return outcome
}

async function transition(db: Db, event: Stripe.Event): Promise<WebhookOutcome> {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId ?? session.client_reference_id
      if (!bookingId) return { handled: false }

      let status: BookingStatus
      if (event.type === "checkout.session.expired") status = "EXPIRED"
      else if (event.type === "checkout.session.async_payment_failed") status = "FAILED"
      else if (session.payment_status === "paid" || session.payment_status === "no_payment_required") status = "PAID"
      else status = "AWAITING_PAYMENT" // ex.: referencia Multibanco gerada, ainda por pagar

      return setStatus(db, bookingId, status, {
        paymentIntentId: paymentIntentId(session.payment_intent),
        expectedAmount: session.amount_total,
      })
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge
      const intentId = paymentIntentId(charge.payment_intent)
      if (!intentId || !charge.refunded) return { handled: false } // reembolso parcial: tratar manualmente
      const booking = await db.booking.findUnique({ where: { paymentIntentId: intentId }, select: { id: true } })
      if (!booking) return { handled: false }
      return setStatus(db, booking.id, "REFUNDED", {})
    }

    default:
      return { handled: false }
  }
}

async function setStatus(
  db: Db,
  bookingId: string,
  status: BookingStatus,
  extra: { paymentIntentId?: string | null; expectedAmount?: number | null },
): Promise<WebhookOutcome> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true, amountCents: true },
  })
  if (!booking) return { handled: false, bookingId }

  if (status === "PAID" && extra.expectedAmount != null && extra.expectedAmount !== booking.amountCents) {
    console.error(`[payments] Amount mismatch for ${bookingId}: paid ${extra.expectedAmount}, expected ${booking.amountCents}`)
    return { handled: false, bookingId }
  }

  if (booking.status === status || !ALLOWED_FROM[status].includes(booking.status)) {
    return { handled: true, bookingId, status: booking.status }
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status,
      ...(extra.paymentIntentId ? { paymentIntentId: extra.paymentIntentId } : {}),
      ...(status === "PAID" ? { paidAt: new Date(), expiresAt: null } : {}),
    },
  })

  return { handled: true, bookingId, status, becamePaid: status === "PAID" }
}
