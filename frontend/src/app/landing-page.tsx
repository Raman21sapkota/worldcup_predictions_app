import Link from "next/link"
import { Trophy, ArrowRight, Users, Brain, Medal } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-center border-b border-border bg-card px-4 py-3 md:px-8">
        <div className="flex items-center gap-2 text-base font-semibold">
          <Trophy className="size-5 text-gold" />
          <span>World Cup 2026</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gold/20 ring-4 ring-gold/10">
              <Trophy className="size-10 text-gold" />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            FIFA World Cup{" "}
            <span className="text-gold">2026</span>
          </h1>

          <p className="text-lg text-muted-foreground md:text-xl">
            Predict match scores, earn points, and compete with friends to
            claim the ultimate bragging rights.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4 text-left">
              <Brain className="mb-2 size-6 text-fifa-blue-light" />
              <h3 className="text-sm font-semibold">Predict Scores</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Guess the exact score for every World Cup match
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-left">
              <Medal className="mb-2 size-6 text-gold" />
              <h3 className="text-sm font-semibold">Earn Points</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                3 for exact score, 2 for correct outcome
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-left">
              <Users className="mb-2 size-6 text-emerald" />
              <h3 className="text-sm font-semibold">Compete</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Climb the leaderboard against friends
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/api/auth/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3 text-base font-bold text-black transition-colors hover:bg-gold-light"
            >
              Sign in with Google
              <ArrowRight className="size-5" />
            </Link>

          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        FIFA World Cup 2026 Predictor &mdash; Private friend group
      </footer>
    </div>
  )
}
