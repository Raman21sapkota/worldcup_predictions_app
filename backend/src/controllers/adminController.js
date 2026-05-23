export class AdminController {
  constructor(adminService) {
    this.adminService = adminService
  }

  async banUser(req, res) {
    try {
      const { userId } = req.body
      await this.adminService.banUser(userId)
      res.json({ success: true })
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message })
      }
      if (error.message === "Cannot ban another admin") {
        return res.status(400).json({ error: error.message })
      }
      console.error("Ban user failed:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}
