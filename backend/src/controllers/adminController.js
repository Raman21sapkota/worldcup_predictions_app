export class AdminController {
  constructor(adminService) {
    this.adminService = adminService
  }

  async banUser(req, res, next) {
    try {
      const { userId } = req.body
      await this.adminService.banUser(userId)
      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  }
}
