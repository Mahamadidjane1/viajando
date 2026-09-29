import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { prisma } from "@/lib/db"
import { getStripe } from "@/lib/stripe"
import { applyStripeEvent } from "@/lib/payments"
import { sendBookingConfirmation } from "@/lib/email"

export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return new NextResponse("Stripe webhook is not configured", { status: 503 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) return new NextResponse("Missing signature", { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret)
  } catch {
    return new NextResponse("Invalid signature", { status: 400 })
  }

  try {
    const outcome = await applyStripeEvent(prisma, event)

    if (outcome.becamePaid && outcome.bookingId) {
      await notifyPaid(outcome.bookingId)
    }

    return NextResponse.json({ received: true, duplicate: outcome.duplicate ?? false })
  } catch (error) {
    // 500 faz o Stripe repetir o envio mais tarde
    console.error(`[stripe-webhook] Failed to process ${event.type} ${event.id}:`, error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}

async function notifyPaid(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) return

  const [passenger] = booking.passengers as Array<{ firstName: string; lastName: string; email: string }>
  if (!passenger?.email) return

  await sendBookingConfirmation({
    id: booking.id,
    origin: booking.origin,
    destination: booking.destination,
    departureDate: booking.departureDate,
    carrierName: booking.carrierName,
    amountCents: booking.amountCents,
    currency: booking.currency,
    locale: booking.locale,
    email: passenger.email,
    passengerName: `${passenger.firstName} ${passenger.lastName}`,
  })
}
