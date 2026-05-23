"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function AdminUserActions({ userId }: { userId: string }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [banning, setBanning] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setIsAdmin(data?.role === "ADMIN")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !isAdmin) return null

  const handleBan = async () => {
    setBanning(true)
    try {
      const res = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) router.refresh()
    } catch {
    } finally {
      setBanning(false)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon-xs" aria-label="Remove user" />
          }
        >
          <UserX className="size-3.5 text-red-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Remove from leaderboard</DialogTitle>
          <DialogDescription>
            This user will be permanently removed from the leaderboard. Their
            predictions will remain but won&apos;t be visible in rankings.
          </DialogDescription>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={banning}
            >
              {banning ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
