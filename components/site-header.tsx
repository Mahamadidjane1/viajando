import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { UserMenu } from "@/components/user-menu"
import { getSession } from "@/lib/auth-session"
import type { Locale } from "@/i18n-config"

export async function SiteHeader({ lang, dictionary }: { lang: Locale; dictionary: any }) {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold">
              V
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Viajando</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href={`/${lang}/search?type=flight`} className="hover:text-primary transition-colors">
              {dictionary.navigation.flights}
            </Link>
            <Link href={`/${lang}/search?type=train`} className="hover:text-primary transition-colors">
              {dictionary.navigation.trains}
            </Link>
            <Link href={`/${lang}/search?type=bus`} className="hover:text-primary transition-colors">
              {dictionary.navigation.buses}
            </Link>
            <Link href={`/${lang}/search?type=hotel`} className="hover:text-primary transition-colors">
              {dictionary.navigation.hotels}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSelector currentLang={lang} />
          </div>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <UserMenu user={session.user} lang={lang} dictionary={dictionary} />
            ) : (
              <>
                <Link href={`/${lang}/login`}>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    {dictionary.navigation.login}
                  </Button>
                </Link>
                <Link href={`/${lang}/register`}>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    {dictionary.navigation.register}
                  </Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
