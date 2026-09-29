import Link from "next/link"
import { AlertCircle, CheckCircle, Clock, Home, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingProgress } from "@/components/booking-progress"
import { prisma } from "@/lib/db"
import { getStripe } from "@/lib/stripe"
import { requireUser } from "@/lib/session"
import { formatMoney } from "@/lib/money"
import { formatDay, formatTime } from "@/lib/format"

export const metadata = { title: "Estado da reserva | Viajando", robots: { index: false } }

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { lang } = await params
  const { session_id: sessionId } = await searchParams
  const user = await requireUser(lang)

  // A pagina so mostra o que a base de dados e o Stripe confirmam; nunca confia no URL.
  const booking = sessionId
    ? await prisma.booking.findFirst({ where: { stripeSessionId: sessionId, userId: user.id } })
    : null

  if (!booking) {
    return (
      <StatusCard
        lang={lang}
        tone="error"
        title="Reserva não encontrada"
        message="Não encontrámos esta reserva na sua conta. Se foi cobrado, contacte o apoio ao cliente."
      />
    )
  }

  // Se o webhook ainda nao chegou, confirma diretamente no Stripe para mostrar o estado real.
  let paymentStatus = booking.status
  if (paymentStatus === "PENDING") {
    const checkout = await getStripe()?.checkout.sessions.retrieve(sessionId!).catch(() => null)
    if (checkout?.payment_status === "paid") paymentStatus = "PAID"
    else if (checkout?.status === "complete") paymentStatus = "AWAITING_PAYMENT"
  }

  const reference = booking.id.slice(-8).toUpperCase()
  const isPaid = paymentStatus === "PAID"
  const isWaiting = paymentStatus === "AWAITING_PAYMENT" || paymentStatus === "PENDING"

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-4xl">
        <BookingProgress currentStep={isPaid ? 3 : 2} />
      </div>

      <div className="mt-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className={`border-b p-8 text-center ${isPaid ? "border-green-100 bg-green-50" : "border-amber-100 bg-amber-50"}`}>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isPaid ? "bg-green-100" : "bg-amber-100"}`}>
            {isPaid ? <CheckCircle className="h-8 w-8 text-green-600" aria-hidden /> : <Clock className="h-8 w-8 text-amber-600" aria-hidden />}
          </div>
          <h1 className={`mb-2 text-2xl font-bold ${isPaid ? "text-green-800" : "text-amber-800"}`}>
            {isPaid ? "Pagamento confirmado!" : isWaiting ? "A aguardar pagamento" : "Pagamento não concluído"}
          </h1>
          <p className={isPaid ? "text-green-700" : "text-amber-700"}>
            {isPaid
              ? "Enviámos a confirmação para o email do passageiro."
              : isWaiting
                ? "Assim que o pagamento for confirmado (ex.: referência Multibanco paga), a reserva fica confirmada automaticamente."
                : "A reserva não foi paga. Pode fazer uma nova pesquisa."}
          </p>
        </div>

        <div className="space-y-6 p-8">
          <dl className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
            <div>
              <dt className="text-gray-500">Referência</dt>
              <dd className="font-mono text-lg font-bold text-gray-900">{reference}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total</dt>
              <dd className="text-lg font-bold text-gray-900">{formatMoney(booking.amountCents, booking.currency, lang)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Viagem</dt>
              <dd className="font-medium text-gray-900">
                {booking.origin} → {booking.destination}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Partida</dt>
              <dd className="font-medium text-gray-900">
                {formatDay(booking.departureDate, lang)}, {formatTime(booking.departureDate, lang)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="flex-1 gap-2" size="lg" asChild>
              <Link href={`/${lang}/dashboard/trips`}>
                <Plane className="h-4 w-4" aria-hidden /> As minhas viagens
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 gap-2" size="lg" asChild>
              <Link href={`/${lang}`}>
                <Home className="h-4 w-4" aria-hidden /> Página inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

function StatusCard({ lang, title, message }: { lang: string; tone: "error"; title: string; message: string }) {
  return (
    <main className="container mx-auto max-w-xl px-4 py-16 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" aria-hidden />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mb-6 text-gray-600">{message}</p>
      <Button asChild>
        <Link href={`/${lang}/dashboard/trips`}>As minhas viagens</Link>
      </Button>
    </main>
  )
}
