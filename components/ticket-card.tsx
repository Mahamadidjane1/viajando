import Link from "next/link"
import { ArrowRight, Bus, Clock, Plane, Train } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/lib/money"
import { formatDuration, type TravelOffer } from "@/lib/offer-utils"
import { formatTime } from "@/lib/format"

const TYPE_ICON = { flight: Plane, train: Train, bus: Bus } as const

export function TicketCard({ offer, lang }: { offer: TravelOffer; lang: string }) {
  const Icon = TYPE_ICON[offer.type]
  const arrivesNextDay = offer.arrivalAt.slice(0, 10) > offer.departureAt.slice(0, 10)

  return (
    <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <div className="flex flex-col gap-6 p-4 md:flex-row md:p-6">
        <div className="flex flex-shrink-0 items-center gap-3 md:w-32 md:flex-col md:items-start">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-xs font-bold text-gray-700 md:h-12 md:w-12"
            aria-hidden
          >
            {offer.carrierCode.slice(0, 3)}
          </div>
          <span className="line-clamp-2 text-xs font-medium text-gray-600">{offer.carrierName}</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">{formatTime(offer.departureAt, lang)}</div>
            <div className="flex flex-1 flex-col items-center px-4">
              <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" aria-hidden />
                {formatDuration(offer.durationMinutes)}
              </div>
              <div className="relative h-[2px] w-full bg-gray-200">
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-300" />
                <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-300" />
                <Icon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5 text-gray-400" aria-hidden />
              </div>
              <div className="mt-1 text-xs font-medium text-gray-500">
                {offer.stops === 0 ? "Direto" : `${offer.stops} ${offer.stops === 1 ? "escala" : "escalas"}`}
              </div>
            </div>
            <div className="text-right text-2xl font-bold text-gray-900">
              {formatTime(offer.arrivalAt, lang)}
              {arrivesNextDay && <sup className="ml-0.5 text-xs font-medium text-orange-600">+1</sup>}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{offer.departureStation}</span>
            <span>{offer.arrivalStation}</span>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-row items-center justify-between gap-4 border-t border-gray-100 pt-4 md:w-40 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="text-left md:text-right">
            <div className="text-2xl font-bold text-primary">{formatMoney(offer.priceCents, offer.currency, lang)}</div>
            <div className="text-xs text-gray-500">por passageiro, taxas incluídas</div>
          </div>
          <Button asChild className="gap-2">
            <Link href={`/${lang}/book?offer=${offer.id}`}>
              Selecionar <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
