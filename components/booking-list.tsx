import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plane, Calendar, Clock } from "lucide-react"
import type { Booking } from "@prisma/client"

export function BookingList({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="font-bold text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-gray-500">As suas reservas aparecerão aqui</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant={booking.status === "PAID" ? "default" : "secondary"}>{booking.status}</Badge>
            <span className="text-sm text-gray-500">#{booking.id.slice(0, 8)}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{booking.origin}</div>
              <div className="text-sm text-gray-500">{format(new Date(booking.departureDate), "HH:mm")}</div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-px bg-gray-300 flex-1"></div>
              <Plane className="h-5 w-5 text-primary mx-2" />
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{booking.destination}</div>
              <div className="text-sm text-gray-500">{format(new Date(booking.arrivalDate), "HH:mm")}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(booking.departureDate), "PPP", { locale: pt })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {booking.duration}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">
                {booking.currency} {booking.amount.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
