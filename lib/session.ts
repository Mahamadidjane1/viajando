import "server-only"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { i18n } from "@/i18n-config"

/** Utilizador autenticado ou redireciona para o login, voltando depois a `returnTo`. */
export async function requireUser(lang: string = i18n.defaultLocale, returnTo?: string) {
  const session = await auth()
  if (!session?.user?.id) {
    const callback = returnTo ? `?callbackUrl=${encodeURIComponent(returnTo)}` : ""
    redirect(`/${lang}/login${callback}`)
  }
  return session.user
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect(`/${i18n.defaultLocale}/login?callbackUrl=%2Fadmin`)
  if (session.user.role !== "ADMIN") redirect(`/${i18n.defaultLocale}`)
  return session.user
}

/** Aceita apenas caminhos relativos internos (evita open redirects). */
export function safeCallbackUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback
  }
  return value
}
