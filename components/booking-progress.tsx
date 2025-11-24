import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingProgressProps {
  currentStep: 1 | 2 | 3
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  const steps = [
    { number: 1, label: "Detalhes" },
    { number: 2, label: "Pagamento" },
    { number: 3, label: "Confirmação" },
  ]

  return (
    <div className="w-full py-6 mb-8">
      <div className="relative flex items-center justify-between max-w-3xl mx-auto">
        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number

          return (
            <div key={step.number} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isCurrent
                      ? "bg-white border-primary text-primary"
                      : "bg-white border-gray-300 text-gray-400",
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isCurrent || isCompleted ? "text-primary" : "text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
