"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { z } from "zod"
import Stripe from "stripe"
import { bookingSchema } from "@/lib/validations/booking"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function createBooking(data: z.infer<typeof bookingSchema>) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return { error: "Utilizador não autenticado" }
  }

  const validated = bookingSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Dados inválidos" }
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        flightOfferId: validated.data.flightOfferId,
        provider: "amadeus",
        origin: validated.data.origin,
        destination: validated.data.destination,
        departureDate: new Date(validated.data.departureDate),
        arrivalDate: new Date(validated.data.arrivalDate),
        carrierCode: validated.data.carrierCode,
        duration: validated.data.duration,
        amount: validated.data.amount,
        currency: validated.data.currency,
        passengers: validated.data.passengers,
        status: "PENDING",
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin/bookings")

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return { error: "Falha ao processar a reserva" }
  }
}

export async function createBookingWithStripe(data: z.infer<typeof bookingSchema>) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return { error: "Utilizador não autenticado. Por favor, faça login." }
  }

  const validated = bookingSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Dados inválidos" }
  }

  try {
    // Create booking with PENDING status
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        flightOfferId: `${validated.data.origin}-${validated.data.destination}-${Date.now()}`,
        provider: "viajando",
        origin: validated.data.origin,
        destination: validated.data.destination,
        departureDate: new Date(validated.data.departureDate),
        arrivalDate: new Date(validated.data.departureDate), // Same day for now
        carrierCode: "VJ",
        duration: "2h 15m",
        amount: validated.data.price,
        currency: "EUR",
        passengers: validated.data.passenger,
        status: "PENDING",
      },
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Voo ${validated.data.origin} → ${validated.data.destination}`,
              description: `Viagem para ${validated.data.destination} em ${validated.data.departureDate}`,
            },
            unit_amount: Math.round(validated.data.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
      metadata: {
        bookingId: booking.id,
        userId: session.user.id,
      },
    })

    return { success: true, checkoutUrl: checkoutSession.url, bookingId: booking.id }
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return { error: "Falha ao processar a reserva. Por favor, tente novamente." }
  }
}

export async function getUserBookings() {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return { error: "Não autenticado" }
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, bookings }
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return { error: "Falha ao buscar reservas" }
  }
}

export async function getAllBookings() {
  const session = await auth()

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Sem permissão" }
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, bookings }
  } catch (error) {
    console.error("[v0] Error fetching all bookings:", error)
    return { error: "Falha ao buscar reservas" }
  }
}

export async function getAdminStats() {
  const session = await auth()

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "Sem permissão" }
  }

  try {
    const [totalRevenue, totalBookings, totalUsers, paidBookings] = await Promise.all([
      prisma.booking.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.booking.count(),
      prisma.user.count(),
      prisma.booking.count({ where: { status: "PAID" } }),
    ])

    return {
      success: true,
      stats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBookings,
        totalUsers,
        paidBookings,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching admin stats:", error)
    return { error: "Falha ao buscar estatísticas" }
  }
}
