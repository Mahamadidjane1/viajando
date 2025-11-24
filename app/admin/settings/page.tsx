"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Plane, Bus, Map, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const [amadeusKey, setAmadeusKey] = useState("QUNShCIUqEpRvIOcIb9Sfb3n5syRGZ5d")
  const [amadeusSecret, setAmadeusSecret] = useState("5dcC1zFuSIMiLxH0")
  const [amadeusActive, setAmadeusActive] = useState(true)
  const [amadeusEnv, setAmadeusEnv] = useState("production")

  const [mapsKey, setMapsKey] = useState("")

  const [saved, setSaved] = useState(false)

  const handleSaveAPIs = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Configurações</h1>
            {saved && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Alterações salvas</span>
              </div>
            )}
          </div>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="apis">APIs & Integrações</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Plataforma</CardTitle>
                  <CardDescription>Gerencie os detalhes públicos da sua plataforma de viagens.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="site-name">Nome da Plataforma</Label>
                    <Input id="site-name" defaultValue="Viajando" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="support-email">Email de Suporte</Label>
                    <Input id="support-email" defaultValue="suporte@viajando.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contact-phone">Telefone de Contato</Label>
                    <Input id="contact-phone" defaultValue="+351 21 000 0000" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Salvar Alterações</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Pagamento</CardTitle>
                  <CardDescription>Gerencie as chaves de API e métodos de pagamento aceitos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="stripe-key">Stripe Public Key</Label>
                    <Input id="stripe-key" type="password" defaultValue="pk_test_..." />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                    <Input id="stripe-secret" type="password" defaultValue="sk_test_..." />
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
                  <Button>Salvar Configurações</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="apis" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuração Integrada</AlertTitle>
                <AlertDescription>
                  As chaves de API estão configuradas diretamente no código. Para alterá-las, edite o arquivo
                  lib/api-config.ts.
                </AlertDescription>
              </Alert>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <CardTitle>Amadeus API (Voos)</CardTitle>
                  </div>
                  <CardDescription>Conexão principal para pesquisa de voos globais.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2 mb-4">
                    <Label htmlFor="amadeus-active" className="flex flex-col space-y-1">
                      <span>Ativar Integração</span>
                      <span className="font-normal text-xs text-muted-foreground">
                        Habilita busca de voos em tempo real
                      </span>
                    </Label>
                    <Switch id="amadeus-active" checked={amadeusActive} disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amadeus-key">API Key (Client ID)</Label>
                    <Input id="amadeus-key" type="text" value={amadeusKey} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amadeus-secret">API Secret</Label>
                    <Input id="amadeus-secret" type="password" value={amadeusSecret} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amadeus-env">Ambiente</Label>
                    <select
                      id="amadeus-env"
                      value={amadeusEnv}
                      disabled
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="test">Test (Sandbox)</option>
                      <option value="production">Produção</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-yellow-600" />
                    <CardTitle>Distribusion / FlixBus (Ônibus & Trens)</CardTitle>
                  </div>
                  <CardDescription>Agregador para transporte terrestre na Europa (em breve).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2 mb-4">
                    <Label htmlFor="ground-active" className="flex flex-col space-y-1">
                      <span>Ativar Integração</span>
                      <span className="font-normal text-xs text-muted-foreground">Disponível em breve</span>
                    </Label>
                    <Switch id="ground-active" disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ground-key">API Key</Label>
                    <Input id="ground-key" type="password" placeholder="Chave de API do fornecedor" disabled />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-green-600" />
                    <CardTitle>Google Maps</CardTitle>
                  </div>
                  <CardDescription>Usado para autocompletar cidades e mostrar mapas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="maps-key">Google Maps API Key</Label>
                    <Input
                      id="maps-key"
                      type="text"
                      value={mapsKey || "Não configurada"}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Para adicionar uma chave, edite o arquivo lib/api-config.ts
                    </p>
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
