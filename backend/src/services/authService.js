import { signToken } from "../lib/auth.js"
import { userRepository } from "../repositories/index.js"

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
const SCOPES = ["openid", "email", "profile"].join(" ")

export class AuthService {
  getGoogleAuthUrl(frontendUrl) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${frontendUrl}/api/auth/callback`,
      response_type: "code",
      scope: SCOPES,
      access_type: "offline",
      prompt: "consent",
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async handleCallback(code, frontendUrl) {
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${frontendUrl}/api/auth/callback`,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      throw new Error(`Token exchange failed: ${err}`)
    }

    const tokens = await tokenRes.json()
    const userRes = await fetch(USER_INFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userRes.ok) throw new Error("Failed to fetch user info")

    const googleUser = await userRes.json()
    const adminEmail = process.env.ADMIN_EMAIL
    const role = googleUser.email === adminEmail ? "ADMIN" : "USER"

    const user = await userRepository.upsertByGoogle(googleUser, role)

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { token }
  }
}
