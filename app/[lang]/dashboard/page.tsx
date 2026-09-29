import Link from "next/link"
import { Plane, Ticket, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trip-card"
import { getUserBookings } from "@/app/actions/booking-actions"
import { requireUser } from "@/lib/session"
import { formatMoney } from "@/lib/money"

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const user = await requireUser(lang)
  const bookings = await getUserBookings()

  const now = new Date()
  const upcoming = bookings
    .filter((b) => b.departureDate > now && (b.status === "PAID" || b.status === "AWAITING_PAYMENT"))
    .sort((a, b) => a.departureDate.getTime() - b.departureDate.getTime())
  const paid = bookings.filter((b) => b.status === "PAID")
  const totalSpent = paid.reduce((sum, b) => sum + b.amountCents, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name?.split(" ")[0] || "viajante"}!</h1>
        <Button asChild>
          <Link href={`/${lang}`}>Nova pesquisa</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat icon={Ticket} tone="blue" label="Próximas viagens" value={String(upcoming.length)} />
        <Stat icon={Plane} tone="purple" label="Viagens confirmadas" value={String(paid.length)} />
        <Stat icon={Wallet} tone="green" label="Total gasto" value={formatMoney(totalSpent, "EUR", lang)} />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Próxima viagem</h2>
        {upcoming[0] ? (
          <TripCard booking={upcoming[0]} lang={lang} />
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <Plane className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden />
            <h3 className="mb-2 font-bold text-gray-900">Nenhuma viagem agendada</h3>
            <p className="mb-4 text-gray-500">Comece a planear a sua próxima viagem.</p>
            <Button asChild>
              <Link href={`/${lang}`}>Pesquisar viagens</Link>
            </Button>
          </div>
        )}
      </section>

      {bookings.length > 0 && (
        <div className="text-right">
          <Link href={`/${lang}/dashboard/trips`} className="text-sm font-medium text-primary hover:underline">
            Ver todas as reservas →
          </Link>
        </div>
      )}
    </div>
  )
}

const TONES = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  green: "bg-green-50 text-green-600",
}

function Stat({ icon: Icon, tone, label, value }: { icon: typeof Plane; tone: keyof typeof TONES; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${TONES[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  )
}
