"use client"

import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"

const TZ = "Asia/Kathmandu"

function formatNepaliDate(kickoffTime: string): { datePart: string; timePart: string } {
  const kickoff = new Date(kickoffTime)
  const now = new Date()

  const fmtDate = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    weekday: "short",
  })
  const fmtTime = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  const fmtFull = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })

  const kickoffLocal = fmtFull.format(kickoff)
  const todayLocal = fmtFull.format(now)

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowLocal = fmtFull.format(tomorrow)

  const time = fmtTime.format(kickoff)

  if (kickoffLocal === todayLocal) return { datePart: "Today", timePart: time }
  if (kickoffLocal === tomorrowLocal) return { datePart: "Tomorrow", timePart: time }
  return { datePart: fmtDate.format(kickoff).replace(/,/, ""), timePart: time }
}

function getRemaining(kickoffTime: string): string {
  const diff = new Date(kickoffTime).getTime() - Date.now()
  if (diff <= 0) return ""

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function getCountdown(kickoffTime: string): string {
  const remaining = getRemaining(kickoffTime)
  return remaining ? `in ${remaining}` : ""
}

export function CountdownTimer({
  kickoffTime,
  matchStatus,
  className,
  compact,
}: {
  kickoffTime: string
  matchStatus: string
  className?: string
  compact?: boolean
}) {
  const [remaining, setRemaining] = useState(() => getCountdown(kickoffTime))

  useEffect(() => {
    const update = () => setRemaining(getCountdown(kickoffTime))
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [kickoffTime])

  if (matchStatus === "FINISHED") return null

  if (matchStatus === "LIVE") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold status-live tabular-nums",
          className
        )}
      >
        <span className="relative inline-flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-red-500" />
        </span>
        <span className="ml-0.5">LIVE</span>
      </span>
    )
  }

  if (compact) {
    return remaining ? (
      <span className={cn("text-[11px] tabular-nums text-muted-foreground", className)}>
        {remaining}
      </span>
    ) : null
  }

  const { datePart, timePart } = formatNepaliDate(kickoffTime)

  return (
    <div className={cn("flex flex-col items-end gap-0", className)}>
      <span className="tabular-nums text-foreground">
        <span className="text-xs">{datePart} </span>
        <span className="text-sm font-semibold">{timePart}</span>
      </span>
      {remaining && (
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {remaining}
        </span>
      )}
    </div>
  )
}
