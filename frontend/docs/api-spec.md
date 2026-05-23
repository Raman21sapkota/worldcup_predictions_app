# API Specification

All backend APIs for World Cup Prediction App.

---

# Auth APIs

## GET /api/auth/login
Start Google OAuth login.

## GET /api/auth/callback
Handles login, creates user, sets JWT cookie.

## POST /api/auth/logout
Logs out user.

---

# Match APIs

## GET /api/matches
Returns all fixtures + results.

## GET /api/matches/:id
Returns single match details.

---

# Prediction APIs

## POST /api/predictions
Create or update prediction.

Rules:
- Only before kickoff
- One prediction per user per match

## GET /api/predictions/me
Returns logged-in user's predictions.

## GET /api/predictions/user/:id
Returns user prediction history (visibility rules apply).

---

# Leaderboard APIs

## GET /api/leaderboard
Returns ranked users sorted by points.

---

# User Profile APIs

## GET /api/users/me
Returns logged-in user profile.

Response:
```json
{
  "id": "string",
  "email": "user@gmail.com",
  "username": "Raman",
  "avatarUrl": "url",
  "role": "USER",
  "totalPoints": 120,
  "accuracy": 78,
  "streak": 5
}