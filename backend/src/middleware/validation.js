import { z } from "zod"
import { AppError } from "../utils/AppError.js"

const UUIDFormat = z.string().min(1, "ID is required")
const scoreFormat = z.number().int("Score must be an integer").min(0, "Score cannot be negative")

export const predictionSchema = z.object({
  matchId: z.string().min(1, "matchId is required"),
  predictedHomeScore: scoreFormat,
  predictedAwayScore: scoreFormat,
  predictedWinner: z.enum(["HOME_TEAM", "AWAY_TEAM"]).optional().nullable(),
})

export const updateUsernameSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(50, "Username too long (max 50)"),
})

export const userIdParamSchema = z.object({
  userId: UUIDFormat,
})

export const banUserSchema = z.object({
  userId: UUIDFormat,
})

export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error.errors) {
        throw new AppError("Validation failed", 400)
      }
      throw new AppError("Invalid input data", 400)
    }
  }
}

export const validateParam = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error.errors) {
        throw new AppError("Validation failed", 400)
      }
      throw new AppError("Invalid input data", 400)
    }
  }
}

export const validatePrediction = validateSchema(predictionSchema)
export const validateUpdateUsername = validateSchema(updateUsernameSchema)
export const validateBanUser = validateSchema(banUserSchema)
export const validateUserIdParam = validateParam(userIdParamSchema)
