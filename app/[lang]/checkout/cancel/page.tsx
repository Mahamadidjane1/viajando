import { XCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutCancelPage({ params }: { params: { lang: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-orange-50 p-8 text-center border-b border-orange-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Cancelado</h1>
          <p className="text-gray-600">A sua reserva não foi finalizada</p>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Não se preocupe, nenhum pagamento foi processado. Pode tentar novamente quando estiver pronto.
          </p>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-11 bg-primary hover:bg-primary/90" asChild>
              <Link href={`/${params.lang}/search`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Pesquisa
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-11 bg-transparent" asChild>
              <Link href={`/${params.lang}`}>Ir para Início</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
