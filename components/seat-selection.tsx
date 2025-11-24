export function SeatSelection() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-md bg-gray-100 rounded-xl p-8 relative overflow-hidden">
        {/* Plane Nose */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-white rounded-b-full opacity-50" />

        <div className="grid grid-cols-5 gap-3 relative z-10">
          {/* Aisle Labels */}
          <div className="col-span-5 flex justify-between px-2 text-xs text-gray-400 font-medium mb-2">
            <span>A</span>
            <span>B</span>
            <span className="w-8 text-center"></span>
            <span>C</span>
            <span>D</span>
          </div>

          {/* Row 1 */}
          <button className="w-10 h-10 rounded bg-gray-300 cursor-not-allowed" disabled />
          <button className="w-10 h-10 rounded bg-gray-300 cursor-not-allowed" disabled />
          <div className="w-8 flex items-center justify-center text-xs text-gray-400">1</div>
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />

          {/* Row 2 */}
          <button className="w-10 h-10 rounded bg-primary text-white font-bold shadow-md ring-2 ring-primary ring-offset-2">
            ✓
          </button>
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />
          <div className="w-8 flex items-center justify-center text-xs text-gray-400">2</div>
          <button className="w-10 h-10 rounded bg-gray-300 cursor-not-allowed" disabled />
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />

          {/* Row 3 */}
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />
          <div className="w-8 flex items-center justify-center text-xs text-gray-400">3</div>
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />
          <button className="w-10 h-10 rounded bg-white border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors" />
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border-2 border-gray-300" />
          <span className="text-gray-600">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-gray-600">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300" />
          <span className="text-gray-600">Ocupado</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-900">Lugar 2A Selecionado</p>
        <p className="text-xs text-gray-500">Janela • Asa dianteira</p>
      </div>
    </div>
  )
}
