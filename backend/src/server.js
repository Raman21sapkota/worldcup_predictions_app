import { createServer } from "http"
import { Server } from "socket.io"
import { setupExpressApp } from "./app.js"
import prisma from "./lib/prisma.js"

const PORT = parseInt(process.env.PORT) || 4000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("Database connected successfully")

    const app = setupExpressApp()
    const httpServer = createServer(app)

    const io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || true,
        credentials: true,
      },
    })

    app.locals.io = io

    io.on("connection", (socket) => {
      console.log(`Socket connected (total: ${io.engine.clientsCount})`)
      socket.on("disconnect", () => {
        console.log(`Socket disconnected (total: ${io.engine.clientsCount})`)
      })
    })

    httpServer.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT} - (${process.env.NODE_ENV || "development"} mode)`)
    })
  } catch (error) {
    console.error("Error starting the server:", error)
    process.exit(1)
  }
}

startServer()
