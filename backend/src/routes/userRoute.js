import { Router } from "express"
import { UserController } from "../controllers/userController.js"
import { UserService } from "../services/userService.js"
import { auth } from "../middleware/auth.js"

const router = Router()

const userService = new UserService()
const userController = new UserController(userService)

router.get("/me", auth, (req, res) => userController.getProfile(req, res))
router.patch("/me", auth, (req, res) => userController.updateUsername(req, res))
router.get("/:userId", auth, (req, res) => userController.getUser(req, res))

export default router
