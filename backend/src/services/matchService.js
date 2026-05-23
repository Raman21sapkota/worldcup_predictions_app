import { matchRepository } from "../repositories/index.js"

export class MatchService {
  async getAllMatches() {
    return matchRepository.findAllOrdered()
  }
}
