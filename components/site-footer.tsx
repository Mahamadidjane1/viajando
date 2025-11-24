import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-muted/30 border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold">
                V
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">Viajando</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A sua plataforma europeia para viajar de comboio, autocarro e avião. Descubra Portugal e a Europa ao
              melhor preço.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Imprensa
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Centro de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contactos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Cancelamentos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Reclamações
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.livroreclamacoes.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Livro de Reclamações
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Viajando. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <span>Lisboa, Portugal 🇵🇹</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
