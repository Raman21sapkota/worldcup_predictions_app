import { userRepository } from "../repositories/index.js"

let cache = null
let cacheTime = 0
const TTL = 300_000

export class LeaderboardService {
  async getLeaderboard() {
    if (cache && Date.now() - cacheTime < TTL) {
      console.log("Leaderboard cache HIT")
      return cache
    }
    console.log("Leaderboard cache MISS")
    const data = await userRepository.findLeaderboard()
    cache = data
    cacheTime = Date.now()
    return data
  }

  invalidateCache() {
    console.log("Leaderboard cache invalidated")
    cache = null
  }
}

export const leaderboardService = new LeaderboardService()
