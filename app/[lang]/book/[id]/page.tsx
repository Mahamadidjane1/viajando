import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ItineraryDetails } from "@/components/itinerary-details"
import { PassengerForm } from "@/components/passenger-form"
import { SeatSelection } from "@/components/seat-selection"
import { BookingSummary } from "@/components/booking-summary"
import { ShieldCheck, Clock } from "lucide-react"
import { BookingProgress } from "@/components/booking-progress"

// Mock data for a specific ticket
const MOCK_TICKET = {
  id: "1",
  type: "flight",
  carrier: "TAP Air Portugal",
  carrierLogo: "/placeholder.svg?key=wug2g",
  flightNumber: "TP 1014",
  class: "Económica",
  baggage: "1 mala de mão (10kg)",
  departure: {
    station: "Lisboa (LIS)",
    terminal: "T1",
    time: "08:00",
    date: "24 Nov 2025",
  },
  arrival: {
    station: "Madrid (MAD)",
    terminal: "T4",
    time: "10:30",
    date: "24 Nov 2025",
  },
  duration: "1h 30m",
  price: {
    base: 65.0,
    taxes: 20.0,
    total: 85.0,
  },
}

export default function BookingPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <BookingProgress currentStep={1} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Detalhes da Viagem</h1>
              <div className="text-sm text-gray-500">Reserva ID: #TRV-{params.id}892</div>
            </div>

            {/* Itinerary Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-gray-900">Itinerário de Ida</span>
              </div>
              <div className="p-6">
                <ItineraryDetails data={MOCK_TICKET} />
              </div>
            </section>

            {/* Passenger Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="font-medium text-gray-900">Dados do Passageiro</span>
              </div>
              <div className="p-6">
                <PassengerForm />
              </div>
            </section>

            {/* Seat Selection */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  A
                </div>
                <span className="font-medium text-gray-900">Seleção de Lugar</span>
              </div>
              <div className="p-6">
                <SeatSelection />
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <BookingSummary data={MOCK_TICKET} />

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Compra Segura</p>
                  <p className="opacity-90">Seus dados estão protegidos com encriptação SSL de 256-bits.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
