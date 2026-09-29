import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { requireAdmin } from "@/lib/session"
import { AdminNav } from "@/components/admin-nav"

export const metadata: Metadata = {
  title: "Administração | Viajando",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-primary">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">V</span>
              Admin
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{admin.email}</span>
            <Link href="/pt" className="hover:text-foreground">
              Ver site
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
