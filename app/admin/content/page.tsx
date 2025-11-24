"use client"

import { useState } from "react"
import { Save, Bold, Italic, List, LinkIcon, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function ContentPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Alterações guardadas",
        description: "O conteúdo da página foi atualizado com sucesso.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gestão de Conteúdo</h3>
        <p className="text-sm text-muted-foreground">Edite o conteúdo das páginas institucionais do site.</p>
      </div>
      <Separator />

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="contact">Contactos</TabsTrigger>
          <TabsTrigger value="terms">Termos e Condições</TabsTrigger>
          <TabsTrigger value="privacy">Política de Privacidade</TabsTrigger>
        </TabsList>

        {["about", "contact", "terms", "privacy"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === "about" && "Página Sobre Nós"}
                  {tab === "contact" && "Página de Contactos"}
                  {tab === "terms" && "Termos e Condições"}
                  {tab === "privacy" && "Política de Privacidade"}
                </CardTitle>
                <CardDescription>Atualize as informações visíveis publicamente nesta página.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${tab}-title`}>Título da Página</Label>
                  <Input
                    id={`${tab}-title`}
                    defaultValue={
                      tab === "about"
                        ? "Sobre a Viajando"
                        : tab === "contact"
                          ? "Entre em Contacto"
                          : tab === "terms"
                            ? "Termos e Condições de Uso"
                            : "Política de Privacidade"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <div className="rounded-md border">
                    <div className="flex items-center gap-1 border-b bg-muted/50 p-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <List className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="mx-1 h-6" />
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      className="min-h-[300px] resize-y border-0 focus-visible:ring-0"
                      placeholder="Escreva o conteúdo da página aqui..."
                      defaultValue={
                        tab === "about"
                          ? "A Viajando nasceu em 2024 com a missão de simplificar as viagens na Europa..."
                          : tab === "contact"
                            ? "Estamos aqui para ajudar. Entre em contacto connosco através dos canais abaixo..."
                            : ""
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Guardando...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
