import "server-only"
import nodemailer, { type Transporter } from "nodemailer"
import { getAppUrl } from "./env"
import { formatMoney } from "./money"
import { formatDuration } from "./offer-utils"

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (!process.env.SMTP_URL) return null
  transporter ??= nodemailer.createTransport(process.env.SMTP_URL)
  return transporter
}

export async function sendEmail(message: { to: string; subject: string; text: string; html: string }) {
  const transport = getTransporter()
  if (!transport) {
    console.info(`[email] SMTP nao configurado; email "${message.subject}" para ${message.to} nao enviado`)
    return false
  }

  try {
    await transport.sendMail({ from: process.env.EMAIL_FROM ?? "Viajando <no-reply@viajando.app>", ...message })
    return true
  } catch (error) {
    console.error("[email] Falha ao enviar:", error)
    return false
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

export async function sendBookingConfirmation(booking: {
  id: string
  origin: string
  destination: string
  departureDate: Date
  durationMinutes?: number
  carrierName: string | null
  amountCents: number
  currency: string
  locale: string
  email: string
  passengerName: string
}) {
  const reference = booking.id.slice(-8).toUpperCase()
  const when = booking.departureDate.toISOString().slice(0, 16).replace("T", " ")
  const total = formatMoney(booking.amountCents, booking.currency, booking.locale)
  const link = `${getAppUrl()}/${booking.locale}/dashboard/trips`
  const lines = [
    `Reserva ${reference} confirmada.`,
    `${booking.origin} -> ${booking.destination}, ${when}${booking.carrierName ? ` (${booking.carrierName})` : ""}`,
    booking.durationMinutes ? `Duracao: ${formatDuration(booking.durationMinutes)}` : "",
    `Passageiro: ${booking.passengerName}`,
    `Total pago: ${total}`,
  ].filter(Boolean)

  return sendEmail({
    to: booking.email,
    subject: `Viajando - reserva ${reference} confirmada`,
    text: `${lines.join("\n")}\n\nConsulte as suas viagens: ${link}`,
    html: `<p>${lines.map(escapeHtml).join("<br>")}</p><p><a href="${link}">Ver as minhas viagens</a></p>`,
  })
}
