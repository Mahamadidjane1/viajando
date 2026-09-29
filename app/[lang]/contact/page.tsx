import { Mail, MapPin, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export const metadata = { title: "Contactos | Viajando" }

export default function ContactPage() {
  // Dados da empresa configurados por ambiente para nao publicar contactos ficticios
  const supportEmail = process.env.SUPPORT_EMAIL
  const supportPhone = process.env.SUPPORT_PHONE
  const address = process.env.COMPANY_ADDRESS

  return (
    <main className="flex-1">
      <section className="w-full bg-muted/30 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contacte-nos</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-xl">
            Tem alguma dúvida sobre uma reserva ou sugestão? Fale connosco.
          </p>
        </div>
      </section>
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Envie-nos uma mensagem</h2>
              <p className="text-muted-foreground">Para questões sobre uma reserva, indique a referência de 8 caracteres.</p>
            </div>
            <ContactForm />
          </div>
          <div className="space-y-6 lg:pl-8">
            <h2 className="text-2xl font-bold">Outros contactos</h2>
            {supportEmail && (
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-6 w-6 text-primary" aria-hidden />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <a href={`mailto:${supportEmail}`} className="text-muted-foreground hover:underline">
                    {supportEmail}
                  </a>
                </div>
              </div>
            )}
            {supportPhone && (
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 text-primary" aria-hidden />
                <div>
                  <h3 className="font-bold">Telefone</h3>
                  <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="text-muted-foreground hover:underline">
                    {supportPhone}
                  </a>
                  <p className="text-sm text-muted-foreground">(Dias úteis, 9h–18h)</p>
                </div>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 text-primary" aria-hidden />
                <div>
                  <h3 className="font-bold">Morada</h3>
                  <p className="whitespace-pre-line text-muted-foreground">{address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
