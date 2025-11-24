import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-3xl py-12 md:py-24">
          <h1 className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl">Política de Privacidade</h1>
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p className="lead">
              A sua privacidade é importante para nós. Esta política explica como recolhemos, utilizamos e protegemos os
              seus dados pessoais.
            </p>
            <h3>1. Recolha de Dados</h3>
            <p>
              Recolhemos informações que nos fornece diretamente, como nome, email, telefone e dados de pagamento,
              necessários para processar as suas reservas.
            </p>
            <h3>2. Utilização dos Dados</h3>
            <p>Utilizamos os seus dados para:</p>
            <ul>
              <li>Processar e confirmar as suas reservas;</li>
              <li>Enviar bilhetes e atualizações de viagem;</li>
              <li>Melhorar os nossos serviços e suporte ao cliente;</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
            <h3>3. Partilha de Dados</h3>
            <p>
              Partilhamos os dados estritamente necessários com os operadores de transporte para a emissão dos bilhetes.
              Não vendemos os seus dados a terceiros.
            </p>
            <h3>4. Segurança</h3>
            <p>
              Implementamos medidas de segurança técnicas e organizativas para proteger os seus dados contra acesso não
              autorizado, perda ou alteração.
            </p>
            <h3>5. Os Seus Direitos</h3>
            <p>
              Tem o direito de aceder, retificar ou solicitar a eliminação dos seus dados pessoais a qualquer momento.
              Contacte-nos através de privacidade@viajando.com.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
