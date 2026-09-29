import Link from "next/link"
import { BookingStatus } from "@prisma/client"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/session"
import { AdminBookingsTable } from "@/components/admin-bookings-table"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 50

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  await requireAdmin()
  const query = await searchParams
  const status = Object.values(BookingStatus).includes(query.status as BookingStatus) ? (query.status as BookingStatus) : undefined
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1)

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.booking.count({ where: { status } }),
  ])
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const href = (params: { status?: string; page?: number }) => {
    const sp = new URLSearchParams()
    if (params.status) sp.set("status", params.status)
    if (params.page && params.page > 1) sp.set("page", String(params.page))
    return `/admin/bookings${sp.size ? `?${sp}` : ""}`
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reservas ({total})</h1>
      <nav className="flex flex-wrap gap-2 text-sm" aria-label="Filtrar por estado">
        {[undefined, ...Object.values(BookingStatus)].map((s) => (
          <Link
            key={s ?? "all"}
            href={href({ status: s })}
            className={cn("rounded-full border px-3 py-1", s === status ? "bg-primary text-primary-foreground" : "bg-background")}
          >
            {s ?? "Todas"}
          </Link>
        ))}
      </nav>
      <AdminBookingsTable bookings={bookings} />
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href({ status, page: page - 1 })}>← Anterior</Link> : <span />}
          <span className="text-muted-foreground">
            Página {page} de {pages}
          </span>
          {page < pages ? <Link href={href({ status, page: page + 1 })}>Seguinte →</Link> : <span />}
        </div>
      )}
    </div>
  )
}
