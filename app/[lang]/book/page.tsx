"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PassengerForm } from "@/components/passenger-form"
import { Button } from "@/components/ui/button"
import { Plane, Calendar, Clock, ArrowRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import type { PassengerFormData } from "@/lib/validations/booking"
import { createBookingWithStripe } from "@/app/actions/booking-actions"

export default function BookPage({ params }: { params: { lang: string } }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [passengerData, setPassengerData] = useState<PassengerFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Get booking details from URL params
  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const date = searchParams.get("date") || ""
  const price = Number.parseFloat(searchParams.get("price") || "0")

  const basePrice = price || 89
  const taxes = basePrice * 0.15
  const total = basePrice + taxes

  const handlePassengerDataChange = (data: PassengerFormData) => {
    setPassengerData(data)
  }

  const handleBooking = async () => {
    if (!passengerData) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const result = await createBookingWithStripe({
        origin,
        destination,
        departureDate: date,
        price: total,
        passenger: passengerData,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl
      }
    } catch (err) {
      setError("Ocorreu um erro ao processar a reserva")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete a sua reserva</h1>
          <p className="text-gray-600">Preencha os dados do passageiro para finalizar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Detalhes do Voo</h2>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{origin}</div>
                  <div className="text-sm text-gray-500">Origem</div>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <Plane className="h-5 w-5 text-primary mx-2" />
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{destination}</div>
                  <div className="text-sm text-gray-500">Destino</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {date && format(new Date(date), "PPP", { locale: pt })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  2h 15m
                </div>
              </div>
            </div>

            {/* Passenger Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Dados do Passageiro</h2>
              <PassengerForm onDataChange={handlePassengerDataChange} />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-6">
                  <h3 className="font-bold text-lg text-gray-900">Resumo do Pagamento</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Bilhete Adulto (x1)</span>
                      <span>€{basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxas e Impostos</span>
                      <span>€{taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Seleção de Lugar</span>
                      <span className="text-green-600">Grátis</span>
                    </div>
                  </div>

                  <div className="border-t pt-4"></div>

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-primary">€{total.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">IVA incluído</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={handleBooking}
                    disabled={!passengerData || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />A processar...
                      </>
                    ) : (
                      <>
                        Continuar para Pagamento <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
                  Ao continuar, aceita os nossos Termos e Condições.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
