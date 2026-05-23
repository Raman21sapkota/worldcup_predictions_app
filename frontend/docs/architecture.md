# System Architecture

---

# Overview

The application is a monolithic fullstack Next.js application built using the App Router architecture.

The system consists of:
- Next.js frontend
- Next.js backend route handlers
- PostgreSQL database
- Prisma ORM
- Football API synchronization jobs

The football API is used only as a synchronization source.

The application itself reads all fixture and leaderboard data from PostgreSQL.

---

# Tech Stack

## Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend
- Next.js Route Handlers
- Server Actions where appropriate

## Database
- PostgreSQL

## ORM
- Prisma

## Authentication
- Google OAuth
- JWT
- HttpOnly cookies

## Hosting
- Vercel
- Supabase or Neon PostgreSQL

## External API
- Football-Data.org API

---

# Architectural Principles

- monolithic architecture
- minimal complexity
- mobile-first
- server-first rendering
- deterministic scoring
- avoid overengineering

---

# Rendering Strategy

## Server Components

Use server components for:
- fixtures feed
- leaderboard
- user history
- profile pages

Reason:
- faster rendering
- reduced client bundle
- easier data fetching

---

## Client Components

Use client components only for:
- prediction interactions
- countdown timers
- tabs/dropdowns
- lightweight interactivity

---

# Authentication Flow

```txt
User clicks Google Login
        ↓
Google OAuth callback
        ↓
Backend validates user
        ↓
JWT generated
        ↓
JWT stored in HttpOnly cookie
        ↓
Protected routes enabled