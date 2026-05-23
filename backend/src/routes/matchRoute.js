import { Router } from "express"
import { MatchController } from "../controllers/matchController.js"
import { MatchService } from "../services/matchService.js"
import { auth } from "../middleware/auth.js"

const router = Router()

const matchService = new MatchService()
const matchController = new MatchController(matchService)

router.get("/", auth, (req, res) => matchController.getAll(req, res))

export default router
