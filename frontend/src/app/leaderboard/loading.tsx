export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="h-40 rounded-xl bg-muted/50 mb-6 animate-pulse" />
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
