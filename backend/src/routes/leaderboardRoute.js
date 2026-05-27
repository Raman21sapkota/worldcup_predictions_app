import { Router } from "express"
import { LeaderboardController } from "../controllers/leaderboardController.js"
import { leaderboardService } from "../services/leaderboardService.js"
import { auth } from "../middleware/auth.js"

const router = Router()

const leaderboardController = new LeaderboardController(leaderboardService)

router.get("/", auth, (req, res) => leaderboardController.getLeaderboard(req, res))

export default router
