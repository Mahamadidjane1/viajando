import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatTripDate } from "@/lib/format"

function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Navegacao entre dias proximos da data pesquisada (sem precos inventados). */
export function DateNavigation({
  lang,
  date,
  buildHref,
}: {
  lang: string
  date: string
  buildHref: (date: string) => string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const days = [-3, -2, -1, 0, 1, 2, 3].map((offset) => shiftDate(date, offset))

  return (
    <nav aria-label="Datas próximas" className="flex items-center gap-1 rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <DayArrow href={shiftDate(date, -1) >= today ? buildHref(shiftDate(date, -1)) : null} label="Dia anterior">
        <ChevronLeft className="h-4 w-4" />
      </DayArrow>
      <div className="grid flex-1 grid-cols-3 gap-1 sm:grid-cols-7">
        {days.map((day, index) => {
          const disabled = day < today
          const selected = day === date
          const content = (
            <>
              <span className="block text-xs capitalize">{formatTripDate(day, lang, { weekday: "short" })}</span>
              <span className="block text-sm font-semibold">{formatTripDate(day, lang, { day: "numeric", month: "short" })}</span>
            </>
          )
          const className = cn(
            "rounded-md px-2 py-2 text-center transition-colors",
            index < 2 || index > 4 ? "hidden sm:block" : "",
            selected ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-50",
            disabled && "pointer-events-none opacity-40",
          )
          return disabled || selected ? (
            <div key={day} className={className} aria-current={selected ? "date" : undefined}>
              {content}
            </div>
          ) : (
            <Link key={day} href={buildHref(day)} className={className}>
              {content}
            </Link>
          )
        })}
      </div>
      <DayArrow href={buildHref(shiftDate(date, 1))} label="Dia seguinte">
        <ChevronRight className="h-4 w-4" />
      </DayArrow>
    </nav>
  )
}

function DayArrow({ href, label, children }: { href: string | null; label: string; children: React.ReactNode }) {
  const className = "flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50"
  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  ) : (
    <span aria-hidden className={cn(className, "opacity-30")}>
      {children}
    </span>
  )
}
