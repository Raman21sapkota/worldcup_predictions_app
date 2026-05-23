import { AppError } from "../utils/AppError.js"
import { userRepository } from "../repositories/index.js"

export class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }
    return user
  }

  async updateUsername(userId, username) {
    const trimmed = username.trim()
    if (trimmed.length === 0) {
      throw new AppError("Username is required", 400)
    }
    if (trimmed.length > 50) {
      throw new AppError("Username too long (max 50)", 400)
    }
    return userRepository.update({ id: userId }, { username: trimmed })
  }

  async getUser(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }
    return user
  }
}
