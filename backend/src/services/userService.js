import { userRepository } from "../repositories/index.js"

export class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  async updateUsername(userId, username) {
    const trimmed = username.trim()
    if (trimmed.length === 0) {
      throw new Error("Username is required")
    }
    if (trimmed.length > 50) {
      throw new Error("Username too long (max 50)")
    }
    return userRepository.update({ id: userId }, { username: trimmed })
  }

  async getUser(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }
}
