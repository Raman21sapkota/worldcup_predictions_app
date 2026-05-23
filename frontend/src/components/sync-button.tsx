"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SyncInfo {
  lastSyncedAt: string | null
}

export function SyncButton({ expanded = false }: { expanded?: boolean }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncInfo, setSyncInfo] = useState<SyncInfo | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.role === "ADMIN") {
          setIsAdmin(true)
          return fetch("/api/sync")
        }
        return null
      })
      .then((r) => (r?.ok ? r.json() : null))
      .then((data) => setSyncInfo(data))
      .catch(() => {})
  }, [])

  const handleSync = useCallback(async () => {
    setSyncing(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch("/api/sync", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Sync failed")
      setSyncInfo({ lastSyncedAt: data.syncedAt ?? new Date().toISOString() })
      setMessage(data.message ?? "Matches synced")
      setTimeout(() => router.refresh(), 500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed")
    } finally {
      setSyncing(false)
    }
  }, [router])

  if (!isAdmin) return null

  const lastSync = syncInfo?.lastSyncedAt
    ? new Date(syncInfo.lastSyncedAt).toLocaleString()
    : null

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={expanded ? "default" : "icon"}
        onClick={handleSync}
        disabled={syncing}
        title="Sync matches from Football-Data.org"
      >
        <RefreshCw
          className={syncing ? "animate-spin" : undefined}
        />
        {expanded && (syncing ? "Syncing..." : "Sync")}
      </Button>
      {expanded && (message || error) && (
        <span
          className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}
        >
          {error ?? message}
        </span>
      )}
      {expanded && !message && !error && lastSync && (
        <span className="text-xs text-muted-foreground">
          Last sync: {lastSync}
        </span>
      )}
    </div>
  )
}
