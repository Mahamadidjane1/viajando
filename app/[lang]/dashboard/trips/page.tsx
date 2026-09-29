import Link from "next/link"
import { Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trip-card"
import { getUserBookings } from "@/app/actions/booking-actions"
import { cn } from "@/lib/utils"
import { requireUser } from "@/lib/session"

const TABS = [
  { key: "upcoming", label: "Agendadas" },
  { key: "past", label: "Anteriores" },
  { key: "all", label: "Todas" },
] as const

type Tab = (typeof TABS)[number]["key"]

export default async function TripsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { lang } = await params
  await requireUser(lang, `/${lang}/dashboard/trips`)
  const requested = (await searchParams).tab
  const tab: Tab = TABS.some((t) => t.key === requested) ? (requested as Tab) : "upcoming"

  const now = new Date()
  const bookings = (await getUserBookings()).filter((b) => {
    if (tab === "upcoming") return b.departureDate > now && b.status !== "CANCELLED" && b.status !== "EXPIRED"
    if (tab === "past") return b.departureDate <= now
    return true
  })
  if (tab === "upcoming") bookings.sort((a, b) => a.departureDate.getTime() - b.departureDate.getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">As minhas viagens</h1>
        <nav className="flex gap-2" aria-label="Filtrar viagens">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/${lang}/dashboard/trips?tab=${t.key}`}
              aria-current={tab === t.key ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                tab === t.key ? "border border-gray-200 bg-white font-semibold shadow-sm" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      {bookings.length ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <TripCard key={booking.id} booking={booking} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <Ticket className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden />
          <p className="mb-4 text-gray-500">Não há viagens nesta lista.</p>
          <Button asChild>
            <Link href={`/${lang}`}>Pesquisar viagens</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
