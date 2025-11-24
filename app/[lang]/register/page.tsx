import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
              <p className="text-sm text-gray-500">Junte-se a nós e comece a viajar com vantagens</p>
            </div>

            <RegisterForm />

            <div className="text-center text-sm text-gray-500">
              Já tem conta?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Entrar agora
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
            Ao registar-se, aceita os nossos Termos e Condições e Política de Privacidade.
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
