import { userRepository } from "../repositories/index.js"

export class LeaderboardService {
  async getLeaderboard() {
    return userRepository.findLeaderboard()
  }
}
