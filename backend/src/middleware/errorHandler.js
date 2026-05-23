const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  if (err.code === "P2002") {
    return res.status(409).json({ error: `Duplicate value for ${err.meta?.target || "field"}` })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({ error: message })
}

export default errorHandler
