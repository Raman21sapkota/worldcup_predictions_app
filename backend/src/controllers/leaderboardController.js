export class LeaderboardController {
  constructor(leaderboardService) {
    this.leaderboardService = leaderboardService
  }

  async getLeaderboard(req, res) {
    try {
      const users = await this.leaderboardService.getLeaderboard()
      res.json(users)
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
      res.status(500).json({ error: "Failed to fetch leaderboard" })
    }
  }
}
