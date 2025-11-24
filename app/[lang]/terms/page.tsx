import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-3xl py-12 md:py-24">
          <h1 className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl">Termos e Condições</h1>
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p className="lead">Última atualização: 21 de Novembro de 2025</p>
            <h3>1. Introdução</h3>
            <p>
              Bem-vindo à Viajando. Ao aceder ao nosso site e utilizar os nossos serviços, concorda em cumprir estes
              Termos e Condições. Por favor, leia-os atentamente.
            </p>
            <h3>2. Serviços</h3>
            <p>
              A Viajando atua como intermediária na venda de bilhetes de transporte (voos, comboios, autocarros). Não
              operamos os serviços de transporte diretamente.
            </p>
            <h3>3. Reservas e Pagamentos</h3>
            <p>
              Todas as reservas estão sujeitas à disponibilidade e confirmação. O pagamento deve ser efetuado no momento
              da reserva. Aceitamos cartões de crédito, MB WAY e Multibanco.
            </p>
            <h3>4. Cancelamentos e Reembolsos</h3>
            <p>
              As políticas de cancelamento variam de acordo com o operador de transporte. Recomendamos que verifique as
              condições específicas do seu bilhete antes da compra.
            </p>
            <h3>5. Responsabilidade</h3>
            <p>
              A Viajando não se responsabiliza por atrasos, cancelamentos ou alterações de horário por parte dos
              operadores de transporte, embora façamos o possível para apoiar os nossos clientes nestas situações.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
