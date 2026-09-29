import Link from "next/link"
import { Button } from "@/components/ui/button"
import { isGoogleAuthEnabled } from "@/auth"
import { loginWithGoogle } from "@/app/actions/auth-actions"
import type { Locale } from "@/i18n-config"

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export function AuthCard({
  lang,
  title,
  subtitle,
  callbackUrl,
  footer,
  children,
}: {
  lang: Locale
  title: string
  subtitle: string
  callbackUrl?: string
  footer: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          {isGoogleAuthEnabled && (
            <>
              <form action={loginWithGoogle.bind(null, lang, callbackUrl)}>
                <Button variant="outline" className="h-11 w-full gap-2 font-medium" type="submit">
                  <GoogleIcon />
                  Continuar com Google
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou com email</span>
                </div>
              </div>
            </>
          )}

          {children}

          <div className="text-center text-sm text-gray-500">{footer}</div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 p-4 text-center text-xs text-gray-500">
          Ao continuar, aceita os nossos{" "}
          <Link href={`/${lang}/terms`} className="underline">
            Termos e Condições
          </Link>{" "}
          e a{" "}
          <Link href={`/${lang}/privacy`} className="underline">
            Política de Privacidade
          </Link>
          .
        </div>
      </div>
    </main>
  )
}
