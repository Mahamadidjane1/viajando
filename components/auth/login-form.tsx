"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/app/actions/auth-actions"

export function LoginForm({ lang, callbackUrl }: { lang: string; callbackUrl?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await loginUser(new FormData(event.currentTarget))
      if (result.error) {
        setError(result.error)
        return
      }
      router.push(result.redirectTo || `/${lang}/dashboard`)
      router.refresh()
    } catch {
      setError("Ocorreu um erro ao entrar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required disabled={isLoading} />
      </div>

      {error && (
        <div role="alert" className="rounded bg-red-50 p-2 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" className="mt-4 h-11 w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />A entrar...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}
