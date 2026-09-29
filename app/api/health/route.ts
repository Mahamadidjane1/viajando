import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

/** Verificacao de saude para o load balancer / monitorizacao. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: "ok", time: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: "error", database: "unreachable" }, { status: 503 })
  }
}
