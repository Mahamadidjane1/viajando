import Link from "next/link"
import { ArrowLeft, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getStripe } from "@/lib/stripe"

export const metadata = { title: "Pagamento cancelado | Viajando", robots: { index: false } }

/** Liberta a reserva pendente e invalida a sessao de checkout para nao poder ser paga mais tarde. */
async function cancelPendingBooking(bookingId: string | undefined) {
  if (!bookingId) return
  const session = await auth()
  if (!session?.user?.id) return

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId: session.user.id, status: "PENDING" },
    select: { id: true, stripeSessionId: true },
  })
  if (!booking) return

  try {
    if (booking.stripeSessionId) await getStripe()?.checkout.sessions.expire(booking.stripeSessionId)
    await prisma.booking.updateMany({ where: { id: booking.id, status: "PENDING" }, data: { status: "CANCELLED" } })
  } catch (error) {
    // A sessao pode ja ter sido paga ou expirada; o webhook mantem o estado correto.
    console.warn("[checkout-cancel] Could not cancel booking", booking.id, error)
  }
}

export default async function CheckoutCancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ booking?: string }>
}) {
  const { lang } = await params
  await cancelPendingBooking((await searchParams).booking)

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="border-b border-orange-100 bg-orange-50 p-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <XCircle className="h-8 w-8 text-orange-600" aria-hidden />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Pagamento cancelado</h1>
          <p className="text-gray-600">A sua reserva não foi finalizada.</p>
        </div>

        <div className="space-y-6 p-8">
          <p className="text-center text-sm text-gray-600">
            Nenhum pagamento foi cobrado. Pode fazer uma nova pesquisa quando estiver pronto.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="h-11 w-full" asChild>
              <Link href={`/${lang}`}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                Nova pesquisa
              </Link>
            </Button>
            <Button variant="outline" className="h-11 w-full" asChild>
              <Link href={`/${lang}/dashboard/trips`}>As minhas viagens</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
