import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import { safeCallbackUrl } from "@/lib/session"
import type { Locale } from "@/i18n-config"

export const metadata = { title: "Entrar | Viajando" }

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { lang } = await params
  const callbackUrl = safeCallbackUrl((await searchParams).callbackUrl, "") || undefined

  const session = await auth()
  if (session?.user) redirect(callbackUrl ?? `/${lang}/dashboard`)

  const registerHref = `/${lang}/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`

  return (
    <AuthCard
      lang={lang}
      title="Bem-vindo de volta"
      subtitle="Entre para gerir as suas viagens"
      callbackUrl={callbackUrl}
      footer={
        <>
          Não tem conta?{" "}
          <Link href={registerHref} className="font-medium text-primary hover:underline">
            Registar agora
          </Link>
        </>
      }
    >
      <LoginForm lang={lang} callbackUrl={callbackUrl} />
    </AuthCard>
  )
}
