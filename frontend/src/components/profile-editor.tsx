"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ProfileEditor({ initialUsername }: { initialUsername: string }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialUsername)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleSave = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed || trimmed === initialUsername) {
      setEditing(false)
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save")
      }
      setEditing(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }, [value, initialUsername, router])

  const handleCancel = useCallback(() => {
    setValue(initialUsername)
    setEditing(false)
    setError(null)
  }, [initialUsername])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave()
      if (e.key === "Escape") handleCancel()
    },
    [handleSave, handleCancel]
  )

  if (editing) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
            className="w-48 text-center"
          />
          <Button variant="default" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="group relative inline-flex items-center gap-2">
      <span className="text-lg font-semibold">{initialUsername}</span>
      <button
        onClick={() => setEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        aria-label="Edit name"
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  )
}
