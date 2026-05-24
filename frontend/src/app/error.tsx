"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="mx-auto max-w-md py-20 px-4 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/20">
          <AlertTriangle className="size-7 text-destructive" />
        </div>
      </div>
      <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
