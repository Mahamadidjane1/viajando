"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Ticket, Wallet, Settings, LogOut, User, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  {
    title: "Visão Geral",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "As Minhas Viagens",
    href: "/dashboard/trips",
    icon: Ticket,
  },
  {
    title: "Favoritos",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Carteira & Cashback",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
  {
    title: "Definições",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-foreground">João Silva</div>
            <div className="text-xs text-muted-foreground">Membro desde 2023</div>
          </div>
        </div>
      </div>

      <nav className="p-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11",
                pathname === item.href
                  ? "bg-primary/5 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-border mt-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
