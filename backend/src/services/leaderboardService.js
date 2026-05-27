import { userRepository } from "../repositories/index.js"

let cache = null
let cacheTime = 0
const TTL = 300_000

export class LeaderboardService {
  async getLeaderboard() {
    if (cache && Date.now() - cacheTime < TTL) {
      return cache
    }
    const data = await userRepository.findLeaderboard()
    cache = data
    cacheTime = Date.now()
    return data
  }

  invalidateCache() {
    cache = null
  }
}

export const leaderboardService = new LeaderboardService()
