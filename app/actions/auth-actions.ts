"use server"

import { prisma } from "@/lib/db"
import { hashPassword, loginSchema, registerSchema } from "@/lib/auth-helpers"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { i18n, type Locale } from "@/i18n-config"
import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { safeCallbackUrl } from "@/lib/session"

type AuthResult = { error?: string; fieldErrors?: Record<string, string[] | undefined>; success?: boolean; redirectTo?: string }

const TOO_MANY = "Demasiadas tentativas. Aguarde alguns minutos e tente novamente."

export async function registerUser(formData: FormData): Promise<AuthResult> {
  const ip = await getClientIp()
  if (!(await rateLimit("register", ip, RATE_LIMITS.register))) return { error: TOO_MANY }

  const validated = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors
    return { error: Object.values(fieldErrors).flat()[0] ?? "Dados inválidos", fieldErrors }
  }

  const { name, email, password } = validated.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (existingUser) return { error: "Já existe uma conta com este email" }

    await prisma.user.create({
      data: { name, email, password: await hashPassword(password) },
    })

    await signIn("credentials", { email, password, redirect: false })
    return { success: true, redirectTo: safeCallbackUrl(formData.get("callbackUrl"), "") || undefined }
  } catch (error) {
    console.error("[auth] Registration error:", error)
    return { error: "Não foi possível criar a conta. Tente novamente." }
  }
}

export async function loginUser(formData: FormData): Promise<AuthResult> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") })
  if (!parsed.success) return { error: "Email ou password inválidos" }

  const ip = await getClientIp()
  const allowed =
    (await rateLimit("login-ip", ip, RATE_LIMITS.login)) &&
    (await rateLimit("login-email", parsed.data.email, RATE_LIMITS.login))
  if (!allowed) return { error: TOO_MANY }

  try {
    await signIn("credentials", { ...parsed.data, redirect: false })
    return { success: true, redirectTo: safeCallbackUrl(formData.get("callbackUrl"), "") || undefined }
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email ou password inválidos" }
    console.error("[auth] Login error:", error)
    return { error: "Não foi possível entrar. Tente novamente." }
  }
}

export async function loginWithGoogle(lang: Locale, callbackUrl?: string) {
  await signIn("google", { redirectTo: safeCallbackUrl(callbackUrl, `/${lang}/dashboard`) })
}

export async function logoutUser(lang: Locale) {
  const locale = i18n.locales.includes(lang) ? lang : i18n.defaultLocale
  await signOut({ redirectTo: `/${locale}` })
}
