# FIFA World Cup 2026 Predictor — Design System

---

# Design Philosophy

The application should feel:
- modern
- minimal
- competitive
- social
- lightweight

The design must prioritize:
- clarity
- speed
- readability
- mobile usability

The product should resemble:
- FotMob simplicity
- Linear cleanliness

Avoid:
- gambling aesthetics
- cluttered dashboards
- flashy gradients
- excessive animation

---

# Theme

Dark mode only.

---

# Color Palette

## Background
#0B0F14

## Surface
#111827

## Border
rgba(255,255,255,0.08)

## Text Primary
#FFFFFF

## Text Secondary
#9CA3AF

---

# Status Colors

## Correct Prediction
Green

## Incorrect Prediction
Red

## Skipped Prediction
Gray

## Hidden Prediction
Blue/Purple muted tone

## LIVE Match
Red accent

---

# Typography

Primary Font:
- Inter

Typography style:
- clean
- compact
- dashboard-oriented

Avoid:
- oversized headings
- decorative fonts

---

# Layout Principles

- mobile-first
- compact spacing
- strong hierarchy
- consistent card sizing
- minimal scrolling friction

---

# Navigation

## Desktop
Top navigation bar.

## Mobile
Bottom tab navigation.

Tabs:
- Home
- Leaderboard
- History
- Profile

---

# Homepage

Primary dashboard page.

Displays:
- upcoming matches
- live matches
- finished matches

Grouped chronologically.

---

# Match Card

Each match card displays:
- team flags
- team names
- stage
- kickoff countdown
- available points
- exact score bonus
- prediction controls

---

# Prediction Controls

Buttons:
- Home Win
- Draw
- Away Win
- Skip

Optional:
- exact score input

Buttons should feel:
- fast
- tactile
- responsive

---

# Prediction States

## Upcoming
Prediction hidden from others.

## Locked
Prediction visible after kickoff.

## Finished
Prediction scored and color coded.

---

# Prediction Status Indicators

Correct:
✔ Green

Incorrect:
✖ Red

Skipped:
➖ Gray

Hidden:
🔒 Muted

---

# Leaderboard Design

Leaderboard should feel:
- competitive
- readable
- social

Columns:
- rank
- avatar
- username
- total points
- accuracy
- streak

Rows should be clickable.

---

# User History Page

Displays:
- match
- user prediction
- actual result
- earned points
- prediction status

Upcoming predictions remain hidden.

---

# Countdown Timers

Countdowns should:
- update live
- remain subtle
- avoid distracting animations

Example:
"Starts in 01h 24m"

---

# Animations

Use:
- soft hover transitions
- subtle fades
- lightweight motion

Avoid:
- large entrance animations
- bouncing effects
- flashy transitions

---

# Components

Core reusable components:
- MatchCard
- PredictionBadge
- LeaderboardTable
- CountdownTimer
- UserHistoryTable
- Navbar
- BottomNavigation

---

# Responsive Behavior

The app must work smoothly on:
- mobile devices
- tablets
- desktop screens

Mobile experience is highest priority.

---

# Empty States

Use clean empty states.

Examples:
- No predictions yet
- No live matches
- Waiting for kickoff

Avoid overly playful illustrations.

---

# Visual Identity

This product should feel like:
- a private sports prediction dashboard
- a competitive friend leaderboard
- a clean football companion app

It should NOT feel like:
- a sportsbook
- a casino
- fantasy gambling software