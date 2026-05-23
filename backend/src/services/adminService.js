import { AppError } from "../utils/AppError.js"
import { userRepository } from "../repositories/index.js"

export class AdminService {
  async banUser(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }
    if (user.role === "ADMIN") {
      throw new AppError("Cannot ban another admin", 400)
    }
    await userRepository.update({ id: userId }, { isBanned: true })
  }
}
