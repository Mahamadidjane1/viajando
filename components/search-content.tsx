"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowRight, Info, Loader2, SearchX } from "lucide-react"
import { searchFlightsAction, type SearchResponse } from "@/app/actions/flight-search"
import { SearchFilters, TIME_WINDOWS, type Filters } from "@/components/search-filters"
import { DateNavigation } from "@/components/date-navigation"
import { TicketCard } from "@/components/ticket-card"
import { Button } from "@/components/ui/button"
import { formatDay } from "@/lib/format"
import type { TransportType } from "@/lib/offer-utils"

type SortKey = "recommended" | "price_asc" | "duration_asc" | "departure_asc"

const EMPTY_FILTERS: Filters = { types: [], directOnly: false, maxPriceCents: null, timeWindows: [] }

export function SearchContent({ dictionary, lang }: { dictionary: any; lang: string }) {
  const searchParams = useSearchParams()
  const origin = searchParams.get("origin")?.toUpperCase() ?? ""
  const destination = searchParams.get("destination")?.toUpperCase() ?? ""
  const date = searchParams.get("date") ?? ""
  const hasQuery = Boolean(origin && destination && date)

  const [response, setResponse] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(hasQuery)
  const [sortBy, setSortBy] = useState<SortKey>("recommended")
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  useEffect(() => {
    if (!hasQuery) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setFilters(EMPTY_FILTERS)

    searchFlightsAction({ origin, destination, date })
      .then((result) => !cancelled && setResponse(result))
      .catch(() =>
        !cancelled &&
        setResponse({ status: "unavailable", offers: [], message: "Não foi possível pesquisar. Verifique a ligação e tente novamente." }),
      )
      .finally(() => !cancelled && setIsLoading(false))

    return () => {
      cancelled = true
    }
  }, [hasQuery, origin, destination, date])

  const offers = response?.offers ?? []
  const availableTypes = useMemo(() => [...new Set(offers.map((o) => o.type))] as TransportType[], [offers])
  const priceRange = useMemo(() => {
    if (!offers.length) return null
    const prices = offers.map((o) => o.priceCents)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [offers])

  const visible = useMemo(() => {
    const filtered = offers.filter((offer) => {
      if (filters.types.length && !filters.types.includes(offer.type)) return false
      if (filters.directOnly && offer.stops > 0) return false
      if (filters.maxPriceCents != null && offer.priceCents > filters.maxPriceCents) return false
      if (filters.timeWindows.length) {
        const hour = Number(offer.departureAt.slice(11, 13))
        if (!filters.timeWindows.some((w) => hour >= TIME_WINDOWS[w].from && hour < TIME_WINDOWS[w].to)) return false
      }
      return true
    })

    const sorters: Record<SortKey, (a: (typeof offers)[number], b: (typeof offers)[number]) => number> = {
      recommended: (a, b) => a.priceCents + a.durationMinutes * 20 - (b.priceCents + b.durationMinutes * 20),
      price_asc: (a, b) => a.priceCents - b.priceCents,
      duration_asc: (a, b) => a.durationMinutes - b.durationMinutes,
      departure_asc: (a, b) => a.departureAt.localeCompare(b.departureAt),
    }
    return [...filtered].sort(sorters[sortBy])
  }, [offers, filters, sortBy])

  const buildHref = (newDate: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", newDate)
    return `/${lang}/search?${params.toString()}`
  }

  const filterPanel = (
    <SearchFilters
      filters={filters}
      onChange={setFilters}
      availableTypes={availableTypes}
      priceRange={priceRange}
      currency={offers[0]?.currency ?? "EUR"}
      lang={lang}
    />
  )

  if (!hasQuery) {
    return (
      <main className="container mx-auto flex-1 px-4 py-16 text-center">
        <SearchX className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden />
        <h1 className="mb-2 text-xl font-semibold text-gray-900">Indique origem, destino e data</h1>
        <p className="mb-6 text-gray-500">Use o formulário de pesquisa na página inicial.</p>
        <Button asChild>
          <Link href={`/${lang}`}>Nova pesquisa</Link>
        </Button>
      </main>
    )
  }

  return (
    <>
      <div className="bg-primary py-4 text-primary-foreground shadow-md">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 md:flex-row">
          <h1 className="flex items-center gap-3 text-lg font-medium">
            {origin} <ArrowRight className="h-5 w-5 opacity-80" aria-label="para" /> {destination}
          </h1>
          <p className="text-sm opacity-90">
            {dictionary.search?.departure ?? "Ida"}: {formatDay(date, lang)} · 1 {dictionary.search?.passengers ?? "passageiro"}
          </p>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/${lang}`}>Alterar pesquisa</Link>
          </Button>
        </div>
      </div>

      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-64">
            {/* Em ecras pequenos os filtros ficam recolhidos para os resultados aparecerem primeiro */}
            <details className="rounded-lg border border-gray-100 bg-white shadow-sm lg:hidden">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700">Filtros</summary>
              <div className="border-t border-gray-100 p-3">{filterPanel}</div>
            </details>
            <div className="hidden lg:block">{filterPanel}</div>
          </aside>

          <div className="flex-1 space-y-4">
            <DateNavigation lang={lang} date={date} buildHref={buildHref} />

            <div className="flex items-center justify-between py-2">
              <h2 className="text-lg font-semibold text-gray-900" aria-live="polite">
                {isLoading
                  ? (dictionary.common?.loading ?? "A carregar...")
                  : `${visible.length} ${dictionary.common?.results_found ?? "resultados encontrados"}`}
              </h2>
              <label className="flex items-center gap-2 text-sm text-gray-500">
                {dictionary.common?.sort_by ?? "Ordenar por"}:
                <select
                  className="cursor-pointer border-none bg-transparent text-sm font-medium text-gray-900 focus:ring-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                >
                  <option value="recommended">{dictionary.common?.recommended ?? "Recomendado"}</option>
                  <option value="price_asc">{dictionary.common?.cheapest ?? "Mais barato"}</option>
                  <option value="duration_asc">{dictionary.common?.fastest ?? "Mais rápido"}</option>
                  <option value="departure_asc">Partida mais cedo</option>
                </select>
              </label>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden />
                <p className="text-muted-foreground">{dictionary.common?.loading ?? "A carregar..."}</p>
              </div>
            ) : response && "message" in response ? (
              <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden />
                <p>{response.message}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {response?.status === "demo" && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <Info className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden />
                    <p>
                      <strong>Modo demonstração:</strong> estes resultados são fictícios porque o fornecedor de
                      viagens não está configurado. Não correspondem a lugares reais.
                    </p>
                  </div>
                )}

                {visible.map((offer) => (
                  <TicketCard key={offer.id} offer={offer} lang={lang} />
                ))}

                {visible.length === 0 && (
                  <div className="rounded-lg border border-gray-100 bg-white py-12 text-center shadow-sm">
                    <p className="text-lg font-medium text-gray-900">
                      {dictionary.common?.no_results ?? "Nenhum resultado encontrado"}
                    </p>
                    <p className="mt-2 text-gray-500">
                      {offers.length > 0
                        ? "Nenhuma opção corresponde aos filtros escolhidos."
                        : (dictionary.common?.try_changing ?? "Tente alterar os seus critérios de pesquisa")}
                    </p>
                    {offers.length > 0 && (
                      <Button variant="outline" className="mt-4" onClick={() => setFilters(EMPTY_FILTERS)}>
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
