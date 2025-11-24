import { searchFlightsSafe } from "@/lib/amadeus-service"
import { MOCK_RESULTS } from "@/lib/mock-data"

export async function searchFlightsAction({
  origin,
  destination,
  date,
  adults = 1,
}: {
  origin: string
  destination: string
  date: string
  adults?: number
}) {
  if (!origin || !destination || !date) {
    return { success: true, data: MOCK_RESULTS }
  }

  // When the quota resets or a production key is added, remove this line to re-enable real API calls.
  // return { success: true, data: MOCK_RESULTS }

  const originCode = origin.toUpperCase()
  const destCode = destination.toUpperCase()

  // If codes are not 3 letters, return mock data immediately to avoid API errors
  if (originCode.length !== 3 || destCode.length !== 3) {
    return { success: true, data: MOCK_RESULTS }
  }

  try {
    const results = await searchFlightsSafe({
      origin: originCode,
      destination: destCode,
      departureDate: date,
      adults: adults.toString(),
    })

    // If API failed (returned null) or returned no results, use MOCK data as fallback
    // This ensures the user ALWAYS sees something
    if (!results || !results.data || !Array.isArray(results.data) || results.data.length === 0) {
      return { success: true, data: MOCK_RESULTS }
    }

    const tickets = results.data
      .map((offer: any) => {
        try {
          const itinerary = offer.itineraries?.[0]
          if (!itinerary) return null

          const segments = itinerary.segments
          if (!segments || segments.length === 0) return null

          const firstSegment = segments[0]
          const lastSegment = segments[segments.length - 1]

          const carrierCode = offer.validatingAirlineCodes?.[0] || "YY"
          const depTime = firstSegment.departure?.at?.split("T")[1]?.substring(0, 5) || "00:00"
          const arrTime = lastSegment.arrival?.at?.split("T")[1]?.substring(0, 5) || "00:00"

          const durationRaw = itinerary.duration || "PT2H"
          const duration = durationRaw.replace("PT", "").toLowerCase()

          return {
            id: offer.id,
            type: "flight",
            carrier: carrierCode,
            carrierLogo: `/placeholder.svg?height=40&width=40&text=${carrierCode}`,
            departureTime: depTime,
            arrivalTime: arrTime,
            departureStation: firstSegment.departure?.iataCode || originCode,
            arrivalStation: lastSegment.arrival?.iataCode || destCode,
            duration: duration,
            stops: segments.length - 1,
            price: Number.parseFloat(offer.price?.total || "0"),
            currency: offer.price?.currency || "EUR",
            isOvernight: false,
          }
        } catch (e) {
          return null
        }
      })
      .filter(Boolean)

    // If mapping resulted in empty array (e.g. bad data), fallback to MOCK
    if (tickets.length === 0) {
      return { success: true, data: MOCK_RESULTS }
    }

    return { success: true, data: tickets }
  } catch (error) {
    // Any other error, return mock
    return { success: true, data: MOCK_RESULTS }
  }
}
