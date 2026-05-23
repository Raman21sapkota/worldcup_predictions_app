export class PredictionController {
  constructor(predictionService) {
    this.predictionService = predictionService
  }

  async create(req, res) {
    try {
      const { matchId, predictedHomeScore, predictedAwayScore } = req.body
      const prediction = await this.predictionService.createPrediction(
        req.user.userId, matchId, predictedHomeScore, predictedAwayScore
      )
      res.status(201).json(prediction)
    } catch (error) {
      if (error.message === "Match not found") {
        return res.status(404).json({ error: error.message })
      }
      if (
        error.message === "Can only predict on upcoming matches" ||
        error.message === "Match has already kicked off"
      ) {
        return res.status(400).json({ error: error.message })
      }
      console.error("Failed to save prediction:", error)
      res.status(500).json({ error: "Failed to save prediction" })
    }
  }

  async getMyPredictions(req, res) {
    try {
      const predictions = await this.predictionService.getMyPredictions(req.user.userId)
      res.json(predictions)
    } catch (error) {
      console.error("Failed to fetch predictions:", error)
      res.status(500).json({ error: "Failed to fetch predictions" })
    }
  }

  async getUserPredictions(req, res) {
    try {
      const { userId } = req.params
      const result = await this.predictionService.getUserPredictions(userId)
      res.json(result)
    } catch (error) {
      console.error("Failed to fetch predictions:", error)
      res.status(500).json({ error: "Failed to fetch predictions" })
    }
  }
}
