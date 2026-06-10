"use client"

import { useState } from "react"
import { AlertCircle, Bus, Check, Map, Plane } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Configuracoes</h1>
            {saved && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Alteracoes guardadas</span>
              </div>
            )}
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="apis">APIs</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Informacoes da Plataforma</CardTitle>
                  <CardDescription>Dados publicos apresentados aos utilizadores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="site-name">Nome da plataforma</Label>
                    <Input id="site-name" defaultValue="Viajando" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="support-email">Email de suporte</Label>
                    <Input id="support-email" defaultValue="suporte@viajando.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contact-phone">Telefone de contacto</Label>
                    <Input id="contact-phone" defaultValue="+351 21 000 0000" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>Guardar alteracoes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Configuracao de Pagamentos</CardTitle>
                  <CardDescription>Estado das integracoes de pagamento da plataforma.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Seguranca</AlertTitle>
                    <AlertDescription>
                      As chaves Stripe devem ser configuradas em variaveis de ambiente. Nunca devem aparecer no codigo
                      nem em componentes do cliente.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-1">
                    <Label htmlFor="stripe-public">Stripe public key</Label>
                    <Input id="stripe-public" value="Configurada em NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="stripe-secret">Stripe secret key</Label>
                    <Input id="stripe-secret" type="password" value="Configurada em STRIPE_SECRET_KEY" readOnly />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="mbway" className="flex flex-col space-y-1">
                      <span>Aceitar MB WAY</span>
                    </Label>
                    <Switch id="mbway" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="multibanco" className="flex flex-col space-y-1">
                      <span>Aceitar Multibanco</span>
                    </Label>
                    <Switch id="multibanco" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>Guardar configuracao</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="apis" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuracao por ambiente</AlertTitle>
                <AlertDescription>
                  As integracoes usam variaveis de ambiente. Consulte `.env.example` para configurar desenvolvimento e
                  producao.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <CardTitle>Amadeus API</CardTitle>
                    <Badge variant="secondary">Voos</Badge>
                  </div>
                  <CardDescription>Fornecedor principal para pesquisa de voos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="amadeus-active" className="flex flex-col space-y-1">
                      <span>Integracao ativa</span>
                      <span className="font-normal text-xs text-muted-foreground">
                        Controlada por AMADEUS_ACTIVE.
                      </span>
                    </Label>
                    <Switch id="amadeus-active" defaultChecked disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amadeus-key">API key</Label>
                    <Input id="amadeus-key" value="Configurada em AMADEUS_API_KEY" readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amadeus-secret">API secret</Label>
                    <Input id="amadeus-secret" type="password" value="Configurada em AMADEUS_API_SECRET" readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amadeus-env">Ambiente</Label>
                    <Input id="amadeus-env" value="Configurado em AMADEUS_ENVIRONMENT" readOnly />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-yellow-600" />
                    <CardTitle>Transporte terrestre</CardTitle>
                    <Badge variant="outline">Planeado</Badge>
                  </div>
                  <CardDescription>Integracao futura para autocarros e comboios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="ground-active" className="flex flex-col space-y-1">
                      <span>Integracao ativa</span>
                      <span className="font-normal text-xs text-muted-foreground">Ainda nao implementada.</span>
                    </Label>
                    <Switch id="ground-active" disabled />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-green-600" />
                    <CardTitle>Google Maps</CardTitle>
                  </div>
                  <CardDescription>Usado para mapas e autocompletar localizacoes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <Label htmlFor="maps-key">Browser key</Label>
                    <Input id="maps-key" value="Configurada em NEXT_PUBLIC_GOOGLE_MAPS_KEY" readOnly />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
