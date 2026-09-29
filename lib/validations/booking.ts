import { z } from "zod"
import { i18n } from "@/i18n-config"

const today = () => new Date().toISOString().slice(0, 10)

export const passengerSchema = z.object({
  firstName: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(60),
  lastName: z.string().trim().min(2, "Apelido deve ter pelo menos 2 caracteres").max(60),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Indique a data de nascimento")
    .refine((value) => value < today() && value > "1900-01-01", "Data de nascimento inválida"),
  documentType: z.enum(["passport", "id"], {
    errorMap: () => ({ message: "Selecione o tipo de documento" }),
  }),
  documentNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{5,20}$/, "Número de documento inválido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{7,20}$/, "Número de telemóvel inválido")
    .optional()
    .or(z.literal("")),
})

/** O cliente envia apenas a oferta escolhida e os dados do passageiro; o preco e decidido no servidor. */
export const checkoutSchema = z.object({
  offerId: z.string().uuid(),
  lang: z.enum(i18n.locales),
  passenger: passengerSchema,
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Tem de aceitar os termos e condições" }) }),
})

export type PassengerFormData = z.infer<typeof passengerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
