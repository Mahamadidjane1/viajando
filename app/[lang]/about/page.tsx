import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sobre a Viajando</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A conectar pessoas e destinos em toda a Europa, de forma simples e acessível.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">A Nossa Missão</h2>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  A Viajando nasceu em 2024 com um objetivo claro: tornar a compra de bilhetes de transporte na Europa
                  tão fácil quanto pedir um café.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Acreditamos que viajar não deve ser complicado. Por isso, reunimos voos, comboios e autocarros numa
                  única plataforma, permitindo que compare e reserve a melhor opção em segundos.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Com sede em Lisboa, somos uma equipa apaixonada por tecnologia e viagens, dedicada a criar a melhor
                  experiência para os nossos utilizadores.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl object-cover object-center lg:aspect-square">
                <Image
                  src="/modern-office-teamwork.png"
                  alt="Equipa Viajando"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
