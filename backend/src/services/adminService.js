import { userRepository } from "../repositories/index.js"

export class AdminService {
  async banUser(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }
    if (user.role === "ADMIN") {
      throw new Error("Cannot ban another admin")
    }
    await userRepository.update({ id: userId }, { isBanned: true })
  }
}
