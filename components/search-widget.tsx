"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRightLeft, Bus, CalendarDays, Loader2, Plane, Search, Train } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { airports } from "@/lib/airports"
import type { Locale } from "@/i18n-config"

const transportModes = [
  { value: "flight", label: "Voos", icon: Plane },
  { value: "train", label: "Comboios", icon: Train },
  { value: "bus", label: "Autocarros", icon: Bus },
] as const

export function SearchWidget({ lang }: { lang: Locale }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [date, setDate] = React.useState("")
  const [mode, setMode] = React.useState<(typeof transportModes)[number]["value"]>("flight")
  const [error, setError] = React.useState("")

  const isSameRoute = origin !== "" && origin === destination
  const isFormValid = origin !== "" && destination !== "" && date !== "" && !isSameRoute

  const swapRoute = () => {
    setOrigin(destination)
    setDestination(origin)
    setError("")
  }

  const handleSearch = () => {
    if (!origin || !destination || !date) {
      setError("Preencha origem, destino e data de partida.")
      return
    }

    if (isSameRoute) {
      setError("Escolha uma origem e um destino diferentes.")
      return
    }

    setError("")
    setIsLoading(true)

    const searchParams = new URLSearchParams({
      type: mode,
      origin,
      destination,
      date,
    })

    router.push(`/${lang}/search?${searchParams.toString()}`)
  }

  return (
    <section
      aria-label="Pesquisa de viagens"
      className="mx-auto w-full max-w-5xl rounded-lg border border-border bg-background p-4 shadow-sm md:p-5"
    >
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Tipo de transporte">
        {transportModes.map((item) => {
          const Icon = item.icon
          const isActive = mode === item.value

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setMode(item.value)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_180px_150px] md:items-end">
        <div className="space-y-1.5">
          <label htmlFor="origin" className="text-sm font-medium text-foreground">
            Origem
          </label>
          <select
            id="origin"
            value={origin}
            onChange={(event) => {
              setOrigin(event.target.value)
              setError("")
            }}
            aria-invalid={Boolean(error && !origin)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          >
            <option value="">Selecionar origem</option>
            {airports.map((airport) => (
              <option key={airport.value} value={airport.value}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-start md:justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11"
            onClick={swapRoute}
            disabled={!origin && !destination}
            aria-label="Trocar origem e destino"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="destination" className="text-sm font-medium text-foreground">
            Destino
          </label>
          <select
            id="destination"
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value)
              setError("")
            }}
            aria-invalid={Boolean(error && (!destination || isSameRoute))}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
          >
            <option value="">Selecionar destino</option>
            {airports.map((airport) => (
              <option key={airport.value} value={airport.value}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="departure-date" className="text-sm font-medium text-foreground">
            Partida
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="departure-date"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value)
                setError("")
              }}
              aria-invalid={Boolean(error && !date)}
              className="h-11 pl-9"
            />
          </div>
        </div>

        <Button type="button" className="h-11 w-full gap-2" onClick={handleSearch} disabled={isLoading || !isFormValid}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Pesquisar
        </Button>
      </div>

      <div className="mt-3 min-h-5" aria-live="polite">
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
      </div>
    </section>
  )
}
