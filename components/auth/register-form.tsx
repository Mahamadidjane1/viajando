"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions/auth-actions"
import { Loader2 } from "lucide-react"

export function RegisterForm({ lang, callbackUrl }: { lang: string; callbackUrl?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("As passwords não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const result = await registerUser(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        router.push(result.redirectTo || `/${lang}/dashboard`)
        router.refresh()
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" autoComplete="name" required minLength={2} disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          aria-describedby="password-hint"
          disabled={isLoading}
        />
        <p id="password-hint" className="text-xs text-gray-500">
          Mínimo 8 caracteres, com letras e números.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required disabled={isLoading} />
      </div>

      {error && (
        <div role="alert" className="rounded bg-red-50 p-2 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" className="mt-4 h-11 w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />A criar conta...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>
    </form>
  )
}
