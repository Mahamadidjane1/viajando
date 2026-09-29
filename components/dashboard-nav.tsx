"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Settings, Ticket, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/app/actions/auth-actions"
import type { Locale } from "@/i18n-config"

const NAV_ITEMS = [
  { title: "Visão geral", href: "/dashboard", icon: LayoutDashboard },
  { title: "As minhas viagens", href: "/dashboard/trips", icon: Ticket },
  { title: "Definições", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav({ lang, user }: { lang: Locale; user: { name: string | null; email: string | null } }) {
  const pathname = usePathname()

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="truncate font-bold text-foreground">{user.name || "Viajante"}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1 p-2" aria-label="Conta">
        {NAV_ITEMS.map((item) => {
          const href = `/${lang}${item.href}`
          const active = pathname === href
          return (
            <Link
              key={item.href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-4 text-sm transition-colors",
                active ? "bg-primary/5 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <form action={logoutUser.bind(null, lang)} className="mt-2 border-t border-border p-2">
        <Button
          type="submit"
          variant="ghost"
          className="h-11 w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sair
        </Button>
      </form>
    </div>
  )
}
