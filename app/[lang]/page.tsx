import { Button } from "@/components/ui/button"
import { Plane, Train, Bus, Search, ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import { SearchWidget } from "@/components/search-widget"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function Home({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden border-b bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              {dict.home.hero.title} <span className="text-secondary">{dict.home.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">{dict.home.hero.subtitle}</p>
          </div>

          <SearchWidget lang={params.lang} />
        </div>
      </section>

      {/* Features / Value Prop */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{dict.home.features.smartComparison.title}</h3>
              <p className="text-muted-foreground text-sm">{dict.home.features.smartComparison.description}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 text-secondary-foreground">
                <Train className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{dict.home.features.europeExperts.title}</h3>
              <p className="text-muted-foreground text-sm">{dict.home.features.europeExperts.description}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-700">
                <div className="font-bold text-lg">€</div>
              </div>
              <h3 className="font-bold text-lg mb-2">{dict.home.features.noHiddenFees.title}</h3>
              <p className="text-muted-foreground text-sm">{dict.home.features.noHiddenFees.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Destinos Populares</h2>
              <p className="text-muted-foreground">As rotas mais procuradas pelos nossos viajantes</p>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2 bg-transparent">
              Ver todos os destinos <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Destination Card 1 */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
              <Image
                src="/lisbon-portugal-tram-sunny-street.jpg"
                alt="Lisboa"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-1 rounded mb-2 inline-block">
                  Portugal
                </span>
                <h3 className="text-2xl font-bold mb-1">Lisboa</h3>
                <p className="text-sm text-white/80">Voos desde €29</p>
              </div>
            </div>

            {/* Destination Card 2 */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
              <Image
                src="/porto-portugal-river-bridge.jpg"
                alt="Porto"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-1 rounded mb-2 inline-block">
                  Portugal
                </span>
                <h3 className="text-2xl font-bold mb-1">Porto</h3>
                <p className="text-sm text-white/80">Comboios desde €15</p>
              </div>
            </div>

            {/* Destination Card 3 */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
              <Image
                src="/madrid-spain-plaza-mayor.jpg"
                alt="Madrid"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded mb-2 inline-block">
                  Espanha
                </span>
                <h3 className="text-2xl font-bold mb-1">Madrid</h3>
                <p className="text-sm text-white/80">Autocarros desde €19</p>
              </div>
            </div>

            {/* Destination Card 4 */}
            <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
              <Image
                src="/paris-france-eiffel-tower.jpg"
                alt="Paris"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded mb-2 inline-block">
                  França
                </span>
                <h3 className="text-2xl font-bold mb-1">Paris</h3>
                <p className="text-sm text-white/80">Voos desde €45</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">O que dizem os nossos viajantes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que confiam na Viajando para as suas aventuras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ana Silva",
                role: "Viajante Frequente",
                content:
                  "A melhor plataforma para encontrar bilhetes baratos. Consegui ir a Madrid por metade do preço habitual!",
                rating: 5,
              },
              {
                name: "Pedro Santos",
                role: "Estudante",
                content:
                  "Adoro a facilidade de comparar comboios e autocarros. A interface é super intuitiva e rápida.",
                rating: 5,
              },
              {
                name: "Maria Costa",
                role: "Nómada Digital",
                content:
                  "O suporte ao cliente é fantástico e o processo de reserva é muito transparente. Recomendo vivamente.",
                rating: 4,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? "fill-secondary text-secondary" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Parceiros Oficiais
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using text placeholders for logos to save tokens, in real app would be SVGs/Images */}
            <div className="text-xl font-bold flex items-center gap-2">
              <Train className="w-6 h-6" /> CP - Comboios de Portugal
            </div>
            <div className="text-xl font-bold flex items-center gap-2">
              <Plane className="w-6 h-6" /> TAP Air Portugal
            </div>
            <div className="text-xl font-bold flex items-center gap-2">
              <Bus className="w-6 h-6" /> FlixBus
            </div>
            <div className="text-xl font-bold flex items-center gap-2">
              <Train className="w-6 h-6" /> Renfe
            </div>
            <div className="text-xl font-bold flex items-center gap-2">
              <Plane className="w-6 h-6" /> Ryanair
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{dict.home.cta.title}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{dict.home.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg px-8"
            >
              {dict.home.cta.buttonPrimary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 font-bold text-lg px-8"
            >
              {dict.home.cta.buttonSecondary}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
