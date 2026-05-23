"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreStepperProps {
  value: string
  onChange: (value: string) => void
  min?: number
  max?: number
}

export function ScoreStepper({ value, onChange, min = 0, max = 99 }: ScoreStepperProps) {
  const num = value === "" ? 0 : parseInt(value, 10)

  function decrement() {
    const next = Math.max(min, num - 1)
    onChange(String(next))
  }

  function increment() {
    const next = Math.min(max, num + 1)
    onChange(String(next))
  }

  return (
    <div className="flex items-center gap-0">
      <button
        type="button"
        onClick={decrement}
        disabled={num <= min}
        className={cn(
          "flex size-9 items-center justify-center rounded-l-lg border border-r-0 border-border bg-card text-muted-foreground transition-colors",
          "hover:bg-fifa-blue hover:text-white hover:border-fifa-blue",
          "disabled:opacity-30 disabled:pointer-events-none",
          "active:bg-fifa-blue-light"
        )}
        aria-label="Decrease score"
      >
        <Minus className="size-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === "") {
            onChange("")
            return
          }
          const parsed = parseInt(raw, 10)
          if (!isNaN(parsed) && parsed >= min && parsed <= max) {
            onChange(String(parsed))
          }
        }}
        className={cn(
          "h-9 w-14 border border-border bg-card text-center text-base font-bold tabular-nums text-foreground",
          "outline-none ring-0",
          "focus:z-10 focus:border-fifa-blue focus:ring-1 focus:ring-fifa-blue/40",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        )}
      />

      <button
        type="button"
        onClick={increment}
        disabled={num >= max}
        className={cn(
          "flex size-9 items-center justify-center rounded-r-lg border border-l-0 border-border bg-card text-muted-foreground transition-colors",
          "hover:bg-fifa-blue hover:text-white hover:border-fifa-blue",
          "disabled:opacity-30 disabled:pointer-events-none",
          "active:bg-fifa-blue-light"
        )}
        aria-label="Increase score"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
