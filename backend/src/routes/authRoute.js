import { Router } from "express"
import { AuthController } from "../controllers/authController.js"
import { AuthService } from "../services/authService.js"
import { auth } from "../middleware/auth.js"

const router = Router()

const authService = new AuthService()
const authController = new AuthController(authService)

router.get("/login", (req, res) => authController.login(req, res))
router.get("/callback", (req, res) => authController.callback(req, res))
router.post("/logout", (req, res) => authController.logout(req, res))
router.get("/me", auth, (req, res) => authController.me(req, res))

export default router
