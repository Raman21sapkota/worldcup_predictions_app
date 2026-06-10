import prisma from "../lib/prisma.js"
import { BaseRepository } from "./BaseRepository.js"

class PredictionRepository extends BaseRepository {
  constructor() {
    super(prisma.prediction)
  }

  async findByUserWithMatch(userId) {
    return this.model.findMany({
      where: { userId },
      include: { match: true },
      orderBy: { match: { kickoffTime: "asc" } },
    })
  }

  async upsertByUserAndMatch(userId, matchId, predictedHomeScore, predictedAwayScore, predictedWinner) {
    return this.model.upsert({
      where: { userId_matchId: { userId, matchId } },
      create: { userId, matchId, predictedHomeScore, predictedAwayScore, predictedWinner: predictedWinner ?? null, skipped: false },
      update: { predictedHomeScore, predictedAwayScore, predictedWinner: predictedWinner ?? null, skipped: false },
    })
  }

  async findByMatch(matchId) {
    return this.findAll({ matchId })
  }

  async findFinishedByUser(userId) {
    return this.model.findMany({
      where: { userId, match: { status: "FINISHED" } },
      include: { match: true },
      orderBy: { match: { kickoffTime: "asc" } },
    })
  }
}

export const predictionRepository = new PredictionRepository()
