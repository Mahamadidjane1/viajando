import { ArrowRight, Clock, Info, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface TicketData {
  id: string
  type: string
  carrier: string
  carrierLogo: string
  departureTime: string
  arrivalTime: string
  departureStation: string
  arrivalStation: string
  duration: string
  stops: number
  price: number
  currency: string
  isOvernight?: boolean
}

export function TicketCard({ data }: { data: TicketData }) {
  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 overflow-hidden relative">
      <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10">
        <Heart className="w-5 h-5" />
        <span className="sr-only">Guardar viagem</span>
      </button>

      <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Carrier Info */}
        <div className="flex md:flex-col items-center md:items-start gap-3 md:w-32 flex-shrink-0">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={data.carrierLogo || "/placeholder.svg"}
              alt={data.carrier}
              fill
              className="object-contain p-1"
            />
          </div>
          <span className="text-xs font-medium text-gray-600 text-center md:text-left line-clamp-1">
            {data.carrier}
          </span>
        </div>

        {/* Journey Details */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-gray-900">{data.departureTime}</div>
            <div className="flex-1 px-4 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {data.duration}
              </div>
              <div className="w-full h-[2px] bg-gray-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                {data.stops > 0 && (
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white border-2 border-gray-400" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">{data.stops === 0 ? "Direto" : `${data.stops} paragem`}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {data.arrivalTime}
              {data.isOvernight && <sup className="text-xs text-red-500 ml-1">+1</sup>}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span className="truncate max-w-[120px]">{data.departureStation}</span>
            <span className="truncate max-w-[120px] text-right">{data.arrivalStation}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-row md:flex-col items-center md:justify-center justify-between gap-4 md:w-40 md:border-l md:pl-6 border-gray-100 pt-4 md:pt-0 border-t md:border-t-0 mt-4 md:mt-0">
          <div className="text-right md:text-center group/price relative cursor-help">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <div className="text-2xl font-bold text-primary">€{data.price}</div>
                    <div className="text-xs text-gray-500 border-b border-dashed border-gray-300 inline-block">
                      por passageiro
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-3 max-w-[200px]">
                  <div className="space-y-1 text-xs">
                    <div className="font-bold mb-2">Detalhes do Preço</div>
                    <div className="flex justify-between">
                      <span>Tarifa Base:</span>
                      <span>€{(data.price * 0.8).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxas e Impostos:</span>
                      <span>€{(data.price * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-1 mt-1 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>€{data.price.toFixed(2)}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
            Selecionar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 px-4 py-2 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" /> Detalhes da viagem
        </span>
        {data.price < 50 && (
          <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Preço baixo</span>
        )}
      </div>
    </div>
  )
}
