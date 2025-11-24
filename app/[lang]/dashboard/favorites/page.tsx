import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plane, Train, Bus, Trash2 } from "lucide-react"

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Viagens Salvas</h1>
          <p className="text-muted-foreground">As suas rotas e destinos favoritos para acesso rápido.</p>
        </div>
        <Button>Nova Pesquisa</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <Card className="overflow-hidden group">
          <div className="h-32 bg-muted relative">
            <img
              src="/madrid-spain-plaza-mayor.jpg"
              alt="Madrid"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
              <Train className="w-3 h-3 mr-1" /> Comboio
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                Lisboa <span className="text-muted-foreground mx-1">→</span> Madrid
              </CardTitle>
              <span className="font-bold text-primary">€45.00</span>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Qualquer fim de semana</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>6h 30m • Direto</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20 flex gap-2">
            <Button className="w-full" size="sm">
              Reservar
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Card 2 */}
        <Card className="overflow-hidden group">
          <div className="h-32 bg-muted relative">
            <img
              src="/paris-france-eiffel-tower.jpg"
              alt="Paris"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
              <Plane className="w-3 h-3 mr-1" /> Voo
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                Porto <span className="text-muted-foreground mx-1">→</span> Paris
              </CardTitle>
              <span className="font-bold text-primary">€89.00</span>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Próximo mês</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>2h 15m • Direto</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20 flex gap-2">
            <Button className="w-full" size="sm">
              Reservar
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Card 3 */}
        <Card className="overflow-hidden group">
          <div className="h-32 bg-muted relative">
            <img
              src="/lisbon-portugal-tram-sunny-street.jpg"
              alt="Algarve"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
              <Bus className="w-3 h-3 mr-1" /> Autocarro
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                Lisboa <span className="text-muted-foreground mx-1">→</span> Algarve
              </CardTitle>
              <span className="font-bold text-primary">€18.50</span>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Verão 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>3h 45m • Direto</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20 flex gap-2">
            <Button className="w-full" size="sm">
              Reservar
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
