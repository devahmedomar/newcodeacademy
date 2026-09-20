# Student Portal — Feature Documentation

Complete documentation of the **New Code Academy Student Portal** (Angular 22 + PrimeNG frontend).

## Table of contents

| Doc | What it covers |
| --- | --- |
| [01-overview.md](01-overview.md) | System overview, tech stack, architecture, navigation |
| [02-pages-and-routes.md](02-pages-and-routes.md) | Every page/route and what it shows |
| [03-learning-lessons.md](03-learning-lessons.md) | Video lessons, modules, watch tracking, resume, notes |
| [04-quizzes-and-exams.md](04-quizzes-and-exams.md) | Lesson quizzes, attempts, results, review, practice (drill) mode |
| [05-grades-and-points.md](05-grades-and-points.md) | Exams, homework, quizzes grades, points buckets, averages |
| [06-gamification.md](06-gamification.md) | Streaks, weekly goal, levels, badges, leaderboard, activity heatmap |
| [07-payments.md](07-payments.md) | Tuition status, current-month banner, payment history |
| [08-authentication.md](08-authentication.md) | Login, tokens, route guards, change password, logout |
| [09-personalization.md](09-personalization.md) | Avatars, dark mode, language (AR/EN + RTL), sounds, notifications, confetti, onboarding |
| [10-api-endpoints.md](10-api-endpoints.md) | Full list of REST endpoints the frontend calls |
| [11-data-models.md](11-data-models.md) | All TypeScript interfaces / data shapes |

## Quick summary of the system

A pure **frontend Angular application** that talks to a REST API (Express/Mongo, not part of this repo) using bearer-token authentication. It covers:

- **Auth**: email + password login, JWT-style token stored in `localStorage`, protected routes.
- **Learning**: module-organized YouTube video lessons with watch/complete tracking, resume-from-saved-position, per-lesson notes, and per-lesson quizzes.
- **Assessment**: quizzes with limited attempts and best-score tracking, instant scored results with explanations, plus an unlimited "practice" mode that re-drills only the questions a student missed.
- **Grades**: exams, homework, and quiz attempts displayed as tables with percentages, grade severity color-coding, per-category averages, and point buckets.
- **Payments**: current month dues banner with Paid/Late/Unpaid status and a full payment history table.
- **Gamification**: current streaks, longest streak, weekly goals, levels, emoji badges, a top-3/top-5 leaderboard, and a GitHub-style activity heatmap.
- **Personalization**: emoji avatar, dark/light theme (with system preference), Arabic/English full localization with RTL, sound effects, browser notifications, and clickable confetti.

## Local development (from the root README)

```bash
npm install
ng serve            # dev server on http://localhost:4200
ng build            # production build -> dist/
ng test             # unit tests (Vitest)
```

The app expects the backend API at `http://localhost:4000` in development (see `src/environments/environment.ts`).