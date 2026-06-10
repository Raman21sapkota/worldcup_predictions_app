export class PredictionController {
  constructor(predictionService) {
    this.predictionService = predictionService
  }

  async create(req, res, next) {
    try {
      const { matchId, predictedHomeScore, predictedAwayScore, predictedWinner } = req.body
      const prediction = await this.predictionService.createPrediction(
        req.user.userId, matchId, predictedHomeScore, predictedAwayScore, predictedWinner
      )
      res.status(201).json(prediction)
    } catch (error) {
      next(error)
    }
  }

  async getMyPredictions(req, res, next) {
    try {
      const predictions = await this.predictionService.getMyPredictions(req.user.userId)
      res.json(predictions)
    } catch (error) {
      next(error)
    }
  }

  async getUserPredictions(req, res, next) {
    try {
      const { userId } = req.params
      const result = await this.predictionService.getUserPredictions(userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
