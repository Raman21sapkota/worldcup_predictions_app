export class LeaderboardController {
  constructor(leaderboardService) {
    this.leaderboardService = leaderboardService
  }

  async getLeaderboard(req, res, next) {
    try {
      const users = await this.leaderboardService.getLeaderboard()
      res.json(users)
    } catch (error) {
      next(error)
    }
  }
}
