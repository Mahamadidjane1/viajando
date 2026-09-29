import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { requireUser } from "@/lib/session"
import type { Locale } from "@/i18n-config"

export const metadata = { robots: { index: false } }

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const user = await requireUser(lang, `/${lang}/dashboard`)

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-64">
            <DashboardNav lang={lang as Locale} user={{ name: user.name ?? null, email: user.email ?? null }} />
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
