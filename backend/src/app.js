import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import errorHandler from "./middleware/errorHandler.js"

import authRoutes from "./routes/authRoute.js"
import matchRoutes from "./routes/matchRoute.js"
import predictionRoutes from "./routes/predictionRoute.js"
import leaderboardRoutes from "./routes/leaderboardRoute.js"
import syncRoutes from "./routes/syncRoute.js"
import adminRoutes from "./routes/adminRoute.js"
import userRoutes from "./routes/userRoute.js"

export function setupExpressApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }))
  app.use(cookieParser())
  app.use(express.json())

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" })
  })

  app.use("/api/auth", authRoutes)
  app.use("/api/matches", matchRoutes)
  app.use("/api/predictions", predictionRoutes)
  app.use("/api/leaderboard", leaderboardRoutes)
  app.use("/api/sync", syncRoutes)
  app.use("/api/admin", adminRoutes)
  app.use("/api/users", userRoutes)

  app.use((req, res) => {
    res.status(404).json({ message: "Route does not exist" })
  })

  app.use(errorHandler)

  return app
}
