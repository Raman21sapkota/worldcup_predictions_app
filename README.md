# World Cup Predictions

A full-stack web application for predicting World Cup match outcomes. Users authenticate via Google, make score predictions for upcoming matches, earn points based on accuracy, and compete on a real-time leaderboard.

Built with a modern architecture — a Next.js frontend communicates with a separate Express.js API backend through a rewrite proxy. The backend follows a layered architecture (controllers → services → repositories) for clean separation of concerns. Match data is synced on demand from the football-data.org API.

## Features

- **Google OAuth authentication** — Sign in with your Google account. Session managed via httpOnly JWT cookies.
- **Match prediction** — Predict home and away scores for World Cup matches. Intuitive score-stepper UI for quick entry.
- **Points system** — Earn points based on prediction accuracy: exact score, correct winner with score difference, or correct winner only.
- **Live leaderboard** — Real-time rankings showing total points, accuracy percentage, correct predictions, streaks, and exact-score hits.
- **Admin match sync** — Admin users can fetch and sync match data from the football-data.org API with a single click.
- **User profiles** — View your stats, edit username, track prediction history.
- **Responsive design** — Mobile-first UI using shadcn/ui components.
- **Dockerized backend** — Backend and PostgreSQL run in Docker containers for easy local setup.
- **Player pages** — View any user's predictions and performance stats.

## Architecture

```
worldcup-predictor/
├── backend/                    Express.js API server
│   ├── src/
│   │   ├── controllers/        Request/response handlers
│   │   ├── services/           Business logic layer
│   │   ├── repositories/       Database access layer (Prisma ORM)
│   │   ├── middleware/         Auth, admin, validation, error handling
│   │   ├── routes/             Route definitions
│   │   └── lib/                Utilities (JWT, Prisma client, scoring, response helpers)
│   └── prisma/                 Database schema and migrations
├── frontend/                   Next.js client application
│   ├── src/
│   │   ├── app/                Pages, layouts, and API route handlers
│   │   ├── components/         React components (shadcn/ui based)
│   │   └── lib/                Client/server API helpers and auth
└── docker-compose.yml          Postgres + backend services
```

The frontend uses Next.js rewrites to proxy `/api/*` requests to the backend, keeping auth cookies on a single domain while maintaining a separate API server.

## Tech Stack

| Layer        | Technology                               |
|-------------|------------------------------------------|
| Frontend    | Next.js 16, TypeScript, shadcn/ui        |
| Backend     | Express.js 4, ES Modules                 |
| Database    | PostgreSQL via Prisma ORM                |
| Auth        | Google OAuth 2.0, JWT (jose), httpOnly cookies |
| Validation  | Zod                                      |
| Security    | Helmet, CORS, cookie-parser              |
| External API| football-data.org (match data)           |
| Containers  | Docker, Docker Compose                   |
| Runtime     | Node.js 22                               |

## Getting Started

### Prerequisites

- Node.js 22+
- Docker (optional, for containerized backend)

### Run locally (without Docker)

1. **Start Postgres** — either locally or use a cloud instance like Neon

2. **Backend**
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`

### Run with Docker

```bash
docker compose up -d
```

Starts Postgres + backend. Frontend runs natively (`npm run dev`).

### Environment Variables

Each `.env.example` file shows the required variables. Key ones:

- `DATABASE_URL` — PostgreSQL connection string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `JWT_SECRET` — Secret for signing tokens
- `ADMIN_EMAIL` — Email assigned admin role
- `FOOTBALL_API_KEY` — football-data.org API key
- `FRONTEND_URL` — Frontend origin for CORS/OAuth redirects
