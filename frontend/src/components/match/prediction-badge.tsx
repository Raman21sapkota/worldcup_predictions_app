import { Check, X, Minus, Lock, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type PredictionStatus = "exact" | "correct" | "incorrect" | "skipped" | "hidden"

const config: Record<
  PredictionStatus,
  { icon: typeof Check; className: string; label: string }
> = {
  exact: {
    icon: Star,
    className: "bg-gold/15 text-gold border-gold/30",
    label: "Exact Score",
  },
  correct: {
    icon: Check,
    className: "bg-emerald/15 text-emerald border-emerald/30",
    label: "Correct",
  },
  incorrect: {
    icon: X,
    className: "bg-red/15 text-red border-red/30",
    label: "Incorrect",
  },
  skipped: {
    icon: Minus,
    className: "bg-muted text-muted-foreground border-border",
    label: "Skipped",
  },
  hidden: {
    icon: Lock,
    className: "text-muted-foreground border-border",
    label: "Hidden",
  },
}

export function PredictionBadge({
  status,
  className,
}: {
  status: PredictionStatus
  className?: string
}) {
  const { icon: Icon, className: colorClass, label } = config[status]
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border px-2 py-0.5 font-medium", colorClass, className)}
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  )
}
