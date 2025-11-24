import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { pt, enUS, es, fr } from "date-fns/locale"
import type { Locale } from "@/i18n-config"

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
} as const

const DATES = [
  { day: "Seg", date: "21 Nov", price: 95 },
  { day: "Ter", date: "22 Nov", price: 82 },
  { day: "Qua", date: "23 Nov", price: 45, isCheapest: true },
  { day: "Qui", date: "24 Nov", price: 85, isSelected: true },
  { day: "Sex", date: "25 Nov", price: 110 },
  { day: "Sáb", date: "26 Nov", price: 145 },
  { day: "Dom", date: "27 Nov", price: 130 },
]

export function DateNavigation({ lang = "pt" }: { lang?: Locale }) {
  // Generate dates dynamically with proper i18n
  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i - 3) // 3 days before, today, 3 days after
    return {
      day: format(date, "EEE", { locale: localeMap[lang] }),
      date: format(date, "d MMM", { locale: localeMap[lang] }),
      price: Math.floor(Math.random() * 100) + 45, // Random price for demo
      isSelected: i === 3, // Select today
      isCheapest: i === 2, // Mark one as cheapest
    }
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 grid grid-cols-3 md:grid-cols-7 gap-2 overflow-hidden">
          {dates.map((item, index) => (
            <button
              key={index}
              className={`
                flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all
                ${index > 2 ? "hidden md:flex" : "flex"}
                ${
                  item.isSelected
                    ? "bg-primary text-white shadow-md transform scale-105"
                    : "hover:bg-gray-50 text-gray-600"
                }
              `}
            >
              <span className={`text-xs ${item.isSelected ? "text-primary-foreground/80" : "text-gray-400"}`}>
                {item.day}, {item.date}
              </span>
              <span className={`font-bold ${item.isSelected ? "text-white" : "text-gray-900"}`}>€{item.price}</span>
              {item.isCheapest && !item.isSelected && (
                <span className="text-[10px] text-green-600 font-medium">Melhor preço</span>
              )}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
