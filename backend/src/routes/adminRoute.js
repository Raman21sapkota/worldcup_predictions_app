import { Router } from "express"
import { AdminController } from "../controllers/adminController.js"
import { AdminService } from "../services/adminService.js"
import { auth } from "../middleware/auth.js"
import { admin } from "../middleware/admin.js"
import { validateBanUser } from "../middleware/validation.js"

const router = Router()

const adminService = new AdminService()
const adminController = new AdminController(adminService)

router.post("/ban-user", auth, admin, validateBanUser, (req, res) => adminController.banUser(req, res))

export default router
