"use client"

import { Bus, Plane, Train } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import type { TransportType } from "@/lib/offer-utils"
import { formatMoney } from "@/lib/money"
import { cn } from "@/lib/utils"

export type TimeWindow = "morning" | "afternoon" | "evening"

export type Filters = {
  types: TransportType[]
  directOnly: boolean
  maxPriceCents: number | null
  timeWindows: TimeWindow[]
}

export const TIME_WINDOWS: Record<TimeWindow, { label: string; from: number; to: number }> = {
  morning: { label: "Manhã", from: 0, to: 12 },
  afternoon: { label: "Tarde", from: 12, to: 18 },
  evening: { label: "Noite", from: 18, to: 24 },
}

const TYPE_OPTIONS = [
  { value: "flight", label: "Voos", icon: Plane },
  { value: "train", label: "Comboios", icon: Train },
  { value: "bus", label: "Autocarros", icon: Bus },
] as const

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

export function SearchFilters({
  filters,
  onChange,
  availableTypes,
  priceRange,
  currency,
  lang,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
  availableTypes: TransportType[]
  priceRange: { min: number; max: number } | null
  currency: string
  lang: string
}) {
  const maxPrice = filters.maxPriceCents ?? priceRange?.max ?? 0

  return (
    <div className="space-y-6">
      {availableTypes.length > 1 && (
        <fieldset className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <legend className="sr-only">Tipo de transporte</legend>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Transporte</h3>
          <div className="space-y-2">
            {TYPE_OPTIONS.filter((option) => availableTypes.includes(option.value)).map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.types.includes(option.value)}
                  onChange={() => onChange({ ...filters, types: toggle(filters.types, option.value) })}
                  className="rounded text-primary focus:ring-primary"
                />
                <option.icon className="h-4 w-4 text-gray-500" aria-hidden />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Escalas</h3>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={filters.directOnly}
            onChange={(e) => onChange({ ...filters, directOnly: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Apenas diretos</span>
        </label>
      </fieldset>

      {priceRange && priceRange.max > priceRange.min && (
        <fieldset className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Preço máximo</h3>
          <Slider
            value={[maxPrice]}
            min={priceRange.min}
            max={priceRange.max}
            step={100}
            onValueChange={([value]) => onChange({ ...filters, maxPriceCents: value })}
            aria-label="Preço máximo"
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatMoney(priceRange.min, currency, lang)}</span>
            <span className="font-medium">até {formatMoney(maxPrice, currency, lang)}</span>
          </div>
        </fieldset>
      )}

      <fieldset className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Hora de partida</h3>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(TIME_WINDOWS) as TimeWindow[]).map((key) => {
            const active = filters.timeWindows.includes(key)
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, timeWindows: toggle(filters.timeWindows, key) })}
                className={cn(
                  "rounded-md border px-2 py-2 text-xs transition-colors",
                  active ? "border-primary bg-primary/5 font-semibold text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300",
                )}
              >
                {TIME_WINDOWS[key].label}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
