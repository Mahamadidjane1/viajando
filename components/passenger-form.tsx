"use client"

import React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { passengerSchema, type PassengerFormData } from "@/lib/validations/booking"

export function PassengerForm({
  onDataChange,
}: {
  onDataChange: (data: PassengerFormData) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
  })

  const watchedData = watch()

  // Notify parent whenever form data changes
  React.useEffect(() => {
    const subscription = watch((data) => {
      // Only notify if we have valid data
      const result = passengerSchema.safeParse(data)
      if (result.success) {
        onDataChange(result.data)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, onDataChange])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome Próprio</Label>
          <Input id="firstName" placeholder="Como no documento" {...register("firstName")} />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apelido</Label>
          <Input id="lastName" placeholder="Como no documento" {...register("lastName")} />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email para envio do bilhete</Label>
        <Input id="email" type="email" placeholder="exemplo@email.com" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de Documento</Label>
          <Select onValueChange={(value) => setValue("documentType", value as "passport" | "id")}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passaporte</SelectItem>
              <SelectItem value="id">Cartão de Cidadão / ID</SelectItem>
            </SelectContent>
          </Select>
          {errors.documentType && <p className="text-sm text-red-500">{errors.documentType.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Número do Documento</Label>
          <Input id="documentNumber" placeholder="Nº do documento" {...register("documentNumber")} />
          {errors.documentNumber && <p className="text-sm text-red-500">{errors.documentNumber.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telemóvel (Opcional)</Label>
        <Input id="phone" type="tel" placeholder="+351 912 345 678" {...register("phone")} />
        <p className="text-xs text-gray-500">Para receber atualizações sobre a viagem via SMS.</p>
      </div>
    </div>
  )
}
