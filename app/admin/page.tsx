import Link from "next/link"
import { Activity, CreditCard, Euro, Users } from "lucide-react"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/session"
import { formatMoney } from "@/lib/money"
import { AdminBookingsTable } from "@/components/admin-bookings-table"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [revenue, revenue30d, paidCount, totalUsers, searches30d, recent] = await Promise.all([
    prisma.booking.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
    prisma.booking.aggregate({ where: { status: "PAID", paidAt: { gte: since } }, _sum: { amountCents: true } }),
    prisma.booking.count({ where: { status: "PAID" } }),
    prisma.user.count(),
    prisma.searchLog.count({ where: { createdAt: { gte: since } } }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  const cards = [
    { label: "Receita total", value: formatMoney(revenue._sum.amountCents ?? 0), icon: Euro },
    { label: "Receita (30 dias)", value: formatMoney(revenue30d._sum.amountCents ?? 0), icon: Activity },
    { label: "Reservas pagas", value: paidCount.toLocaleString("pt-PT"), icon: CreditCard },
    { label: "Utilizadores", value: totalUsers.toLocaleString("pt-PT"), icon: Users },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {card.label}
              <card.icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="mt-2 text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{searches30d.toLocaleString("pt-PT")} pesquisas nos últimos 30 dias.</p>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Reservas recentes</h2>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        <AdminBookingsTable bookings={recent} />
      </section>
    </div>
  )
}
