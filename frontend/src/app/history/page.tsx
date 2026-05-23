import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { serverApi } from "@/lib/server-api"
import { PredictionBadge } from "@/components/match/prediction-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

function getBadgeStatus(prediction: {
  skipped: boolean
  pointsEarned: number
  match: { homeScore: number | null; awayScore: number | null }
}): "exact" | "correct" | "incorrect" | "skipped" | "hidden" {
  if (prediction.skipped) return "skipped"
  if (prediction.match.homeScore === null || prediction.match.awayScore === null) return "hidden"
  if (prediction.pointsEarned === 3) return "exact"
  if (prediction.pointsEarned === 2) return "correct"
  return "incorrect"
}

export default async function HistoryPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const predictions = await serverApi("/api/predictions/me")

  const finishedPredictions = predictions.filter(
    (p: { match: { status: string } }) => p.match.status === "FINISHED"
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {finishedPredictions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No predictions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Your Pick</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finishedPredictions.map((p: {
                  id: string
                  skipped: boolean
                  predictedHomeScore: number | null
                  predictedAwayScore: number | null
                  pointsEarned: number
                  match: {
                    homeTeam: string
                    awayTeam: string
                    homeScore: number | null
                    awayScore: number | null
                    stage: string
                  }
                }) => {
                  const m = p.match
                  const userPrediction =
                    p.skipped
                      ? "Skipped"
                      : p.predictedHomeScore !== null && p.predictedAwayScore !== null
                        ? `${p.predictedHomeScore}–${p.predictedAwayScore}`
                        : "—"
                  const actualScore =
                    m.homeScore !== null && m.awayScore !== null
                      ? `${m.homeScore}–${m.awayScore}`
                      : "—"
                  const badgeStatus = getBadgeStatus(p)

                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {m.homeTeam} vs {m.awayTeam}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {m.stage}
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {userPrediction}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {actualScore}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {p.skipped ? (
                          "—"
                        ) : (
                          <span className={p.pointsEarned === 3 ? "status-gold font-bold" : p.pointsEarned === 2 ? "text-emerald font-semibold" : ""}>
                            {p.pointsEarned}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <PredictionBadge status={badgeStatus} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
