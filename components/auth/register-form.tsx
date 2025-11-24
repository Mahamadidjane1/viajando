"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions/auth-actions"
import { Loader2 } from "lucide-react"

export function RegisterForm({ lang }: { lang: string }) {
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
        // Redirect to dashboard after successful registration
        router.push(`/${lang}/dashboard`)
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
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" placeholder="João Silva" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="seu@email.com" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} />
      </div>

      {error && <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">{error}</div>}

      <Button className="w-full h-11 mt-4 bg-primary hover:bg-primary/90" disabled={isLoading}>
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
