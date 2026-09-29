import bcrypt from "bcryptjs"
import { z } from "zod"

const email = z.string().trim().toLowerCase().email("Email inválido").max(254)

export const passwordSchema = z
  .string()
  .min(8, "A password deve ter pelo menos 8 caracteres")
  .max(128, "A password é demasiado longa")
  .regex(/[A-Za-z]/, "A password deve conter pelo menos uma letra")
  .regex(/\d/, "A password deve conter pelo menos um número")

export const registerSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres").max(100),
  email,
  password: passwordSchema,
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Indique a password").max(128),
})

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
