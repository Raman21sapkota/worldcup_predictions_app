export class MatchController {
  constructor(matchService) {
    this.matchService = matchService
  }

  async getAll(req, res, next) {
    try {
      const matches = await this.matchService.getAllMatches()
      res.json(matches)
    } catch (error) {
      next(error)
    }
  }
}
