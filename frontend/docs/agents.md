# OpenCode Agents

---

# Frontend Agent

Responsible for:
- Next.js App Router pages
- Tailwind styling
- shadcn/ui integration
- responsive layouts
- dark mode implementation
- prediction cards
- leaderboard UI
- countdown timers
- user history pages

Requirements:
- mobile-first design
- minimal UI
- reusable components
- accessible interactions

Avoid:
- cluttered layouts
- unnecessary animations
- overcomplicated state management

---

# Backend Agent

Responsible for:
- API route handlers
- authentication logic
- JWT handling
- HttpOnly cookies
- football API syncing
- prediction locking
- scoring engine
- leaderboard updates

Requirements:
- secure auth flow
- clean route structure
- deterministic scoring
- validation on all routes

Avoid:
- duplicated business logic
- trusting frontend validation
- direct dependency on football API responses

---

# Database Agent

Responsible for:
- Prisma schema
- PostgreSQL modeling
- migrations
- indexes
- relational integrity

Core tables:
- users
- matches
- predictions

Requirements:
- normalized schema
- scalable queries
- store snapshot data
- optimize leaderboard queries

Avoid:
- unnecessary tables
- over-normalization
- recalculating leaderboard totals repeatedly

---

# Sync Agent

Responsible for:
- football API integration
- scheduled sync jobs
- fixture updates
- score updates
- match status updates

Requirements:
- sync only changed data
- use external_api_id
- update finished matches safely
- trigger scoring after FINISHED status

Avoid:
- deleting historical data
- depending on API uptime
- unnecessary polling

---

# Scoring Agent

Responsible for:
- prediction evaluation
- exact score bonus logic
- awarding points
- updating user totals
- updating accuracy statistics

Rules:
- correct outcome = base points
- exact score = base points + bonus
- wrong prediction = 0
- skipped match = 0

Requirements:
- deterministic scoring
- idempotent calculations
- prevent duplicate scoring

---

# UI/UX Agent

Responsible for:
- interaction consistency
- prediction visibility states
- color systems
- spacing hierarchy
- typography

Prediction states:
- hidden
- locked
- correct
- incorrect
- skipped

Requirements:
- intuitive interfaces
- minimal friction
- sports dashboard feel

Avoid:
- sportsbook aesthetics
- excessive colors
- visually noisy layouts

---

# Security Agent

Responsible for:
- OAuth validation
- JWT verification
- cookie security
- route protection
- admin authorization

Requirements:
- HttpOnly cookies
- secure JWT signing
- protected admin actions
- server-side validation

Avoid:
- localStorage auth
- exposing sensitive tokens
- trusting client-side auth state

---

# Admin Agent

Responsible for:
- match point configuration
- exact score bonus configuration
- admin-only controls
- user prediction inspection

Admin can:
- modify match point weights
- modify exact score bonuses
- inspect user prediction history

Admin cannot:
- modify predictions
- manually award points
- alter leaderboard totals directly

---

# Design Compliance

All agents MUST follow the UI design system defined in `docs/design.md` when creating or reviewing components and pages.

