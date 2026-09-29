import { Calendar, Clock, Plane } from "lucide-react"
import type { Booking } from "@prisma/client"
import { BookingStatusBadge } from "@/components/booking-status-badge"
import { formatMoney } from "@/lib/money"
import { formatDay, formatTime } from "@/lib/format"

export function TripCard({ booking, lang }: { booking: Booking; lang: string }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" aria-hidden />
              {formatDay(booking.departureDate, lang)}
            </span>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 text-center">
              <div className="text-xl font-bold text-gray-900">{formatTime(booking.departureDate, lang)}</div>
              <div className="text-xs text-gray-500">{booking.origin}</div>
            </div>
            <div className="flex flex-1 flex-col items-center px-2">
              <div className="mb-1 flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" aria-hidden />
                {booking.duration}
              </div>
              <div className="relative h-[2px] w-full bg-gray-200">
                <Plane className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5 text-gray-300" aria-hidden />
              </div>
              <div className="mt-1 text-xs text-gray-400">{booking.carrierName ?? booking.carrierCode}</div>
            </div>
            <div className="w-16 text-center">
              <div className="text-xl font-bold text-gray-900">{formatTime(booking.arrivalDate, lang)}</div>
              <div className="text-xs text-gray-500">{booking.destination}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 md:w-40 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="text-xs text-gray-500">
            Ref. <span className="font-mono font-semibold text-gray-700">{booking.id.slice(-8).toUpperCase()}</span>
            {booking.pnr && <div>PNR {booking.pnr}</div>}
          </div>
          <div className="text-lg font-bold text-gray-900">{formatMoney(booking.amountCents, booking.currency, lang)}</div>
        </div>
      </div>
    </article>
  )
}
