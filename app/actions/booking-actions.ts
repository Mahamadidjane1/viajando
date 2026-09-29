"use server"

import type { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getStripe } from "@/lib/stripe"
import { getAppUrl, isDemoDataEnabled } from "@/lib/env"
import { confirmFlightPrice } from "@/lib/amadeus-service"
import { decimalToCents } from "@/lib/money"
import { formatDuration, getStoredOffer, toPublicOffer } from "@/lib/offers"
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/booking"

/** Tempo que uma reserva pendente fica valida (minimo aceite pelo Stripe Checkout: 30 min). */
const CHECKOUT_TTL_MINUTES = 30

const STRIPE_LOCALES = { pt: "pt", en: "en", es: "es", fr: "fr" } as const

type CheckoutResult = { checkoutUrl: string } | { error: string; offerExpired?: boolean }

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente para continuar." }
  const userId = session.user.id

  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  const { offerId, lang, passenger } = parsed.data

  if (!(await rateLimit("checkout", userId, RATE_LIMITS.checkout))) {
    return { error: "Demasiadas tentativas de pagamento. Aguarde alguns minutos." }
  }

  const stripe = getStripe()
  if (!stripe) return { error: "Os pagamentos não estão disponíveis de momento." }

  const offer = await getStoredOffer(offerId)
  if (!offer) return { error: "Esta oferta expirou. Faça uma nova pesquisa.", offerExpired: true }

  // O preco cobrado e sempre o do servidor; para Amadeus e re-confirmado junto do fornecedor.
  let amountCents = offer.priceCents
  if (offer.source === "amadeus") {
    if (!offer.raw) return { error: "Esta oferta expirou. Faça uma nova pesquisa.", offerExpired: true }
    const priced = await confirmFlightPrice(offer.raw)
    const total = priced?.price?.grandTotal ?? priced?.price?.total
    if (!total) return { error: "Esta tarifa já não está disponível. Escolha outra opção.", offerExpired: true }
    amountCents = decimalToCents(total)
  } else if (!isDemoDataEnabled()) {
    return { error: "Esta oferta já não está disponível.", offerExpired: true }
  }

  const expiresAt = new Date(Date.now() + CHECKOUT_TTL_MINUTES * 60 * 1000 + 60 * 1000)
  const booking = await prisma.booking.create({
    data: {
      userId,
      provider: offer.source,
      providerRef: offer.providerRef,
      transportType: offer.type,
      origin: offer.origin,
      destination: offer.destination,
      departureDate: new Date(`${offer.departureAt}Z`),
      arrivalDate: new Date(`${offer.arrivalAt}Z`),
      duration: formatDuration(offer.durationMinutes),
      carrierCode: offer.carrierCode,
      carrierName: offer.carrierName,
      offerSnapshot: { ...toPublicOffer(offer), confirmedPriceCents: amountCents } as Prisma.InputJsonValue,
      amountCents,
      currency: offer.currency,
      expiresAt,
      locale: lang,
      passengers: [passenger],
    },
  })

  try {
    const appUrl = getAppUrl()
    const checkout = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        // Os metodos de pagamento (cartao, MB WAY, Multibanco...) sao geridos no Dashboard do Stripe.
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: offer.currency.toLowerCase(),
              unit_amount: amountCents,
              product_data: {
                name: `${offer.origin} → ${offer.destination} · ${offer.carrierName}`,
                description: `${offer.departureAt.replace("T", " ").slice(0, 16)} · ${passenger.firstName} ${passenger.lastName}`,
              },
            },
          },
        ],
        customer_email: passenger.email,
        client_reference_id: booking.id,
        locale: STRIPE_LOCALES[lang],
        expires_at: Math.floor(expiresAt.getTime() / 1000) - 60,
        success_url: `${appUrl}/${lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/${lang}/checkout/cancel?booking=${booking.id}`,
        metadata: { bookingId: booking.id, userId },
        payment_intent_data: { metadata: { bookingId: booking.id } },
      },
      { idempotencyKey: `checkout-${booking.id}` },
    )

    await prisma.booking.update({ where: { id: booking.id }, data: { stripeSessionId: checkout.id } })
    if (!checkout.url) throw new Error("Stripe did not return a checkout URL")
    return { checkoutUrl: checkout.url }
  } catch (error) {
    console.error("[booking] Error creating checkout:", error)
    await prisma.booking.update({ where: { id: booking.id }, data: { status: "FAILED" } })
    return { error: "Não foi possível iniciar o pagamento. Tente novamente." }
  }
}

export async function getUserBookings() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.booking.findMany({
    where: { userId: session.user.id, status: { notIn: ["FAILED"] } },
    orderBy: { departureDate: "desc" },
    take: 100,
  })
}
