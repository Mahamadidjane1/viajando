import type { Booking } from "@prisma/client"
import { BookingStatusBadge } from "@/components/booking-status-badge"
import { formatMoney } from "@/lib/money"
import { formatTimestamp, formatTripDate } from "@/lib/format"

type Row = Booking & { user: { name: string | null; email: string | null } }

export function AdminBookingsTable({ bookings }: { bookings: Row[] }) {
  if (!bookings.length) {
    return <p className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">Sem reservas.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Ref.</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Viagem</th>
            <th className="px-4 py-3">Partida</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Valor</th>
            <th className="px-4 py-3">Criada</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs">{b.id.slice(-8).toUpperCase()}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{b.user.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{b.user.email}</div>
              </td>
              <td className="px-4 py-3">
                {b.origin} → {b.destination}
                <div className="text-xs text-muted-foreground">
                  {b.carrierName ?? b.carrierCode} · {b.provider}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatTripDate(b.departureDate, "pt", { dateStyle: "short", timeStyle: "short" })}
              </td>
              <td className="px-4 py-3">
                <BookingStatusBadge status={b.status} />
              </td>
              <td className="px-4 py-3 text-right font-medium whitespace-nowrap">{formatMoney(b.amountCents, b.currency)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatTimestamp(b.createdAt, "pt")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
