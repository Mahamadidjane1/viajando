"use client"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { i18n, type Locale } from "@/i18n-config"

export function LanguageSelector({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return "/"
    const segments = pathname.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  const handleLanguageChange = (locale: Locale) => {
    router.push(redirectedPathName(locale))
  }

  const getLanguageName = (locale: Locale) => {
    switch (locale) {
      case "pt":
        return "Português (PT)"
      case "en":
        return "English (UK)"
      case "es":
        return "Español"
      case "fr":
        return "Français"
      default:
        return locale
    }
  }

  const getFlag = (locale: Locale) => {
    switch (locale) {
      case "pt":
        return "🇵🇹"
      case "en":
        return "🇬🇧"
      case "es":
        return "🇪🇸"
      case "fr":
        return "🇫🇷"
      default:
        return "🌍"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span className="uppercase">{currentLang}</span> | EUR
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => handleLanguageChange(locale)}>
            <span className="mr-2">{getFlag(locale)}</span>
            {getLanguageName(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
