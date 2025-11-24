import { z } from "zod"

export const passengerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Apelido deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  documentType: z.enum(["passport", "id"], {
    required_error: "Selecione o tipo de documento",
  }),
  documentNumber: z.string().min(5, "Número de documento inválido"),
  phone: z.string().optional(),
})

export const bookingSchema = z.object({
  origin: z.string().min(3),
  destination: z.string().min(3),
  departureDate: z.string(),
  price: z.number().positive(),
  passenger: passengerSchema,
})

export type PassengerFormData = z.infer<typeof passengerSchema>
export type BookingFormData = z.infer<typeof bookingSchema>
