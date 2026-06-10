"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/match/countdown-timer"
import { ScoreStepper } from "@/components/ui/score-stepper"
import { PredictionBadge } from "@/components/match/prediction-badge"
import { stageColors, isKnockoutStage } from "@/lib/stage-config"

type MatchStatus = "UPCOMING" | "LIVE" | "FINISHED"

interface Match {
  homeTeam: string
  awayTeam: string
  homeFlag?: string
  awayFlag?: string
  stage: string
  kickoffTime: string
  status: MatchStatus
  homeScore?: number | null
  awayScore?: number | null
  winner?: string | null
  duration?: string | null
  extraTimeHomeScore?: number | null
  extraTimeAwayScore?: number | null
  penaltyHomeScore?: number | null
  penaltyAwayScore?: number | null
}

interface UserPrediction {
  predictedHomeScore: number | null
  predictedAwayScore: number | null
  predictedWinner: string | null
  pointsEarned: number
  skipped: boolean
}

interface MatchCardProps {
  match: Match
  userPrediction?: UserPrediction | null
  homeScoreInput?: string
  awayScoreInput?: string
  onHomeScoreChange?: (value: string) => void
  onAwayScoreChange?: (value: string) => void
  onSubmit?: () => void
  saving?: boolean
  showStageBadge?: boolean
  className?: string
  predictedWinner?: string | null
  onPredictedWinnerChange?: (value: string | null) => void
  stage?: string
}

function getResultBadgeStatus(
  prediction: UserPrediction,
  match: { homeScore?: number | null; awayScore?: number | null; stage?: string }
): "exact" | "correct" | "incorrect" | "skipped" | "hidden" {
  if (prediction.skipped) return "skipped"
  if (match.homeScore == null || match.awayScore == null) return "hidden"
  if (prediction.pointsEarned === 5) return "exact"
  if (prediction.pointsEarned === 3) {
    if (match.stage && isKnockoutStage(match.stage)) return "correct"
    return "exact"
  }
  if (prediction.pointsEarned === 2) {
    if (match.stage && isKnockoutStage(match.stage)) return "exact"
    return "correct"
  }
  return "incorrect"
}

