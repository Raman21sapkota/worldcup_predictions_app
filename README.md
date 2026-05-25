# World Cup Predictor

A social prediction game for the FIFA World Cup 2026. Sign in with Google, predict match scores, earn points, and compete on a live leaderboard.

## Features

- **Google OAuth** — sign in with Google, admin auto-detected by email
- **Match predictions** — predict exact scores via +/- steppers
- **Live leaderboard** — updates in real-time via Socket.IO when matches sync
- **Scoring** — 3 pts for exact score, 2 pts for correct outcome, 0 for wrong
- **Streaks & accuracy tracking** — consecutive correct predictions + accuracy %
- **Match sync** — pull matches from Football-Data.org (admin button or GitHub cron every 6h)
- **Stage filtering** — filter by Group Stage, Round of 16, Quarter-finals, etc.
- **Profile pages** — view any user's predictions (upcoming scores hidden for privacy)
- **Nepal timezone** — countdown timers in Asia/Kathmandu
- **Admin controls** — sync matches, ban users

## Architecture

```
Browser ──► Vercel (Next.js 16)
  │               │
  │  fetch()      │ rewrite /api/* ──► backend
  │  (same-origin)│
  ▼               ▼
Socket.IO ──► Express Backend (port 4000)
                  │
              Controllers ──► Services ──► Repositories
                  │
              Prisma ORM + PostgreSQL (Neon)
```

The frontend proxies all `/api/*` requests to the backend via Next.js rewrites, making them appear same-origin (no CORS needed). Socket.IO connects directly to the backend for real-time updates.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Express 4, Socket.IO, Prisma, PostgreSQL, Google OAuth, Zod

## Quick Start

### Docker (recommended)

```bash
git clone <repo>
cd worldcup-predictor
# Add .env file (see below)
docker compose up
```

### Manual

```bash
# Terminal 1 — Backend (port 4000)
cd worldcup-predictor/backend
cp ../.env .     # or symlink
npm install
npm run dev

# Terminal 2 — Frontend (port 3000)
cd worldcup-predictor/frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` at the project root with:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | JWT signing key |
| `ADMIN_EMAIL` | Email to auto-assign ADMIN role |
| `FOOTBALL_API_KEY` | Football-Data.org API key |
| `CRON_SECRET` | Secret for GitHub cron auth |

And in `frontend/.env`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL for Socket.IO (`http://localhost:4000`) |
| `NEXT_PUBLIC_APP_URL` | Frontend URL (`http://localhost:3000`) |
## Project Structure

```
├── backend/          # Express API
│   └── src/
│       ├── controllers/    # HTTP handlers
│       ├── services/       # Business logic
│       ├── repositories/   # Prisma queries
│       ├── middleware/      # Auth, admin, validation
│       ├── routes/         # Route definitions
│       └── lib/            # Prisma client, JWT, scoring
├── frontend/         # Next.js app
│   └── src/
│       ├── app/            # Pages (home, leaderboard, history, profile)
│       ├── components/     # UI + feature components
│       └── lib/            # Auth, socket, API helpers
└── docker-compose.yml
```


