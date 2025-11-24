import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contacte-nos</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estamos aqui para ajudar. Tem alguma dúvida ou sugestão? Fale connosco.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Envie-nos uma mensagem</h2>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo e responderemos o mais breve possível.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Nome</Label>
                      <Input id="first-name" placeholder="João" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Apelido</Label>
                      <Input id="last-name" placeholder="Silva" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="joao@exemplo.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea className="min-h-[150px]" id="message" placeholder="Como podemos ajudar?" />
                  </div>
                  <Button className="w-full">Enviar Mensagem</Button>
                </div>
              </div>
              <div className="space-y-8 lg:pl-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Outros Contactos</h2>
                  <p className="text-muted-foreground">Prefere falar diretamente connosco?</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Escritório</h3>
                      <p className="text-muted-foreground">
                        Avenida da Liberdade, 123
                        <br />
                        1250-001 Lisboa, Portugal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Email</h3>
                      <p className="text-muted-foreground">suporte@viajando.com</p>
                      <p className="text-muted-foreground">parcerias@viajando.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Telefone</h3>
                      <p className="text-muted-foreground">+351 210 000 000</p>
                      <p className="text-sm text-muted-foreground">(Seg-Sex, 9h-18h)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
