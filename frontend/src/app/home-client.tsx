"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trophy, CheckCircle, XCircle } from "lucide-react"
import { MatchCard } from "@/components/match/match-card"
import { SyncButton } from "@/components/sync-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { stageColors, formatStage, STAGE_FILTERS, isStageMatch } from "@/lib/stage-config"

type MatchStatus = "UPCOMING" | "LIVE" | "FINISHED"

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeFlag?: string | null
  awayFlag?: string | null
  stage: string
  kickoffTime: string
  status: MatchStatus
  homeScore?: number | null
  awayScore?: number | null
}

interface Prediction {
  predictedHomeScore: number | null
  predictedAwayScore: number | null
  pointsEarned: number
  skipped: boolean
}

export default function HomeClient({
  matches,
  predictionsMap,
}: {
  matches: Match[]
  predictionsMap: Record<string, Prediction | null>
}) {
  const router = useRouter()
  const [scoreInputs, setScoreInputs] = useState<Record<string, { home: string; away: string }>>(() => {
    const initial: Record<string, { home: string; away: string }> = {}
    for (const [matchId, pred] of Object.entries(predictionsMap)) {
      if (pred && !pred.skipped && pred.predictedHomeScore !== null && pred.predictedAwayScore !== null) {
        initial[matchId] = {
          home: String(pred.predictedHomeScore),
          away: String(pred.predictedAwayScore),
        }
      }
    }
    return initial
  })
  const [savingId, setSavingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedTab, setSelectedTab] = useState<"all" | "upcoming">("upcoming")
  const [selectedStage, setSelectedStage] = useState<string>("__all__")

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const handlePredict = useCallback(
    async (matchId: string) => {
      const scores = scoreInputs[matchId]
      if (!scores || scores.home === "" || scores.away === "") return

      setSavingId(matchId)
      try {
        const res = await fetch("/api/predictions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchId,
            predictedHomeScore: parseInt(scores.home, 10),
            predictedAwayScore: parseInt(scores.away, 10),
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to save")
        }
        setToast({ type: "success", message: "Prediction saved!" })
        router.refresh()
      } catch (e) {
        setToast({ type: "error", message: e instanceof Error ? e.message : "Failed to save" })
      } finally {
        setSavingId(null)
      }
    },
    [scoreInputs, router]
  )

  const handleScoreChange = useCallback(
    (matchId: string, side: "home" | "away", value: string) => {
      setScoreInputs((prev) => ({
        ...prev,
        [matchId]: {
          ...prev[matchId],
          [side]: value,
        },
      }))
    },
    []
  )

  function toMatchCard(match: Match) {
    const { id, ...rest } = match
    return {
      ...rest,
      homeFlag: rest.homeFlag ?? undefined,
      awayFlag: rest.awayFlag ?? undefined,
      homeScore: rest.homeScore ?? undefined,
      awayScore: rest.awayScore ?? undefined,
    } as const
  }

  function getDateLabel(dateStr: string): string {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const live = matches.filter((m) => m.status === "LIVE" && isStageMatch(m.stage, selectedStage))
  const upcoming = matches.filter((m) => m.status === "UPCOMING" && isStageMatch(m.stage, selectedStage))
  const finished = matches.filter((m) => m.status === "FINISHED" && isStageMatch(m.stage, selectedStage))

  const upcomingByDate: Record<string, Match[]> = {}
  for (const match of upcoming) {
    const key = new Date(match.kickoffTime).toDateString()
    if (!upcomingByDate[key]) upcomingByDate[key] = []
    upcomingByDate[key].push(match)
  }

  const allMatches = [...live, ...upcoming, ...finished].sort(
    (a, b) => new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime()
  )

  const allByDate: Record<string, Match[]> = {}
  for (const match of allMatches) {
    const key = new Date(match.kickoffTime).toDateString()
    if (!allByDate[key]) allByDate[key] = []
    allByDate[key].push(match)
  }

  function groupByStage(matches: Match[]): Record<string, Match[]> {
    const grouped: Record<string, Match[]> = {}
    for (const match of matches) {
      if (!grouped[match.stage]) grouped[match.stage] = []
      grouped[match.stage].push(match)
    }
    const order = ["GROUP_STAGE", "GROUP STAGE", "LAST_32", "LAST_16", "ROUND_OF_16", "ROUND OF 16", "QUARTER_FINALS", "QUARTER_FINAL", "QUARTER-FINAL", "QUARTERFINALS", "SEMI_FINALS", "SEMI_FINAL", "SEMI-FINAL", "SEMIFINALS", "THIRD_PLACE", "THIRD PLACE", "FINAL"]
    return Object.fromEntries(
      order.filter((s) => grouped[s]).map((s) => [s, grouped[s]])
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium animate-in fade-in ${
            toast.type === "success"
              ? "border-emerald/30 bg-emerald/10 text-emerald"
              : "border-red/30 bg-red/10 text-red"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="size-4 shrink-0" />
          ) : (
            <XCircle className="size-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-fifa-blue/20 via-background to-background border border-fifa-blue/20 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-gold/20">
            <Trophy className="size-6 status-gold" />
          </div>
          <div>
            <h1 className="text-lg font-bold">FIFA World Cup 2026</h1>
            <p className="text-xs text-muted-foreground">
              Predict match scores and climb the leaderboard
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              selectedTab === "upcoming"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedTab("all")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              selectedTab === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
        </div>
        <SyncButton expanded />
      </div>

      {/* Stage filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {STAGE_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setSelectedStage(filter.key)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              selectedStage === filter.key
                ? "bg-fifa-blue text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {selectedTab === "upcoming" ? (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="size-2 rounded-full bg-fifa-blue" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-fifa-blue-light">
              Upcoming
            </h2>
          </div>
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No upcoming matches
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(upcomingByDate).map(([dateKey, dateMatches]) => (
                <div key={dateKey}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    {getDateLabel(dateMatches[0].kickoffTime)}
                  </h3>
                  {Object.entries(groupByStage(dateMatches)).map(([stage, stageMatches]) => (
                    <div key={stage} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs border font-medium", stageColors[stage] || "bg-muted text-muted-foreground border-border")}
                        >
                          {formatStage(stage)}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {stageMatches.map((match) => {
                          const id = match.id
                          return (
                            <MatchCard
                              key={id}
                              match={toMatchCard(match)}
                              userPrediction={predictionsMap[id]}
                              homeScoreInput={scoreInputs[id]?.home ?? ""}
                              awayScoreInput={scoreInputs[id]?.away ?? ""}
                              onHomeScoreChange={(value) => handleScoreChange(id, "home", value)}
                              onAwayScoreChange={(value) => handleScoreChange(id, "away", value)}
                              onSubmit={() => handlePredict(id)}
                              saving={savingId === id}
                              showStageBadge={false}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          {Object.keys(allByDate).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No matches match the selected filters
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(allByDate).map(([dateKey, dateMatches]) => (
                <div key={dateKey}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    {getDateLabel(dateMatches[0].kickoffTime)}
                  </h3>
                  {Object.entries(groupByStage(dateMatches)).map(([stage, stageMatches]) => (
                    <div key={stage} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs border font-medium", stageColors[stage] || "bg-muted text-muted-foreground border-border")}
                        >
                          {formatStage(stage)}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {stageMatches.map((match) => {
                          const id = match.id
                          const isUpcomingMatch = match.status === "UPCOMING"
                          return (
                            <MatchCard
                              key={id}
                              match={toMatchCard(match)}
                              userPrediction={predictionsMap[id]}
                              homeScoreInput={isUpcomingMatch ? scoreInputs[id]?.home ?? "" : undefined}
                              awayScoreInput={isUpcomingMatch ? scoreInputs[id]?.away ?? "" : undefined}
                              onHomeScoreChange={isUpcomingMatch ? (value) => handleScoreChange(id, "home", value) : undefined}
                              onAwayScoreChange={isUpcomingMatch ? (value) => handleScoreChange(id, "away", value) : undefined}
                              onSubmit={isUpcomingMatch ? () => handlePredict(id) : undefined}
                              saving={isUpcomingMatch ? savingId === id : undefined}
                              showStageBadge={false}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
