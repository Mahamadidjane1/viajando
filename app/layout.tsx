import type React from "react"
import type { Metadata } from "next"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Viajando - Compare e reserve viagens na Europa",
  description: "Compare e reserve voos, comboios e autocarros em Portugal e em toda a Europa.",
  applicationName: "Viajando",
  authors: [{ name: "Mahamadi Djane" }],
}

// Actual page structure is in [lang]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-PT">
      <body className="font-sans antialiased">
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
