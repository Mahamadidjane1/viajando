import Link from "next/link"
import { CheckCircle, Download, Home, Mail, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingProgress } from "@/components/booking-progress"

export default function SuccessPage({
  params,
  searchParams,
}: {
  params: { lang: string }
  searchParams: { session_id?: string; booking_id?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <BookingProgress currentStep={3} />
        </div>

        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-8">
          <div className="bg-green-50 p-8 text-center border-b border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Reserva Confirmada!</h1>
            <p className="text-green-700">A sua viagem está agendada. Enviámos os bilhetes para o seu email.</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div className="text-sm text-gray-500 mb-1">Referência da Reserva</div>
                <div className="text-xl font-mono font-bold text-gray-900">
                  #{searchParams.booking_id ? searchParams.booking_id.slice(0, 8).toUpperCase() : "TRV-89245"}
                </div>
              </div>
              <div className="text-right md:text-left">
                <div className="text-sm text-gray-500 mb-1">Estado</div>
                <div className="text-lg font-bold text-green-600">CONFIRMADO</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Confirmação enviada</p>
                  <p className="text-sm text-gray-600">
                    Enviámos os detalhes da sua reserva e bilhete eletrónico para o seu email.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Próximos Passos</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  Verifique o seu email para aceder aos bilhetes eletrónicos.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  Faça o download da nossa app para ter os bilhetes sempre à mão.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  Chegue ao aeroporto com 2 horas de antecedência.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="flex-1 gap-2" size="lg" asChild>
                <Link href={`/${params.lang}/dashboard/trips`}>
                  <Plane className="w-4 h-4" /> Ver Minhas Viagens
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent" size="lg">
                <Download className="w-4 h-4" /> Descarregar Bilhete
              </Button>
            </div>

            <div className="text-center pt-4">
              <Link
                href={`/${params.lang}`}
                className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
              >
                <Home className="w-3 h-3" /> Voltar à página inicial
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
