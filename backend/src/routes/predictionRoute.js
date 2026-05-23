import { Router } from "express"
import { PredictionController } from "../controllers/predictionController.js"
import { PredictionService } from "../services/predictionService.js"
import { auth } from "../middleware/auth.js"
import { validatePrediction } from "../middleware/validation.js"

const router = Router()

const predictionService = new PredictionService()
const predictionController = new PredictionController(predictionService)

router.post("/", auth, validatePrediction, (req, res) => predictionController.create(req, res))
router.get("/me", auth, (req, res) => predictionController.getMyPredictions(req, res))
router.get("/user/:userId", auth, (req, res) => predictionController.getUserPredictions(req, res))

export default router
