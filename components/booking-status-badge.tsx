import type { BookingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

const STATUS: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pagamento pendente", className: "bg-gray-100 text-gray-700" },
  AWAITING_PAYMENT: { label: "A aguardar pagamento", className: "bg-amber-100 text-amber-800" },
  PAID: { label: "Confirmada", className: "bg-green-100 text-green-800" },
  FAILED: { label: "Pagamento falhou", className: "bg-red-100 text-red-800" },
  EXPIRED: { label: "Expirada", className: "bg-gray-100 text-gray-500" },
  CANCELLED: { label: "Cancelada", className: "bg-gray-100 text-gray-500" },
  REFUNDED: { label: "Reembolsada", className: "bg-blue-100 text-blue-800" },
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = STATUS[status]
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>{label}</span>
}
