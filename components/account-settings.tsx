"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword, deleteAccount, updateProfile } from "@/app/actions/account-actions"

type Action = (formData: FormData) => Promise<{ success?: boolean; error?: string }>

function useFormAction(action: Action, successMessage: string) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const result = await action(data)
      setFeedback(result.error ? { ok: false, text: result.error } : { ok: true, text: successMessage })
      if (result.success) form.querySelectorAll<HTMLInputElement>("input[type=password]").forEach((i) => (i.value = ""))
    })
  }

  return { pending, feedback, onSubmit }
}

function Feedback({ feedback }: { feedback: { ok: boolean; text: string } | null }) {
  if (!feedback) return null
  return (
    <p role="status" className={feedback.ok ? "text-sm text-green-700" : "text-sm text-red-600"}>
      {feedback.text}
    </p>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function AccountSettings({ name, email, hasPassword }: { name: string; email: string; hasPassword: boolean }) {
  const profile = useFormAction(updateProfile, "Perfil atualizado.")
  const password = useFormAction(changePassword, "Password alterada.")
  const removal = useFormAction(deleteAccount, "Conta apagada.")

  return (
    <div className="space-y-6">
      <Section title="Perfil">
        <form onSubmit={profile.onSubmit} className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={name} autoComplete="name" required minLength={2} maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled readOnly />
          </div>
          <Feedback feedback={profile.feedback} />
          <Button type="submit" disabled={profile.pending}>
            {profile.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            Guardar
          </Button>
        </form>
      </Section>

      <Section title={hasPassword ? "Alterar password" : "Definir password"}>
        <form onSubmit={password.onSubmit} className="max-w-md space-y-4">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password atual</Label>
              <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova password</Label>
            <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
            <p className="text-xs text-gray-500">Mínimo 8 caracteres, com letras e números.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
          </div>
          <Feedback feedback={password.feedback} />
          <Button type="submit" disabled={password.pending}>
            {password.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            Guardar password
          </Button>
        </form>
      </Section>

      <Section
        title="Apagar conta"
        description="Os seus dados pessoais são apagados de forma permanente. Reservas pagas são mantidas de forma anónima por obrigação legal (faturação)."
      >
        <form onSubmit={removal.onSubmit} className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm">Escreva APAGAR para confirmar</Label>
            <Input id="confirm" name="confirm" autoComplete="off" required pattern="APAGAR" />
          </div>
          <Feedback feedback={removal.feedback} />
          <Button type="submit" variant="destructive" disabled={removal.pending}>
            {removal.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            Apagar a minha conta
          </Button>
        </form>
      </Section>
    </div>
  )
}
