import type React from "react"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { i18n, type Locale } from "@/i18n-config"
import { getDictionary } from "@/lib/get-dictionary"

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!(i18n.locales as readonly string[]).includes(lang)) notFound()
  const dictionary = await getDictionary(lang as Locale)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang as Locale} dictionary={dictionary} />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter lang={lang as Locale} />
    </div>
  )
}
