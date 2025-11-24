"use server"

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { hashPassword, registerSchema } from "@/lib/auth-helpers"

export const { handlers, auth, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({ where: { email } })

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})

export async function login(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    // Get session after successful login
    const { auth } = await import("@/auth")
    const session = await auth()

    return { user: session?.user }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Credenciais inválidas" }
    }
    console.error("[v0] Login error:", error)
    return { error: "Erro ao fazer login" }
  }
}

export async function register(name: string, email: string, password: string) {
  const validated = registerSchema.safeParse({ name, email, password })

  if (!validated.success) {
    return { error: "Dados inválidos" }
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

    const user = await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
        role: "USER",
      },
    })

    // Auto-login after registration
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    })

    return { user }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return { error: "Erro ao registar utilizador" }
  }
}
