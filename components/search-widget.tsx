"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Plane, Train, Bus, Loader2, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { pt, enUS, es, fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { airports } from "@/lib/airports"
import type { Locale } from "@/i18n-config"

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
} as const

export function SearchWidget({ lang }: { lang: Locale }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [date, setDate] = React.useState<Date>()
  const [openOrigin, setOpenOrigin] = React.useState(false)
  const [openDestination, setOpenDestination] = React.useState(false)

  const handleSearch = async () => {
    if (!origin || !destination || !date) return

    setIsLoading(true)

    // Format date to YYYY-MM-DD
    const formattedDate = format(date, "yyyy-MM-dd")

    // Redirect to search page with query params
    const searchParams = new URLSearchParams({
      origin,
      destination,
      date: formattedDate,
    })

    router.push(`/${lang}/search?${searchParams.toString()}`)
    setIsLoading(false)
  }

  const isFormValid = origin && destination && date

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-2 md:p-6">
      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 h-auto">
          <TabsTrigger
            value="flights"
            className="py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm gap-2"
          >
            <Plane className="h-4 w-4" /> Voos
          </TabsTrigger>
          <TabsTrigger
            value="trains"
            className="py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm gap-2"
          >
            <Train className="h-4 w-4" /> Comboios
          </TabsTrigger>
          <TabsTrigger
            value="buses"
            className="py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm gap-2"
          >
            <Bus className="h-4 w-4" /> Autocarros
          </TabsTrigger>
        </TabsList>

        {["flights", "trains", "buses"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Origin Autocomplete */}
              <div className="md:col-span-3 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">De onde?</label>
                <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOrigin}
                      className="w-full justify-between h-12 bg-muted/30 border-muted-foreground/20"
                    >
                      {origin ? airports.find((city) => city.value === origin)?.label : "Selecione origem..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0">
                    <Command>
                      <CommandInput placeholder="Procurar cidade ou aeroporto..." />
                      <CommandList>
                        <CommandEmpty>Cidade não encontrada.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {airports.map((city) => (
                            <CommandItem
                              key={city.value}
                              value={city.label}
                              onSelect={() => {
                                setOrigin(city.value)
                                setOpenOrigin(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", origin === city.value ? "opacity-100" : "opacity-0")}
                              />
                              {city.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Destination Autocomplete */}
              <div className="md:col-span-3 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Para onde?</label>
                <Popover open={openDestination} onOpenChange={setOpenDestination}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDestination}
                      className="w-full justify-between h-12 bg-muted/30 border-muted-foreground/20"
                    >
                      {destination
                        ? airports.find((city) => city.value === destination)?.label
                        : "Selecione destino..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0">
                    <Command>
                      <CommandInput placeholder="Procurar cidade ou aeroporto..." />
                      <CommandList>
                        <CommandEmpty>Cidade não encontrada.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {airports.map((city) => (
                            <CommandItem
                              key={city.value}
                              value={city.label}
                              onSelect={() => {
                                setDestination(city.value)
                                setOpenDestination(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", destination === city.value ? "opacity-100" : "opacity-0")}
                              />
                              {city.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date Picker */}
              <div className="md:col-span-2 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Partida</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 bg-muted/30 border-muted-foreground/20",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: localeMap[lang] }) : <span>Selecione data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date (Optional/Mock) */}
              <div className="md:col-span-2 relative">
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Regresso</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-9 h-12 bg-muted/30 border-muted-foreground/20" />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2 flex items-end">
                <Button
                  className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base shadow-md"
                  onClick={handleSearch}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />A pesquisar...
                    </>
                  ) : (
                    "Pesquisar"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
