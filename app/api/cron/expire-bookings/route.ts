import { NextResponse } from "next/server"
import { timingSafeEqual } from "node:crypto"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET
  const header = req.headers.get("authorization") ?? ""
  if (!secret) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const received = Buffer.from(header)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

/**
 * Marca como EXPIRED reservas pendentes cujo checkout ja caducou.
 * Rede de seguranca caso o webhook `checkout.session.expired` falhe.
 * Agendar a cada 15 min (ex.: Vercel Cron) com `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) return new NextResponse("Unauthorized", { status: 401 })

  const { count } = await prisma.booking.updateMany({
    where: { status: "PENDING", expiresAt: { lt: new Date(Date.now() - 60 * 60 * 1000) } },
    data: { status: "EXPIRED" },
  })

  return NextResponse.json({ expired: count })
}
