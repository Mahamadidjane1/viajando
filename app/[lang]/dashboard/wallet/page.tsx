import { Wallet, ArrowUpRight, ArrowDownLeft, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Carteira & Cashback</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 opacity-90">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Saldo Disponível</span>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Nível Gold</span>
          </div>

          <div className="mb-8">
            <div className="text-4xl font-bold mb-1">€12.50</div>
            <div className="text-sm opacity-80">Acumulado em viagens</div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 gap-2">
              <ArrowDownLeft className="w-4 h-4" /> Levantar
            </Button>
            <Button className="flex-1 gap-2 bg-white/20 hover:bg-white/30 border-0 text-white">
              <ArrowUpRight className="w-4 h-4" /> Usar em Viagem
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="text-sm text-gray-500 mb-2">Total Ganho</div>
            <div className="text-2xl font-bold text-green-600">+€45.20</div>
            <div className="text-xs text-gray-400 mt-1">Desde Jan 2025</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="text-sm text-gray-500 mb-2">Total Usado</div>
            <div className="text-2xl font-bold text-gray-900">€32.70</div>
            <div className="text-xs text-gray-400 mt-1">Em descontos</div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Histórico de Transações</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
                  >
                    {i % 2 === 0 ? <Ticket className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {i % 2 === 0 ? "Desconto em Viagem" : "Cashback Recebido"}
                    </div>
                    <div className="text-xs text-gray-500">24 Nov 2025 • #TRV-8924{i}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${i % 2 === 0 ? "text-gray-900" : "text-green-600"}`}>
                    {i % 2 === 0 ? "-€2.50" : "+€1.25"}
                  </div>
                  <div className="text-xs text-gray-400">Concluído</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
