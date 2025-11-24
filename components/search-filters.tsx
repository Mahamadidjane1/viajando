import { Slider } from "@/components/ui/slider"

export function SearchFilters() {
  return (
    <div className="space-y-6">
      {/* Stops Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Paragens</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">Direto apenas</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">1 paragem máx.</span>
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Preço</h3>
        <div className="px-2">
          <Slider defaultValue={[150]} max={500} step={10} className="mb-4" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>€0</span>
            <span className="font-medium">Até €150</span>
          </div>
        </div>
      </div>

      {/* Departure Time */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Horário de Partida</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 border rounded-lg text-sm hover:border-primary hover:text-primary transition-colors text-center">
              Manhã
              <span className="block text-xs text-gray-400">06:00 - 12:00</span>
            </button>
            <button className="p-2 border rounded-lg text-sm hover:border-primary hover:text-primary transition-colors text-center bg-primary/5 border-primary text-primary">
              Tarde
              <span className="block text-xs text-primary/60">12:00 - 18:00</span>
            </button>
            <button className="p-2 border rounded-lg text-sm hover:border-primary hover:text-primary transition-colors text-center">
              Noite
              <span className="block text-xs text-gray-400">18:00 - 00:00</span>
            </button>
          </div>
        </div>
      </div>

      {/* Airlines/Operators */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Companhias</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-gray-700">TAP Air Portugal</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-gray-700">Iberia</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-gray-700">Renfe</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300" />
            <span className="text-sm text-gray-700">FlixBus</span>
          </label>
        </div>
      </div>
    </div>
  )
}
