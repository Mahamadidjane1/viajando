import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./i18n-config"

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language")

  if (!acceptLanguage) {
    return i18n.defaultLocale
  }

  // Parse accept-language header manually
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";")
      const locale = parts[0].split("-")[0] // Get just the language code (pt, en, es, fr)
      const quality = parts[1] ? Number.parseFloat(parts[1].split("=")[1]) : 1.0
      return { locale, quality }
    })
    .sort((a, b) => b.quality - a.quality)

  // Find first matching locale from our supported locales
  for (const { locale } of languages) {
    if (i18n.locales.includes(locale as any)) {
      return locale
    }
  }

  return i18n.defaultLocale
}

export default function middleware(req: NextRequest) {
  const { nextUrl } = req

  // Skip middleware for API routes, static files, and _next
  if (nextUrl.pathname.startsWith("/api") || nextUrl.pathname.startsWith("/_next") || nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !nextUrl.pathname.startsWith(`/${locale}/`) && nextUrl.pathname !== `/${locale}`,
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(req)
    return NextResponse.redirect(
      new URL(`/${locale}${nextUrl.pathname.startsWith("/") ? "" : "/"}${nextUrl.pathname}`, req.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
