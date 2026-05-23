export class SyncController {
  constructor(syncService) {
    this.syncService = syncService
  }

  async sync(req, res, next) {
    try {
      const result = await this.syncService.syncMatches()
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getSyncInfo(req, res, next) {
    try {
      const lastSyncedAt = await this.syncService.getLastSyncTime()
      res.json({ lastSyncedAt })
    } catch (error) {
      next(error)
    }
  }

  async cronSync(req, res, next) {
    const authHeader = req.headers.authorization
    const expected = `Bearer ${process.env.CRON_SECRET}`
    if (!authHeader || authHeader !== expected) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const result = await this.syncService.syncMatches()
      res.json({ ok: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
