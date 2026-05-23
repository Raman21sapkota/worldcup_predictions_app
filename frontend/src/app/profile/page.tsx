import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { serverApi } from "@/lib/server-api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileEditor } from "@/components/profile-editor"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect("/")

  const user = await serverApi("/api/users/me")
  if (!user) redirect("/")

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <ProfileEditor initialUsername={user.username} />
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="space-y-1">
            <StatRow label="Total Points" value={user.totalPoints} />
            <StatRow
              label="Accuracy"
              value={`${Math.round(user.accuracy * 100)}%`}
            />
            <StatRow
              label="Correct Predictions"
              value={`${user.correctPredictions}/${user.totalPredictions}`}
            />
            <StatRow label="Streak" value={user.streak} />
            <StatRow label="Exact Score Hits" value={user.exactScoreHits} />
          </div>
        </CardContent>
      </Card>

      <form action="/api/auth/logout" method="POST">
        <Button variant="outline" className="w-full" type="submit">
          Logout
        </Button>
      </form>
    </div>
  )
}