export function MatchCard({
  match,
  userPrediction,
  homeScoreInput,
  awayScoreInput,
  onHomeScoreChange,
  onAwayScoreChange,
  onSubmit,
  saving,
  showStageBadge = true,
  className,
  predictedWinner,
  onPredictedWinnerChange,
  stage,
}: MatchCardProps) {
  const isInteractive = match.status === "UPCOMING"
  const isKnockout = isKnockoutStage(stage ?? match.stage)
  const isTbdMatch = match.homeTeam === "TBD" || match.awayTeam === "TBD"
  const hasPrediction =
    userPrediction &&
    !userPrediction.skipped &&
    userPrediction.predictedHomeScore !== null &&
    userPrediction.predictedAwayScore !== null

  const stageClass = stageColors[match.stage] || "bg-muted text-muted-foreground border-border"

  const homeNum = parseInt(homeScoreInput ?? "", 10)
  const awayNum = parseInt(awayScoreInput ?? "", 10)
  const isDrawScore = !isNaN(homeNum) && !isNaN(awayNum) && homeNum === awayNum
  const needsWinnerPick = isKnockout && isDrawScore && !isTbdMatch

  function TeamName({ name, side }: { name: string; side: "home" | "away" }) {
    const isTbd = name === "TBD"
    const showFlag = side === "home" ? match.homeFlag : match.awayFlag
    return (
      <>
        {side === "home" && showFlag && !isTbd && (
          <img src={showFlag} alt={name} className="size-10 rounded-full object-cover shrink-0 ring-1 ring-border" />
        )}
        <span className={cn("text-sm truncate", isTbd ? "text-muted-foreground italic font-medium" : "font-semibold")}>
          {name}
        </span>
        {side === "away" && showFlag && !isTbd && (
          <img src={showFlag} alt={name} className="size-10 rounded-full object-cover shrink-0 ring-1 ring-border" />
        )}
      </>
    )
  }

  return (
    <Card
      className={cn(
        !isInteractive && match.status !== "LIVE" && "opacity-70",
        match.status === "LIVE" && "animate-glow-live",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {showStageBadge && (
          <Badge variant="outline" className={cn("text-xs border", stageClass)}>
            {match.stage}
          </Badge>
        )}
        <div className={showStageBadge ? "" : "ml-auto"}>
          <CountdownTimer
            kickoffTime={match.kickoffTime}
            matchStatus={match.status}
            compact={match.status === "UPCOMING"}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TeamName name={match.homeTeam} side="home" />
        </div>

        <div className="flex items-center gap-3 px-4 shrink-0">
          {(match.status === "LIVE" || match.status === "FINISHED") && (
            <span className="text-2xl font-black tabular-nums tracking-tight">
              <span className={match.status === "FINISHED" && hasPrediction && (userPrediction?.pointsEarned === 5 || userPrediction?.pointsEarned === 3) ? "text-gold" : ""}>
                {match.homeScore ?? "-"}
              </span>
              <span className="mx-1.5 text-muted-foreground/50">:</span>
              <span className={match.status === "FINISHED" && hasPrediction && (userPrediction?.pointsEarned === 5 || userPrediction?.pointsEarned === 3) ? "text-gold" : ""}>
                {match.awayScore ?? "-"}
              </span>
              {match.status === "FINISHED" && match.duration && (
                <span className="ml-1.5 text-xs text-muted-foreground font-medium">
                  {match.duration === "PENALTY_SHOOTOUT"
                    ? match.penaltyHomeScore != null && match.penaltyAwayScore != null
                      ? `(${match.penaltyHomeScore}-${match.penaltyAwayScore} pens)`
                      : "(pens)"
                    : match.duration === "EXTRA_TIME"
                      ? "(AET)"
                      : ""}
                </span>
              )}
            </span>
          )}
          {match.status === "UPCOMING" && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {new Intl.DateTimeFormat("en-US", {
                  timeZone: "Asia/Kathmandu",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(match.kickoffTime))}
              </span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {new Intl.DateTimeFormat("en-US", {
                  timeZone: "Asia/Kathmandu",
                  month: "short",
                  day: "numeric",
                }).format(new Date(match.kickoffTime))}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <TeamName name={match.awayTeam} side="away" />
        </div>
      </div>

      {isInteractive && (
        <div className="border-t border-border px-4 py-3 space-y-2">
          {isTbdMatch ? (
            <p className="text-center text-xs text-muted-foreground py-2 italic">
              Teams not yet decided
            </p>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <ScoreStepper
                  value={homeScoreInput ?? ""}
                  onChange={(v) => onHomeScoreChange?.(v)}
                />
                <span className="text-sm font-bold text-muted-foreground">:</span>
                <ScoreStepper
                  value={awayScoreInput ?? ""}
                  onChange={(v) => onAwayScoreChange?.(v)}
                />
              </div>
              {isKnockout && (
                <div className="flex items-center justify-center gap-2 py-1">
                  <span className="text-xs text-muted-foreground mr-1">Who advances?</span>
                  <button
                    onClick={() => onPredictedWinnerChange?.("HOME_TEAM")}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-medium border transition-colors",
                      predictedWinner === "HOME_TEAM" && !needsWinnerPick
                        ? "bg-muted text-muted-foreground border-border cursor-default"
                        : predictedWinner === "HOME_TEAM"
                          ? "bg-fifa-blue/15 text-fifa-blue border-fifa-blue/30"
                          : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50"
                    )}
                  >
                    {match.homeTeam}
                  </button>
                  <button
                    onClick={() => onPredictedWinnerChange?.("AWAY_TEAM")}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-medium border transition-colors",
                      predictedWinner === "AWAY_TEAM" && !needsWinnerPick
                        ? "bg-muted text-muted-foreground border-border cursor-default"
                        : predictedWinner === "AWAY_TEAM"
                          ? "bg-fifa-blue/15 text-fifa-blue border-fifa-blue/30"
                          : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50"
                    )}
                  >
                    {match.awayTeam}
                  </button>
                </div>
              )}
              <Button
                variant="default"
                size="lg"
                onClick={onSubmit}
                disabled={saving || !homeScoreInput || homeScoreInput === "" || !awayScoreInput || awayScoreInput === "" || (needsWinnerPick && !predictedWinner)}
                className="w-full bg-gradient-to-r from-fifa-blue to-fifa-blue-light text-white hover:from-fifa-blue-light hover:to-fifa-blue"
              >
                {saving ? "Saving..." : hasPrediction ? "Update" : "Predict"}
              </Button>
            </>
          )}
        </div>
      )}

      {!isInteractive && (
        <div className="border-t border-border px-4 py-3">
          {hasPrediction && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Your pick:{" "}
                <span className="font-semibold text-foreground">
                  {userPrediction!.predictedHomeScore}–{userPrediction!.predictedAwayScore}
                  {userPrediction!.predictedWinner && match.stage && isKnockoutStage(match.stage) && (
                    <span className="text-muted-foreground font-normal">
                      {" "}{userPrediction!.predictedWinner === "HOME_TEAM" ? match.homeTeam : match.awayTeam} advances
                    </span>
                  )}
                </span>
              </span>
              {match.status === "FINISHED" && (
                <PredictionBadge
                  status={getResultBadgeStatus(userPrediction!, match)}
                />
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {match.status === "LIVE" ? "Predictions locked" : "Final"}
            </span>
            {match.status === "FINISHED" && hasPrediction && (
              <span className="text-sm font-bold tabular-nums status-gold">
                +{userPrediction!.pointsEarned}
              </span>
            )}
            {match.status === "FINISHED" && !hasPrediction && (
              <span className="text-xs text-muted-foreground">No prediction</span>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
