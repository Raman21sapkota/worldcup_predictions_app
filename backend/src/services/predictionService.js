import { AppError } from "../utils/AppError.js"
import { matchRepository } from "../repositories/index.js"
import { predictionRepository } from "../repositories/index.js"
import { userRepository } from "../repositories/index.js"
import { calculatePoints } from "../lib/calculate-points.js"

export class PredictionService {
  async createPrediction(userId, matchId, predictedHomeScore, predictedAwayScore, predictedWinner) {
    const match = await matchRepository.findById(matchId)
    if (!match) {
      throw new AppError("Match not found", 404)
    }
    if (match.status !== "UPCOMING") {
      throw new AppError("Can only predict on upcoming matches", 400)
    }
    if (new Date(match.kickoffTime) <= new Date()) {
      throw new AppError("Match has already kicked off", 400)
    }

    return predictionRepository.upsertByUserAndMatch(
      userId, matchId, predictedHomeScore, predictedAwayScore, predictedWinner
    )
  }

  async getMyPredictions(userId) {
    return predictionRepository.findByUserWithMatch(userId)
  }

  async getUserPredictions(userId) {
    const predictions = await predictionRepository.findByUserWithMatch(userId)
    return predictions.map((p) => {
      const isUpcoming = p.match.status === "UPCOMING"
      return { match: p.match, prediction: isUpcoming ? null : p }
    })
  }

  /* // ── old per-row approach (kept for reference) ──
  async awardMatchPoints(matchId) {
    const match = await matchRepository.findById(matchId)
    if (!match || match.status !== "FINISHED") return

    const predictions = await predictionRepository.findByMatch(matchId)
    const userIds = [...new Set(predictions.map((p) => p.userId))]

    for (const prediction of predictions) {
      const result = calculatePoints(prediction, match)
      if (prediction.pointsEarned !== result.pointsEarned) {
        await predictionRepository.update(
          { id: prediction.id },
          { pointsEarned: result.pointsEarned }
        )
      }
    }

    for (const userId of userIds) {
      await this.recalculateUserStats(userId)
    }
  }

  async recalculateUserStats(userId) {
    const predictions = await predictionRepository.findFinishedByUser(userId)

    const totalPredictions = predictions.length
    let totalPoints = 0
    let correctPredictions = 0
    let exactScoreHits = 0

    for (const p of predictions) {
      const result = calculatePoints(p, p.match)
      totalPoints += result.pointsEarned
      if (result.isCorrect) correctPredictions++
      if (result.isExactScore) exactScoreHits++
    }

    let streak = 0
    for (let i = predictions.length - 1; i >= 0; i--) {
      const result = calculatePoints(predictions[i], predictions[i].match)
      if (result.isCorrect) {
        streak++
      } else {
        break
      }
    }

    const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0

    await userRepository.update({ id: userId }, {
      totalPoints,
      correctPredictions,
      totalPredictions,
      exactScoreHits,
      streak,
      accuracy,
    })
  }
  // ── end old approach ── */

  async awardMatchPoints(matchId) {
    const match = await matchRepository.findById(matchId)
    if (!match || match.status !== "FINISHED") return

    const predictions = await predictionRepository.findByMatch(matchId)

    for (const prediction of predictions) {
      const result = calculatePoints(prediction, match)
      if (prediction.pointsEarned !== result.pointsEarned) {
        await predictionRepository.update(
          { id: prediction.id },
          { pointsEarned: result.pointsEarned }
        )
      }
    }

    const userIds = [...new Set(predictions.map((p) => p.userId))]
    for (const userId of userIds) {
      await this.recalculateUserStats(userId)
    }
  }

  async recalculateUserStats(userId) {
    const userPredictions = await predictionRepository.findFinishedByUser(userId)

    const totalPredictions = userPredictions.length
    let totalPoints = 0
    let correctPredictions = 0
    let exactScoreHits = 0

    for (const p of userPredictions) {
      const result = calculatePoints(p, p.match)
      totalPoints += result.pointsEarned
      if (result.isCorrect) correctPredictions++
      if (result.isExactScore) exactScoreHits++
    }

    let streak = 0
    for (let i = userPredictions.length - 1; i >= 0; i--) {
      const result = calculatePoints(userPredictions[i], userPredictions[i].match)
      if (result.isCorrect) {
        streak++
      } else {
        break
      }
    }

    const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0

    await userRepository.update({ id: userId }, {
      totalPoints,
      correctPredictions,
      totalPredictions,
      exactScoreHits,
      streak,
      accuracy,
    })
  }
}
