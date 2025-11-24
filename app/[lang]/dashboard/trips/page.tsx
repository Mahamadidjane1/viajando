import { Ticket, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const TRIPS = [
  {
    id: "1",
    status: "upcoming",
    origin: "Lisboa (LIS)",
    destination: "Madrid (MAD)",
    date: "24 Nov 2025",
    time: "08:00",
    carrier: "TAP Air Portugal",
    price: 85.0,
  },
  {
    id: "2",
    status: "completed",
    origin: "Porto (OPO)",
    destination: "Lisboa (LIS)",
    date: "10 Out 2025",
    time: "09:30",
    carrier: "Comboios de Portugal",
    price: 35.5,
  },
  {
    id: "3",
    status: "completed",
    origin: "Paris (CDG)",
    destination: "Porto (OPO)",
    date: "15 Set 2025",
    time: "14:20",
    carrier: "EasyJet",
    price: 120.0,
  },
]

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">As Minhas Viagens</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            Todas
          </Button>
          <Button variant="ghost" size="sm">
            Agendadas
          </Button>
          <Button variant="ghost" size="sm">
            Anteriores
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {TRIPS.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.date}</span>
                    <span className="mx-1">•</span>
                    <Clock className="w-4 h-4" />
                    <span>{trip.time}</span>
                  </div>
                  {trip.status === "upcoming" ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                      AGENDADA
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                      CONCLUÍDA
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-bold text-lg text-gray-900">{trip.origin}</span>
                    </div>
                    <div className="w-0.5 h-4 bg-gray-200 ml-2 my-1" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-lg text-gray-900">{trip.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Ticket className="w-4 h-4" />
                  <span>{trip.carrier}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:justify-center justify-between gap-4 md:border-l md:pl-6 border-gray-100 pt-4 md:pt-0 border-t md:border-t-0 mt-4 md:mt-0">
                <div className="text-right md:text-center">
                  <div className="text-xl font-bold text-gray-900">€{trip.price.toFixed(2)}</div>
                </div>
                {trip.status === "upcoming" ? (
                  <Button className="w-full md:w-auto">Ver Bilhete</Button>
                ) : (
                  <Button variant="outline" className="w-full md:w-auto bg-transparent">
                    Ver Recibo
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
