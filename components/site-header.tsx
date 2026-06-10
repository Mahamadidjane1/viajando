import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { UserMenu } from "@/components/user-menu"
import { getSession } from "@/lib/auth-session"
import type { Locale } from "@/i18n-config"

function NavLinks({ lang, dictionary, className = "" }: { lang: Locale; dictionary: any; className?: string }) {
  const links = [
    { href: `/${lang}/search?type=flight`, label: dictionary.navigation.flights },
    { href: `/${lang}/search?type=train`, label: dictionary.navigation.trains },
    { href: `/${lang}/search?type=bus`, label: dictionary.navigation.buses },
    { href: `/${lang}/search?type=hotel`, label: dictionary.navigation.hotels },
  ]

  return (
    <nav className={className} aria-label="Navegacao principal">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="rounded-sm px-1 py-1 transition-colors hover:text-primary">
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export async function SiteHeader({ lang, dictionary }: { lang: Locale; dictionary: any }) {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href={`/${lang}`} className="flex items-center gap-2" aria-label="Viajando homepage">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              V
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Viajando</span>
          </Link>

          <NavLinks lang={lang} dictionary={dictionary} className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex" />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSelector currentLang={lang} />
          {session?.user ? (
            <UserMenu user={session.user} lang={lang} dictionary={dictionary} />
          ) : (
            <>
              <Link href={`/${lang}/login`}>
                <Button variant="ghost" size="sm">
                  {dictionary.navigation.login}
                </Button>
              </Link>
              <Link href={`/${lang}/register`}>
                <Button size="sm">{dictionary.navigation.register}</Button>
              </Link>
            </>
          )}
        </div>

        <details className="group relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-border">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-lg border border-border bg-background p-3 shadow-lg">
            <NavLinks lang={lang} dictionary={dictionary} className="flex flex-col gap-2 text-sm font-medium text-muted-foreground" />
            <div className="my-3 border-t border-border" />
            <div className="flex items-center justify-between gap-3">
              <LanguageSelector currentLang={lang} />
              {session?.user ? (
                <UserMenu user={session.user} lang={lang} dictionary={dictionary} />
              ) : (
                <Link href={`/${lang}/login`}>
                  <Button variant="outline" size="sm">
                    {dictionary.navigation.login}
                  </Button>
                </Link>
              )}
            </div>
            {!session?.user ? (
              <Link href={`/${lang}/register`} className="mt-3 block">
                <Button size="sm" className="w-full">
                  {dictionary.navigation.register}
                </Button>
              </Link>
            ) : null}
          </div>
        </details>
      </div>
    </header>
  )
}
