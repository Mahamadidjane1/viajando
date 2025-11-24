import { NextResponse } from "next/server"
import { searchFlightsSafe } from "@/lib/amadeus-service"
import { MOCK_RESULTS } from "@/lib/mock-data"
import { z } from "zod"

// Input validation schema
const searchSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.string().optional().default("1"),
})

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    // 1. Validate Input
    const body = await request.json()
    const validation = searchSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters", details: validation.error.errors },
        { status: 400 },
      )
    }

    const { origin, destination, date, adults } = validation.data

    // 2. Call Service (which handles Cache & Amadeus)
    const rawResults = await searchFlightsSafe({ origin, destination, date, adults })

    // 3. Process Results
    const hasResults = Array.isArray(rawResults) && rawResults.length > 0

    // 4. Log Metadata (Simulation of database logging)
    console.log("[Search Log]", {
      origin,
      destination,
      date,
      source: hasResults ? "amadeus/cache" : "mock",
      latency: Date.now() - startTime,
    })

    // 5. Return Response
    if (hasResults) {
      return NextResponse.json({
        success: true,
        source: "provider",
        data: rawResults,
      })
    } else {
      // Explicit Fallback
      return NextResponse.json({
        success: true, // True because we are successfully returning fallback data
        source: "mock",
        mock_reason: "provider_unavailable_or_empty",
        data: MOCK_RESULTS,
      })
    }
  } catch (error) {
    console.error("[API] Search error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
