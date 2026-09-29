import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./i18n-config"

/** Rotas fora do sistema de idiomas (/[lang]/...). */
const UNLOCALIZED_PREFIXES = ["/api", "/admin", "/_next"]

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language")
  if (!acceptLanguage) return i18n.defaultLocale

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [tag, q] = lang.trim().split(";")
      const quality = q ? Number.parseFloat(q.split("=")[1]) : 1
      return { locale: tag.split("-")[0].toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality }
    })
    .sort((a, b) => b.quality - a.quality)

  const match = languages.find(({ locale }) => (i18n.locales as readonly string[]).includes(locale))
  return match?.locale ?? i18n.defaultLocale
}

const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"]

/** Primeira barreira: sem cookie de sessao nem chega a renderizar. As paginas voltam a validar a sessao e o papel. */
function requiresLogin(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || /^\/[a-z]{2}\/dashboard(\/|$)/.test(pathname)
}

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (requiresLogin(pathname) && !SESSION_COOKIES.some((name) => req.cookies.has(name))) {
    const lang = pathname.startsWith("/admin") ? i18n.defaultLocale : pathname.slice(1, 3)
    const url = req.nextUrl.clone()
    url.pathname = `/${lang}/login`
    url.search = `?callbackUrl=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  if (UNLOCALIZED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next()
  }

  const hasLocale = i18n.locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  if (hasLocale) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/${getLocale(req)}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
