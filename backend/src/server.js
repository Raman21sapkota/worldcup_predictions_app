import { setupExpressApp } from "./app.js"
import prisma from "./lib/prisma.js"

const PORT = parseInt(process.env.PORT) || 4000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("Database connected successfully")
    const app = setupExpressApp()
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT} - (${process.env.NODE_ENV || "development"} mode)`)
    })
  } catch (error) {
    console.error("Error starting the server:", error)
    process.exit(1)
  }
}

startServer()
