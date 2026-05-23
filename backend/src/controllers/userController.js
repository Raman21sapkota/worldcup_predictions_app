export class UserController {
  constructor(userService) {
    this.userService = userService
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.userService.getProfile(req.user.userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateUsername(req, res, next) {
    try {
      const { username } = req.body
      const user = await this.userService.updateUsername(req.user.userId, username)
      res.json({ id: user.id, username: user.username })
    } catch (error) {
      next(error)
    }
  }

  async getUser(req, res, next) {
    try {
      const { userId } = req.params
      const user = await this.userService.getUser(userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}
