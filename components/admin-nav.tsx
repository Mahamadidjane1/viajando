"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/bookings", label: "Reservas" },
  { href: "/admin/users", label: "Utilizadores" },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 text-sm" aria-label="Administração">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            pathname === link.href ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
