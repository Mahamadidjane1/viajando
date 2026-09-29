"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/db"
import { hashPassword, passwordSchema, verifyPassword } from "@/lib/auth-helpers"

type Result = { success?: boolean; error?: string }

export async function updateProfile(formData: FormData): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." }

  const parsed = z.string().trim().min(2).max(100).safeParse(formData.get("name"))
  if (!parsed.success) return { error: "O nome deve ter entre 2 e 100 caracteres" }

  await prisma.user.update({ where: { id: session.user.id }, data: { name: parsed.data } })
  revalidatePath("/", "layout")
  return { success: true }
}

export async function changePassword(formData: FormData): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." }

  const next = passwordSchema.safeParse(formData.get("newPassword"))
  if (!next.success) return { error: next.error.issues[0]?.message }
  if (formData.get("newPassword") !== formData.get("confirmPassword")) return { error: "As passwords não coincidem" }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { password: true } })
  if (user?.password) {
    const current = String(formData.get("currentPassword") ?? "")
    if (!(await verifyPassword(current, user.password))) return { error: "A password atual está incorreta" }
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { password: await hashPassword(next.data) } })
  return { success: true }
}

/**
 * Direito ao apagamento (RGPD art. 17): remove dados pessoais da conta.
 * As reservas pagas sao mantidas de forma anonimizada por obrigacao fiscal.
 */
export async function deleteAccount(formData: FormData): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." }
  if (formData.get("confirm") !== "APAGAR") return { error: 'Escreva "APAGAR" para confirmar' }

  const userId = session.user.id
  await prisma.$transaction([
    prisma.account.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.booking.deleteMany({ where: { userId, status: { in: ["PENDING", "EXPIRED", "FAILED"] } } }),
    prisma.booking.updateMany({ where: { userId }, data: { passengers: { redacted: true } } }),
    prisma.user.update({
      where: { id: userId },
      data: { name: null, email: `deleted-${userId}@invalid`, image: null, password: null, emailVerified: null },
    }),
  ])

  await signOut({ redirectTo: "/" })
  return { success: true }
}
