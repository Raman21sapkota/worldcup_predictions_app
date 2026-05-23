export const sendOKResponse = (res, statusCode, message, data = null, status = 'success') => {
  return res.status(statusCode).json({
    status,
    message,
    ...(data && { data }),
  })
}

export const sendErrorResponse = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error }),
  })
}
