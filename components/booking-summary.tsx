import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight } from "lucide-react"

interface BookingData {
  price: {
    base: number
    taxes: number
    total: number
  }
}

export function BookingSummary({ data }: { data: BookingData }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        <h3 className="font-bold text-lg text-gray-900">Resumo do Pagamento</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Bilhete Adulto (x1)</span>
            <span>€{data.price.base.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxas e Impostos</span>
            <span>€{data.price.taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Seleção de Lugar</span>
            <span className="text-green-600">Grátis</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-end">
          <span className="font-bold text-gray-900 text-lg">Total</span>
          <div className="text-right">
            <span className="block text-2xl font-bold text-primary">€{data.price.total.toFixed(2)}</span>
            <span className="text-xs text-gray-500">IVA incluído</span>
          </div>
        </div>

        <Button className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          Continuar para Pagamento <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
        Ao continuar, aceita os nossos Termos e Condições.
      </div>
    </div>
  )
}
