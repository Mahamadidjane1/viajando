import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
  })
}

export async function POST(req: Request) {
  const stripe = getStripeClient()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Stripe webhook is not configured", { status: 503 })
  }

  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          paymentId: session.payment_intent as string,
        },
      })
    }
  }

  return new NextResponse(null, { status: 200 })
}
