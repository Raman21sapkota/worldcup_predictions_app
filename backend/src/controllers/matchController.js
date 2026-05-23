export class MatchController {
  constructor(matchService) {
    this.matchService = matchService
  }

  async getAll(req, res) {
    try {
      const matches = await this.matchService.getAllMatches()
      res.json(matches)
    } catch (error) {
      console.error("Failed to fetch matches:", error)
      res.status(500).json({ error: "Failed to fetch matches" })
    }
  }
}
