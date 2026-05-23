# Database Schema

This file explains the database structure.

We use Prisma with PostgreSQL.

Main tables:
- User
- Match
- Prediction

Rules:
- One prediction per user per match
- Match data is stored as snapshot from API
- Leaderboard is derived from User.totalPoints