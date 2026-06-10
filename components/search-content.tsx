"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { searchFlightsAction } from "@/app/actions/flight-search"
import { SearchFilters } from "@/components/search-filters"
import { DateNavigation } from "@/components/date-navigation"
import { TicketCard } from "@/components/ticket-card"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, Bus, Plane, Train, Loader2 } from "lucide-react"

const MOCK_RESULTS = [
  {
    id: "1",
    type: "flight",
    carrier: "TAP Air Portugal",
    carrierLogo: "/tap.jpg",
    departureTime: "08:00",
    arrivalTime: "10:30",
    departureStation: "LIS",
    arrivalStation: "MAD",
    duration: "1h 30m",
    stops: 0,
    price: 85,
    currency: "EUR",
  },
  {
    id: "2",
    type: "train",
    carrier: "Renfe",
    carrierLogo: "/renfe.jpg",
    departureTime: "09:15",
    arrivalTime: "16:45",
    departureStation: "Lisboa - Santa Apolónia",
    arrivalStation: "Madrid - Atocha",
    duration: "6h 30m",
    stops: 1,
    price: 45,
    currency: "EUR",
  },
  {
    id: "3",
    type: "bus",
    carrier: "FlixBus",
    carrierLogo: "/flixbus.jpg",
    departureTime: "10:00",
    arrivalTime: "19:00",
    departureStation: "Lisboa Oriente",
    arrivalStation: "Madrid Estação Sur",
    duration: "8h 00m",
    stops: 0,
    price: 29,
    currency: "EUR",
  },
  {
    id: "4",
    type: "flight",
    carrier: "Iberia",
    carrierLogo: "/iberian-landscape.png",
    departureTime: "14:20",
    arrivalTime: "16:50",
    departureStation: "LIS",
    arrivalStation: "MAD",
    duration: "1h 30m",
    stops: 0,
    price: 92,
    currency: "EUR",
  },
  {
    id: "5",
    type: "train",
    carrier: "Comboios de Portugal",
    carrierLogo: "/abstract-geometric-shapes.png",
    departureTime: "21:30",
    arrivalTime: "07:00",
    departureStation: "Lisboa - Oriente",
    arrivalStation: "Madrid - Chamartín",
    duration: "8h 30m",
    stops: 0,
    price: 35,
    currency: "EUR",
    isOvernight: true,
  },
]

export function SearchContent({ dictionary }: { dictionary: any }) {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("recommended")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true)
      setError("")

      try {
        const origin = searchParams.get("origin")
        const destination = searchParams.get("destination")
        const date = searchParams.get("date")

        if (origin && destination && date) {
          const response = await searchFlightsAction({ origin, destination, date })

          if (response.success && response.data && response.data.length > 0) {
            setResults(response.data)
          } else {
            if (response.error) setError(response.error)
            setResults(MOCK_RESULTS)
          }
        } else {
          setResults(MOCK_RESULTS)
        }
      } catch (err) {
        console.error("Error fetching flights:", err)
        setResults(MOCK_RESULTS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlights()
  }, [searchParams])

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price
    if (sortBy === "duration_asc") {
      const getMinutes = (d: string) => {
        const [h, m] = d.split("h ").map((p) => Number.parseInt(p))
        return h * 60 + (m || 0)
      }
      return getMinutes(a.duration) - getMinutes(b.duration)
    }
    return 0
  })

  return (
    <>
      <div className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-lg font-medium">
              <span>{searchParams.get("origin") || "Lisboa"}</span>
              <ArrowRightLeft className="h-5 w-5 opacity-80" />
              <span>{searchParams.get("destination") || "Madrid"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span>
                {dictionary.search?.departure || "Partida"}: {searchParams.get("date") || "24 Nov"}
              </span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>1 {dictionary.search?.passengers || "passageiro"}</span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>Económica</span>
            </div>
            <Button variant="secondary" size="sm" className="hidden md:flex">
              {dictionary.search?.search_button || "Pesquisar"}
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">{dictionary.search?.mode_flight || "Tipo de Transporte"}</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                  <Plane className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{dictionary.search?.mode_flight || "Voos"}</span>
                  <span className="ml-auto text-xs text-gray-400">€85+</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                  <Train className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{dictionary.search?.mode_train || "Comboios"}</span>
                  <span className="ml-auto text-xs text-gray-400">€35+</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                  <Bus className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{dictionary.search?.mode_bus || "Autocarros"}</span>
                  <span className="ml-auto text-xs text-gray-400">€29+</span>
                </label>
              </div>
            </div>

            <SearchFilters />
          </aside>

          <div className="flex-1 space-y-4">
            <DateNavigation />

            <div className="flex items-center justify-between py-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {isLoading
                  ? dictionary.common?.loading || "A carregar..."
                  : `${results.length} ${dictionary.common?.results_found || "resultados encontrados"}`}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{dictionary.common?.sort_by || "Ordenar por"}:</span>
                <select
                  className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">{dictionary.common?.recommended || "Recomendado"}</option>
                  <option value="price_asc">{dictionary.common?.cheapest || "Mais barato"}</option>
                  <option value="duration_asc">{dictionary.common?.fastest || "Mais rápido"}</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">{dictionary.common?.loading || "A carregar..."}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4 text-sm">
                    Nota: {error}. A mostrar resultados de exemplo.
                  </div>
                )}
                {sortedResults.map((result) => (
                  <TicketCard key={result.id} data={result} />
                ))}

                {!isLoading && sortedResults.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-lg font-medium text-gray-900">
                      {dictionary.common?.no_results || "Nenhum resultado encontrado"}
                    </p>
                    <p className="text-gray-500 mt-2">
                      {dictionary.common?.try_changing || "Tente alterar os seus critérios de pesquisa"}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 text-center">
              <Button variant="outline" className="w-full md:w-auto bg-transparent">
                {dictionary.common?.load_more || "Carregar mais"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
