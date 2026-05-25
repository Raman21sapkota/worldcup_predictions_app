"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import { SyncButton } from "@/components/sync-button"
import { LogoutButton } from "@/components/logout-button"

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
]

export function Navbar() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <header className="hidden md:flex h-14 items-center justify-between border-b border-border bg-card px-6 fixed top-0 left-0 right-0 z-50 shadow-md shadow-black/20">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold">
          <Trophy className="size-5 status-gold" />
          <span>World Cup 2026</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname === link.href
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <SyncButton />
        <LogoutButton />
      </div>
    </header>
  )
}
