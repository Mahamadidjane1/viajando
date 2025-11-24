import { Separator } from "@/components/ui/separator"
import { Plane, Calendar, Clock } from "lucide-react"
import Image from "next/image"

export function OrderSummary() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Resumo do Pedido</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Trip Info */}
        <div className="flex gap-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
            <Image src="/placeholder.svg?key=wug2g" alt="TAP" fill className="object-contain p-1" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Lisboa → Madrid</div>
            <div className="text-sm text-gray-500">TAP Air Portugal • TP 1014</div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>24 Nov 2025</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>08:00 - 10:30 (1h 30m)</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Plane className="w-4 h-4" />
            <span>Económica • 1 Passageiro</span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Bilhete Base</span>
            <span>€65.00</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxas e Impostos</span>
            <span>€20.00</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Lugar Marcado (2A)</span>
            <span className="text-green-600">Grátis</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-end">
          <span className="font-bold text-gray-900">Total a Pagar</span>
          <span className="text-2xl font-bold text-primary">€85.00</span>
        </div>
      </div>
    </div>
  )
}
