import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { serverApi } from "@/lib/server-api"
import { LeaderboardClient } from "./leaderboard-client"

export const dynamic = "force-dynamic"

export default async function LeaderboardPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const users = await serverApi("/api/leaderboard")

  return <LeaderboardClient initialUsers={users} />
}
