"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/email"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Indique o seu nome").max(100),
  email: z.string().trim().email("Email inválido"),
  message: z.string().trim().min(10, "A mensagem é demasiado curta").max(5000),
  // campo invisivel: bots preenchem-no, pessoas nao
  website: z.string().max(0).optional(),
})

export async function sendContactMessage(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }

  if (!(await rateLimit("contact", await getClientIp(), { limit: 3, windowSeconds: 60 * 60 }))) {
    return { error: "Já enviou várias mensagens. Tente novamente mais tarde." }
  }

  const to = process.env.SUPPORT_EMAIL
  if (!to) return { error: "O formulário está temporariamente indisponível. Use o email de apoio." }

  const { name, email, message } = parsed.data
  const sent = await sendEmail({
    to,
    subject: `Contacto de ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
    html: `<p>De: ${name.replace(/</g, "&lt;")} &lt;${email.replace(/</g, "&lt;")}&gt;</p><pre>${message.replace(/</g, "&lt;")}</pre>`,
  })

  return sent ? { success: true } : { error: "Não foi possível enviar a mensagem. Tente novamente." }
}
