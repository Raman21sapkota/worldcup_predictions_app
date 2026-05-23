import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { serverApi } from "@/lib/server-api"
import HomeClient from "../home-client"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const session = await getSession()
  if (!session) redirect("/")

  const [matches, predictions] = await Promise.all([
    serverApi("/api/matches"),
    serverApi("/api/predictions/me"),
  ])

  const predictionsMap: Record<string, {
    predictedHomeScore: number | null
    predictedAwayScore: number | null
    pointsEarned: number
    skipped: boolean
  } | null> = {}

  for (const p of predictions) {
    predictionsMap[p.matchId] = {
      predictedHomeScore: p.predictedHomeScore,
      predictedAwayScore: p.predictedAwayScore,
      pointsEarned: p.pointsEarned,
      skipped: p.skipped,
    }
  }

  const serializedMatches = matches.map((m: { kickoffTime: Date }) => ({
    ...m,
    kickoffTime: new Date(m.kickoffTime).toISOString(),
  }))

  return (
    <HomeClient
      matches={serializedMatches}
      predictionsMap={predictionsMap}
    />
  )
}
