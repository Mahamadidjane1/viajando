import Link from "next/link"
import type { Locale } from "@/i18n-config"

export function SiteFooter({ lang }: { lang: Locale }) {
  const columns = [
    {
      title: "Viajando",
      links: [
        { href: `/${lang}/about`, label: "Sobre nós" },
        { href: `/${lang}/contact`, label: "Contactos" },
      ],
    },
    {
      title: "Conta",
      links: [
        { href: `/${lang}/dashboard/trips`, label: "As minhas viagens" },
        { href: `/${lang}/dashboard/settings`, label: "Definições e privacidade" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: `/${lang}/terms`, label: "Termos e Condições" },
        { href: `/${lang}/privacy`, label: "Política de Privacidade e Cookies" },
      ],
    },
  ]

  return (
    <footer className="border-t bg-muted/30 pb-8 pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
                V
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">Viajando</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Compare e reserve viagens em Portugal e na Europa, com preços finais e pagamento seguro.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 font-semibold">{column.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {column.title === "Legal" && (
                  <li>
                    <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      Livro de Reclamações
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Viajando. Todos os direitos reservados.</p>
          <span>Lisboa, Portugal</span>
        </div>
      </div>
    </footer>
  )
}
