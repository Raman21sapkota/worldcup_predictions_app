import { verifyToken, COOKIE_NAME } from "../lib/auth.js"

async function auth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  const payload = await verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: "Invalid session" })
  }
  req.user = payload
  next()
}

export { auth }
