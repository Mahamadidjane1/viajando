import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AuthCard } from "@/components/auth/auth-card"
import { RegisterForm } from "@/components/auth/register-form"
import { safeCallbackUrl } from "@/lib/session"
import type { Locale } from "@/i18n-config"

export const metadata = { title: "Criar conta | Viajando" }

export default async function RegisterPage({
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

  const loginHref = `/${lang}/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`

  return (
    <AuthCard
      lang={lang}
      title="Criar conta"
      subtitle="Registe-se para reservar e acompanhar as suas viagens"
      callbackUrl={callbackUrl}
      footer={
        <>
          Já tem conta?{" "}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm lang={lang} callbackUrl={callbackUrl} />
    </AuthCard>
  )
}
