import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GoogleMapsLoader } from "@/components/google-maps-loader"
import { i18n } from "@/i18n-config"
import { getDictionary } from "@/lib/get-dictionary"

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: any }
}) {
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="flex flex-col min-h-screen">
      <GoogleMapsLoader />
      <SiteHeader lang={params.lang} dictionary={dictionary} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
