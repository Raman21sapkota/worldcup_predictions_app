import { sendErrorResponse } from "../lib/responseHelper.js"

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)
  return sendErrorResponse(
    res,
    err.statusCode || 500,
    err.message || "Internal Server Error",
    process.env.NODE_ENV === "development" ? err.stack : undefined
  )
}

export default errorHandler
