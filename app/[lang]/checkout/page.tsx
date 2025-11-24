import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PaymentForm } from "@/components/payment-form"
import { OrderSummary } from "@/components/order-summary"
import { ShieldCheck, Lock } from "lucide-react"
import { BookingProgress } from "@/components/booking-progress"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <BookingProgress currentStep={2} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Pagamento Seguro</h1>
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                <span className="font-medium">Ambiente Seguro SSL</span>
              </div>
            </div>

            {/* Payment Methods */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <PaymentForm />
              </div>
            </section>

            {/* Trust Signals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div className="text-xs text-gray-600">
                  <span className="block font-semibold text-gray-900">Pagamento Protegido</span>
                  Encriptação de dados bancários
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                  ✓
                </div>
                <div className="text-xs text-gray-600">
                  <span className="block font-semibold text-gray-900">Confirmação Imediata</span>
                  Bilhetes enviados por email
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  ?
                </div>
                <div className="text-xs text-gray-600">
                  <span className="block font-semibold text-gray-900">Suporte 24/7</span>
                  Ajuda em qualquer momento
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
