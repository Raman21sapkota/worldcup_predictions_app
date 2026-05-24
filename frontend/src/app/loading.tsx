export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <div className="space-y-4 animate-pulse">
        <div className="h-32 rounded-xl bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  )
}
