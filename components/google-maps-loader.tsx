"use client"

import { useEffect } from "react"
import { getGoogleMapsKey } from "@/lib/api-config"

export function GoogleMapsLoader() {
  useEffect(() => {
    const apiKey = getGoogleMapsKey()

    if (apiKey && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places`
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return null
}
