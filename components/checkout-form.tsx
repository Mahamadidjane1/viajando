"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCheckout } from "@/app/actions/booking-actions"
import { passengerSchema, type PassengerFormData } from "@/lib/validations/booking"
import type { Locale } from "@/i18n-config"

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null
}

export function CheckoutForm({
  offerId,
  lang,
  defaultEmail,
  total,
}: {
  offerId: string
  lang: Locale
  defaultEmail: string
  total: string
}) {
  const [error, setError] = useState<{ message: string; offerExpired?: boolean } | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
    defaultValues: { email: defaultEmail },
  })

  const onSubmit = async (passenger: PassengerFormData) => {
    setError(null)
    if (!acceptTerms) {
      setError({ message: "Tem de aceitar os termos e condições para continuar." })
      return
    }
    const result = await createCheckout({ offerId, lang, passenger, acceptTerms: true })
    if ("checkoutUrl" in result) {
      window.location.assign(result.checkoutUrl)
      return
    }
    setError({ message: result.error, offerExpired: result.offerExpired })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <section className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Dados do passageiro</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome próprio</Label>
            <Input id="firstName" autoComplete="given-name" aria-invalid={!!errors.firstName} {...register("firstName")} />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apelido</Label>
            <Input id="lastName" autoComplete="family-name" aria-invalid={!!errors.lastName} {...register("lastName")} />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email para envio da confirmação</Label>
            <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Data de nascimento</Label>
            <Input id="dateOfBirth" type="date" autoComplete="bday" aria-invalid={!!errors.dateOfBirth} {...register("dateOfBirth")} />
            <FieldError message={errors.dateOfBirth?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="documentType">Tipo de documento</Label>
            <select
              id="documentType"
              defaultValue=""
              aria-invalid={!!errors.documentType}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("documentType")}
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="passport">Passaporte</option>
              <option value="id">Cartão de Cidadão / ID</option>
            </select>
            <FieldError message={errors.documentType?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentNumber">Número do documento</Label>
            <Input id="documentNumber" aria-invalid={!!errors.documentNumber} {...register("documentNumber")} />
            <FieldError message={errors.documentNumber?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telemóvel (opcional)</Label>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+351 912 345 678" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span>
            Li e aceito os{" "}
            <Link href={`/${lang}/terms`} target="_blank" className="text-primary underline">
              Termos e Condições
            </Link>{" "}
            e a{" "}
            <Link href={`/${lang}/privacy`} target="_blank" className="text-primary underline">
              Política de Privacidade
            </Link>
            , incluindo as condições tarifárias da transportadora.
          </span>
        </label>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}{" "}
            {error.offerExpired && (
              <Link href={`/${lang}`} className="font-semibold underline">
                Nova pesquisa
              </Link>
            )}
          </div>
        )}

        <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />A preparar o pagamento...
            </>
          ) : (
            <>
              Pagar {total} <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </>
          )}
        </Button>
      </section>
    </form>
  )
}
