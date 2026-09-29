import Link from "next/link"
import { Calendar, Clock, Plane, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingProgress } from "@/components/booking-progress"
import { CheckoutForm } from "@/components/checkout-form"
import { getStoredOffer, formatDuration, toPublicOffer } from "@/lib/offers"
import { requireUser } from "@/lib/session"
import { formatMoney } from "@/lib/money"
import { formatDay, formatTime } from "@/lib/format"
import type { Locale } from "@/i18n-config"

export const metadata = { title: "Concluir reserva | Viajando", robots: { index: false } }

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ offer?: string }>
}) {
  const { lang } = await params
  const { offer: offerId = "" } = await searchParams
  const user = await requireUser(lang, `/${lang}/book?offer=${encodeURIComponent(offerId)}`)

  const stored = await getStoredOffer(offerId)
  if (!stored) {
    return (
      <main className="container mx-auto max-w-xl px-4 py-16 text-center">
        <Clock className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Esta oferta expirou</h1>
        <p className="mb-6 text-gray-600">
          Os preços mudam com frequência, por isso cada oferta só é válida durante 30 minutos. Faça uma nova pesquisa
          para ver os preços atualizados.
        </p>
        <Button asChild>
          <Link href={`/${lang}`}>Nova pesquisa</Link>
        </Button>
      </main>
    )
  }

  const offer = toPublicOffer(stored)
  const total = formatMoney(offer.priceCents, offer.currency, lang)

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <BookingProgress currentStep={1} />

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Complete a sua reserva</h1>
          <p className="text-gray-600">Preencha os dados do passageiro tal como constam no documento de identificação.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Detalhes da viagem</h2>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{offer.origin}</div>
                  <div className="text-sm text-gray-500">{formatTime(offer.departureAt, lang)}</div>
                </div>
                <div className="flex flex-1 items-center">
                  <div className="h-px flex-1 bg-gray-300" />
                  <Plane className="mx-2 h-5 w-5 text-primary" aria-hidden />
                  <div className="h-px flex-1 bg-gray-300" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{offer.destination}</div>
                  <div className="text-sm text-gray-500">{formatTime(offer.arrivalAt, lang)}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {formatDay(offer.departureAt, lang)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden />
                  {formatDuration(offer.durationMinutes)} · {offer.stops === 0 ? "Direto" : `${offer.stops} escala(s)`}
                </span>
                <span>{offer.carrierName}</span>
              </div>
              {offer.source === "demo" && (
                <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                  Oferta de demonstração: use um cartão de teste do Stripe (4242 4242 4242 4242).
                </p>
              )}
            </section>

            <CheckoutForm offerId={offer.id} lang={lang} defaultEmail={user.email ?? ""} total={total} />
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-20 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              <div className="space-y-4 p-6">
                <h2 className="text-lg font-bold text-gray-900">Resumo</h2>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Bilhete adulto (x1)</span>
                  <span>{total}</span>
                </div>
                <div className="flex items-end justify-between border-t pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-primary">{total}</span>
                    <span className="text-xs text-gray-500">Taxas incluídas</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  O preço é confirmado com a companhia antes do pagamento. Se mudar, será avisado.
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
                <ShieldCheck className="h-4 w-4 text-green-600" aria-hidden />
                Pagamento seguro processado pelo Stripe. Não guardamos dados do cartão.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
