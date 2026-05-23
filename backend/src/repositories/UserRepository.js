import prisma from "../lib/prisma.js"
import { BaseRepository } from "./BaseRepository.js"

class UserRepository extends BaseRepository {
  constructor() {
    super(prisma.user)
  }

  async findByEmail(email) {
    return this.findOne({ email })
  }

  async findLeaderboard() {
    return this.model.findMany({
      where: { isBanned: false },
      orderBy: [{ totalPoints: "desc" }, { exactScoreHits: "desc" }],
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        totalPoints: true,
        correctPredictions: true,
        totalPredictions: true,
        accuracy: true,
        streak: true,
        exactScoreHits: true,
      },
    })
  }

  async upsertByGoogle(googleUser, role) {
    return this.model.upsert({
      where: { email: googleUser.email },
      update: { username: googleUser.name, avatarUrl: googleUser.picture },
      create: {
        googleId: googleUser.id,
        email: googleUser.email,
        username: googleUser.name,
        avatarUrl: googleUser.picture,
        role,
      },
    })
  }
}

export const userRepository = new UserRepository()
