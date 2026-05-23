import { Router } from "express"
import { SyncController } from "../controllers/syncController.js"
import { SyncService } from "../services/syncService.js"
import { auth } from "../middleware/auth.js"
import { admin } from "../middleware/admin.js"

const router = Router()

const syncService = new SyncService()
const syncController = new SyncController(syncService)

router.post("/", auth, admin, (req, res) => syncController.sync(req, res))
router.get("/", auth, admin, (req, res) => syncController.getSyncInfo(req, res))
router.get("/cron", (req, res) => syncController.cronSync(req, res))

export default router
