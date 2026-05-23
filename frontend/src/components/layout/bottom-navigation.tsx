"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, Clock, User } from "lucide-react"

import { cn } from "@/lib/utils"

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/history", label: "History", icon: Clock },
  { href: "/profile", label: "Profile", icon: User },
]

export function BottomNavigation() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <nav className="block md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-card px-2 shadow-md shadow-black/20">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-md px-3 py-1 text-xs transition-colors",
              isActive
                ? "text-gold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-5" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
