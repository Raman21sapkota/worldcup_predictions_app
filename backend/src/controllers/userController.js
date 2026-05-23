export class UserController {
  constructor(userService) {
    this.userService = userService
  }

  async getProfile(req, res) {
    try {
      const user = await this.userService.getProfile(req.user.userId)
      res.json(user)
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message })
      }
      console.error("Failed to fetch user profile:", error)
      res.status(500).json({ error: "Failed to fetch user profile" })
    }
  }

  async updateUsername(req, res) {
    try {
      const { username } = req.body
      const user = await this.userService.updateUsername(req.user.userId, username)
      res.json({ id: user.id, username: user.username })
    } catch (error) {
      if (
        error.message === "Username is required" ||
        error.message === "Username too long (max 50)"
      ) {
        return res.status(400).json({ error: error.message })
      }
      console.error("Failed to update profile:", error)
      res.status(500).json({ error: "Failed to update profile" })
    }
  }

  async getUser(req, res) {
    try {
      const { userId } = req.params
      const user = await this.userService.getUser(userId)
      res.json(user)
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message })
      }
      console.error("Failed to fetch user:", error)
      res.status(500).json({ error: "Failed to fetch user" })
    }
  }
}
