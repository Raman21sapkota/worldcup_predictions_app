# FIFA World Cup 2026 Predictor App

You are building a minimalist prediction web app for the FIFA World Cup 2026.

The app is private and intended for a small friend group.

Users can:
- login using Google OAuth
- predict match outcomes
- skip predictions
- earn points
- compete on a global leaderboard
- inspect other users' prediction history after prediction lock

This is NOT a gambling or betting platform.

---

# Tech Stack

Frontend + Backend:
- Next.js (App Router)
- TypeScript

Database:
- PostgreSQL

ORM:
- Prisma

Authentication:
- Google OAuth
- JWT
- HttpOnly cookies

Styling:
- Tailwind CSS
- shadcn/ui

Deployment:
- Vercel
- PostgreSQL provider (Supabase or Neon)

Football Data:
- Football-Data.org API

---

# Core Product Philosophy

The app should feel:
- minimalist
- fast
- competitive
- social
- dark-mode-first

Avoid:
- casino aesthetics
- clutter
- overengineering
- unnecessary animations

The UI should resemble:
- FotMob simplicity
- Linear cleanliness

---

# Core Features

## Authentication
- Google OAuth only
- JWT stored in HttpOnly cookie
- no email/password authentication

---

## Match Fixtures
Users can:
- view World Cup fixtures
- see match countdowns
- see match stage
- see available points

---

## Predictions

Users can:
- predict:
  - home win
  - draw
  - away win
- optionally enter exact score prediction
- skip any match

Predictions:
- editable before kickoff
- locked at kickoff
- revealed publicly at kickoff

---

## Scoring

Admin controls:
- base match points
- exact score bonus

Scoring rules:
- correct winner/draw = base points
- exact score = base points + exact score bonus
- incorrect prediction = 0
- skipped match = 0

---

## Leaderboard

Single global leaderboard.

Leaderboard displays:
- rank
- user avatar
- total points
- accuracy
- correct predictions
- streak

Leaderboard should update automatically after every finished match.

Store aggregated leaderboard values directly on the user table.

---

## Prediction Visibility Rules

Before kickoff:
- predictions hidden from everyone except owner

At kickoff:
- predictions lock permanently
- predictions become visible to everyone

After match ends:
- predictions
- results
- earned points
remain visible permanently

---

## Prediction History

Users can click another user from leaderboard and view:
- past predictions
- match results
- earned points
- skipped matches

Upcoming predictions must remain hidden until kickoff.

---

## Match Syncing

Football API is only a sync source.

The app MUST:
- store fixture snapshot data in PostgreSQL
- never depend directly on live API responses for rendering

Use cron jobs to:
- sync fixtures
- sync scores
- update statuses
- calculate points
- refresh leaderboard

---

# Match Lifecycle

UPCOMING:
- predictions editable
- predictions hidden

LIVE:
- predictions locked
- predictions visible

FINISHED:
- scores finalized
- points awarded
- leaderboard updated

---

# Design Requirements

Dark mode only.

Minimal dashboard aesthetic.

Mobile-first responsive design.

Use:
- compact cards
- subtle borders
- soft transitions
- clean typography

Avoid:
- flashy gradients
- gambling UI
- excessive motion

---

# UI Pages

## Home
Fixture feed with prediction cards.

## Leaderboard
Global ranking table.

## User History 
Prediction history for a selected user.

## Profile
Minimal user profile/settings.

---

# Performance Requirements

- Use server components where possible
- Use client components only for interactivity
- Store snapshot data locally
- Avoid unnecessary API calls
- Avoid recalculating leaderboard on every request

---

# Engineering Principles

- keep architecture simple
- prefer maintainability over cleverness
- avoid premature optimization
- avoid unnecessary abstractions
- use clean folder structure
- prioritize readable code
- write reusable UI components

---

# Important Constraints

Do NOT:
- implement real money betting
- add payment systems
- use microservices
- add websockets unless necessary
- create separate frontend/backend repos

This should remain a monolithic Next.js application.