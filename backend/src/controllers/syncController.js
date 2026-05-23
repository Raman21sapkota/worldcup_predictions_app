export class SyncController {
  constructor(syncService) {
    this.syncService = syncService
  }

  async sync(req, res) {
    try {
      const result = await this.syncService.syncMatches()
      res.json(result)
    } catch (error) {
      console.error("Sync POST failed:", error)
      res.status(500).json({ error: "Sync failed" })
    }
  }

  async getSyncInfo(req, res) {
    try {
      const lastSyncedAt = await this.syncService.getLastSyncTime()
      res.json({ lastSyncedAt })
    } catch (error) {
      console.error("Sync GET failed:", error)
      res.status(500).json({ error: "Failed to get sync info" })
    }
  }

  async cronSync(req, res) {
    const authHeader = req.headers.authorization
    const expected = `Bearer ${process.env.CRON_SECRET}`
    if (!authHeader || authHeader !== expected) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const result = await this.syncService.syncMatches()
      res.json({ ok: true, ...result })
    } catch (error) {
      console.error("Cron sync failed:", error)
      res.status(500).json({ error: "Sync failed" })
    }
  }
}
