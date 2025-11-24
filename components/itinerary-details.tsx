import Image from "next/image"
import { Plane, Wifi, Coffee, Battery } from "lucide-react"

interface ItineraryData {
  carrier: string
  carrierLogo: string
  flightNumber: string
  class: string
  baggage: string
  departure: {
    station: string
    terminal: string
    time: string
    date: string
  }
  arrival: {
    station: string
    terminal: string
    time: string
    date: string
  }
  duration: string
}

export function ItineraryDetails({ data }: { data: ItineraryData }) {
  return (
    <div className="space-y-8">
      {/* Carrier Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={data.carrierLogo || "/placeholder.svg"}
              alt={data.carrier}
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{data.carrier}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>{data.flightNumber}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{data.class}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 text-gray-400">
          <Wifi className="w-4 h-4" />
          <Coffee className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
        {/* Departure */}
        <div className="relative">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-white" />
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-bold text-gray-900">{data.departure.time}</div>
              <div className="font-medium text-gray-700">{data.departure.station}</div>
              <div className="text-sm text-gray-500">
                {data.departure.date} • Terminal {data.departure.terminal}
              </div>
            </div>
          </div>
        </div>

        {/* Duration/Flight Info */}
        <div className="py-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 w-fit px-3 py-1 rounded-full">
            <Plane className="w-3 h-3" />
            <span>Duração: {data.duration}</span>
          </div>
        </div>

        {/* Arrival */}
        <div className="relative">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary" />
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-bold text-gray-900">{data.arrival.time}</div>
              <div className="font-medium text-gray-700">{data.arrival.station}</div>
              <div className="text-sm text-gray-500">
                {data.arrival.date} • Terminal {data.arrival.terminal}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span className="font-medium">Bagagem incluída:</span>
          <span>{data.baggage}</span>
        </div>
      </div>
    </div>
  )
}
