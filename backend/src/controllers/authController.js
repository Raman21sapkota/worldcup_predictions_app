import { COOKIE_NAME, cookieOptions, clearCookieOptions } from "../lib/auth.js"

export class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  login(req, res) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    res.redirect(this.authService.getGoogleAuthUrl(frontendUrl))
  }

  async callback(req, res) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
      const { code, error } = req.query
      if (error || !code) {
        return res.redirect(frontendUrl)
      }
      const { token } = await this.authService.handleCallback(code, frontendUrl)
      res.cookie(COOKIE_NAME, token, cookieOptions())
      res.redirect(`${frontendUrl}/home`)
    } catch (err) {
      console.error("Auth callback error:", err)
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
      res.redirect(frontendUrl)
    }
  }

  logout(req, res) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    res.cookie(COOKIE_NAME, "", clearCookieOptions())
    res.redirect(frontendUrl)
  }

  me(req, res) {
    res.json({ id: req.user.userId, email: req.user.email, role: req.user.role })
  }
}
