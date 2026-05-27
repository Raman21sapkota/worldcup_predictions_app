"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { AdminUserActions } from "@/components/admin-user-actions"
import { socket } from "@/lib/socket"

const medals = ["🥇", "🥈", "🥉"]

const rankColors = [
  "text-gold border-gold/30 bg-gold/5",
  "text-gray-300 border-gray-400/30 bg-gray-400/5",
  "text-amber-700 border-amber-700/30 bg-amber-700/5",
]

interface User {
  id: string
  username: string
  avatarUrl?: string | null
  totalPoints: number
  correctPredictions: number
  totalPredictions: number
  accuracy: number
  streak: number
  exactScoreHits: number
}

interface RankedUser extends User {
  rank: number
}

function rankUsers(users: User[]): RankedUser[] {
  let currentRank = 0
  return users.map((user, i) => {
    if (i === 0 || user.totalPoints !== users[i - 1].totalPoints) {
      currentRank = i + 1
    }
    return { ...user, rank: currentRank }
  })
}

export function LeaderboardClient({ initialUsers, isAdmin }: { initialUsers: User[]; isAdmin?: boolean }) {
  const [users, setUsers] = useState<RankedUser[]>(() => rankUsers(initialUsers))

  useEffect(() => {
    socket.connect()
    socket.on("leaderboard-updated", (data: User[]) => {
      setUsers(rankUsers(data))
    })
    return () => {
      socket.off("leaderboard-updated")
      socket.disconnect()
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gold/15 via-background to-background border border-gold/20 p-6 text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-gold/20">
            <Trophy className="size-7 status-gold" />
          </div>
        </div>
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {users.length} player{users.length !== 1 ? "s" : ""} competing
        </p>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 size-40 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {users.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No players yet
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const isPodium = user.rank <= 3
            const podiumIndex = user.rank - 1

            return (
              <Link key={user.id} href={`/users/${user.id}`}>
                <Card
                  className={`transition-colors hover:bg-muted/50 ${isPodium ? rankColors[podiumIndex] : ""} ${user.rank === 1 ? "shadow-md shadow-gold/10" : ""}`}
                >
                  <CardContent className="flex items-center gap-3 px-4 py-3">
                    <div className="flex w-8 shrink-0 items-center justify-center">
                      {isPodium ? (
                        <span className="text-lg">{medals[podiumIndex]}</span>
                      ) : (
                        <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                          {user.rank}
                        </span>
                      )}
                    </div>

                    <Avatar size={user.rank === 1 ? "lg" : "sm"}>
                      <AvatarImage src={user.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold truncate ${user.rank === 1 ? "text-gold" : ""}`}>
                          {user.username}
                        </span>
                        {user.rank === 1 && (
                          <span className="text-xs status-gold">Leader</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="tabular-nums">{Math.round(user.accuracy * 100)}% acc</span>
                        <span className="tabular-nums">🔥 {user.streak}</span>
                        <span className="tabular-nums">{user.exactScoreHits} exact</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-lg font-black tabular-nums ${user.rank === 1 ? "status-gold" : ""}`}>
                        {user.totalPoints}
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {user.correctPredictions}/{user.totalPredictions}
                      </div>
                    </div>
                    {isAdmin && <AdminUserActions userId={user.id} />}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
