import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { serverApi } from "@/lib/server-api"
import { PredictionBadge } from "@/components/match/prediction-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

function getBadgeStatus(
  prediction: { skipped: boolean; pointsEarned: number },
  match: { homeScore: number | null; awayScore: number | null }
): "exact" | "correct" | "incorrect" | "skipped" | "hidden" {
  if (prediction.skipped) return "skipped"
  if (match.homeScore === null || match.awayScore === null) return "hidden"
  if (prediction.pointsEarned === 3) return "exact"
  if (prediction.pointsEarned === 2) return "correct"
  return "incorrect"
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const session = await getSession()
  if (!session) redirect("/")

  const { userId } = await params

  let user
  try {
    user = await serverApi(`/api/users/${userId}`)
  } catch {
    notFound()
  }

  if (user.isBanned) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            This user has been removed from the leaderboard.
          </CardContent>
        </Card>
      </div>
    )
  }

  const predictions = await serverApi(`/api/predictions/user/${userId}`)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {user.totalPoints} pts · {Math.round(user.accuracy * 100)}% acc
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predictions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {predictions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No predictions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Pick</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((entry: {
                  match: {
                    id: string
                    homeTeam: string
                    awayTeam: string
                    homeScore: number | null
                    awayScore: number | null
                    stage: string
                    status: string
                  }
                  prediction: {
                    skipped: boolean
                    predictedHomeScore: number | null
                    predictedAwayScore: number | null
                    pointsEarned: number
                  } | null
                }) => {
                  const m = entry.match
                  const p = entry.prediction

                  if (!p) return null

                  const pick =
                    p.skipped
                      ? "Skipped"
                      : p.predictedHomeScore !== null && p.predictedAwayScore !== null
                        ? `${p.predictedHomeScore}–${p.predictedAwayScore}`
                        : "—"
                  const result =
                    m.homeScore !== null && m.awayScore !== null
                      ? `${m.homeScore}–${m.awayScore}`
                      : m.status === "LIVE" ? "Live" : "—"
                  const badgeStatus = getBadgeStatus(p, m)

                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {m.homeTeam} vs {m.awayTeam}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {m.stage}
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">{pick}</TableCell>
                      <TableCell className="tabular-nums">{result}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {p.skipped ? "—" : p.pointsEarned}
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
