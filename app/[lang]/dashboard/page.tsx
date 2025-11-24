import Link from "next/link"
import { ArrowRight, Ticket, Wallet, Calendar, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/auth"
import { getUserBookings } from "@/app/actions/booking-actions"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { redirect } from "next/navigation"

export default async function DashboardPage({ params }: { params: { lang: string } }) {
  const session = await auth()

  if (!session || !session.user) {
    redirect(`/${params.lang}/login`)
  }

  const result = await getUserBookings()
  const bookings = result.success ? result.bookings : []

  const upcomingBookings = bookings.filter((b) => new Date(b.departureDate) > new Date() && b.status !== "CANCELLED")
  const nextTrip = upcomingBookings[0]
  const totalTrips = bookings.filter((b) => b.status === "PAID").length
  const totalCashback = totalTrips * 2.5 // Mock cashback calculation

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {session.user.name || "Viajante"}!</h1>
        <Button asChild>
          <Link href={`/${params.lang}/search`}>Nova Pesquisa</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Próxima Viagem</div>
              <div className="font-bold text-gray-900">
                {nextTrip ? format(new Date(nextTrip.departureDate), "d MMM", { locale: pt }) : "Nenhuma"}
              </div>
            </div>
          </div>
          {nextTrip && (
            <div className="text-sm font-medium text-gray-900">
              {nextTrip.origin} → {nextTrip.destination}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Saldo Cashback</div>
              <div className="font-bold text-gray-900">€{totalCashback.toFixed(2)}</div>
            </div>
          </div>
          <Link
            href={`/${params.lang}/dashboard/wallet`}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Ver histórico <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Viagens em 2025</div>
              <div className="font-bold text-gray-900">
                {totalTrips} {totalTrips === 1 ? "Viagem" : "Viagens"}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {totalTrips > 0 ? `Total: ${(totalTrips * 615).toLocaleString()} km` : "Nenhuma viagem ainda"}
          </div>
        </div>
      </div>

      {nextTrip ? (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Próxima Viagem</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(nextTrip.departureDate), "PPP", { locale: pt })}</span>
                  </div>
                  <Badge variant={nextTrip.status === "PAID" ? "default" : "secondary"}>
                    {nextTrip.status === "PAID" ? "CONFIRMADO" : nextTrip.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center w-16">
                    <div className="text-xl font-bold text-gray-900">
                      {format(new Date(nextTrip.departureDate), "HH:mm")}
                    </div>
                    <div className="text-xs text-gray-500">{nextTrip.origin}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4">
                    <div className="text-xs text-gray-400 mb-1">{nextTrip.duration}</div>
                    <div className="w-full h-[2px] bg-gray-200 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
                        <Plane className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{nextTrip.carrierCode}</div>
                  </div>
                  <div className="text-center w-16">
                    <div className="text-xl font-bold text-gray-900">
                      {format(new Date(nextTrip.arrivalDate), "HH:mm")}
                    </div>
                    <div className="text-xs text-gray-500">{nextTrip.destination}</div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-2">
                <Button className="w-full">Ver Bilhete</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Gerir Reserva
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Próxima Viagem</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Nenhuma viagem agendada</h3>
            <p className="text-gray-500 mb-4">Comece a planear a sua próxima aventura!</p>
            <Button asChild>
              <Link href={`/${params.lang}/search`}>Pesquisar Voos</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Atividade Recente</h2>
        {bookings.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.status === "PAID" ? "Reserva Confirmada" : "Reserva Pendente"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.origin} - {booking.destination}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {booking.currency} {booking.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(booking.createdAt), "d MMM", { locale: pt })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Nenhuma atividade recente
          </div>
        )}
      </section>
    </div>
  )
}
