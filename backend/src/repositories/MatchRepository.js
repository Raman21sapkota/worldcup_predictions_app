import prisma from "../lib/prisma.js"
import { BaseRepository } from "./BaseRepository.js"

class MatchRepository extends BaseRepository {
  constructor() {
    super(prisma.match)
  }

  async findAllOrdered() {
    return this.model.findMany({
      orderBy: { kickoffTime: "asc" },
    })
  }

  async findByExternalApiId(externalApiId) {
    return this.findOne({ externalApiId })
  }

  async upsertByExternalApiId(externalApiId, data) {
    return this.model.upsert({
      where: { externalApiId },
      create: { externalApiId, ...data },
      update: data,
    })
  }

  async findMostRecentSync() {
    return this.model.findFirst({
      orderBy: { syncedAt: "desc" },
      select: { syncedAt: true },
    })
  }
}

export const matchRepository = new MatchRepository()
