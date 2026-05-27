"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SyncButton({ expanded = false }: { expanded?: boolean }) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  const handleSync = useCallback(async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/sync", { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Sync failed")
      }
      setTimeout(() => router.refresh(), 500)
    } catch {
    } finally {
      setSyncing(false)
    }
  }, [router])

  return (
    <Button
      variant="outline"
      size={expanded ? "default" : "icon"}
      onClick={handleSync}
      disabled={syncing}
      title="Sync matches from Football-Data.org"
    >
      <RefreshCw className={syncing ? "animate-spin" : undefined} />
      {expanded && (syncing ? "Syncing..." : "Sync")}
    </Button>
  )
}
