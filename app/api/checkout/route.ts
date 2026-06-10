import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
  })
}

export async function POST(req: Request) {
  try {
    const stripe = getStripeClient()
    if (!stripe) return new NextResponse("Stripe is not configured", { status: 503 })

    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { bookingId } = await req.json()

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, userId: session.user.id },
    })

    if (!booking) return new NextResponse("Reserva nao encontrada", { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Viagem ${booking.origin} para ${booking.destination}`,
              description: `Voo com ${booking.carrierCode}`,
            },
            unit_amount: Math.round(booking.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        bookingId: booking.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("[STRIPE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
