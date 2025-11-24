"use server"

import { prisma } from "@/lib/db"
import { hashPassword, registerSchema } from "@/lib/auth-helpers"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import type { Locale } from "@/i18n-config"

export async function registerUser(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validated = registerSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Dados inválidos", details: validated.error.errors }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    })

    if (existingUser) {
      return { error: "Email já registado" }
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validated.data.password)

    await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
        role: "USER",
      },
    })

    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return { error: "Erro ao registar utilizador" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Credenciais inválidas" }
    }
    console.error("[v0] Login error:", error)
    return { error: "Erro ao fazer login" }
  }
}

export async function logoutUser(lang: Locale) {
  await signOut({ redirectTo: `/${lang}` })
}
