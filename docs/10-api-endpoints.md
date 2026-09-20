# 10 — API Endpoints

All endpoints used by the frontend. Base URL from `environment.apiUrl` (dev: `http://localhost:4000`). Protected endpoints require `Authorization: Bearer {token}`.

## Authentication

| Method | Path | Body | Response | Used by |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | `{ email, password }` | `{ token, user: { id, name, email, role } }` | Login page |
| PUT | `/auth/password` | `{ currentPassword, newPassword }` | `{ message }` | Change-password dialog |

## Student data

| Method | Path | Body | Response | Used by |
| --- | --- | --- | --- | --- |
| GET | `/api/students/me` | — | `Profile` (user, exams, homeworks, payments, lessons, quizAttempts, quizBestAttempts, points, currentMonth, currentPayment) | Dashboard, Lessons, Grades, Payments, Profile page |

## Lessons & quizzes

| Method | Path | Body | Response | Used by |
| --- | --- | --- | --- | --- |
| GET | `/api/lessons/{lessonId}/quiz` | — | `QuizForStudent` (questions WITHOUT answers, attemptsLeft, best data) | Lessons |
| POST | `/api/quizzes/{quizId}/attempts` | `{ answers: number[] }` | `QuizAttemptResult` (score, percent, attemptsLeft, best, per-question results) | Quiz submit |
| POST | `/api/quizzes/{quizId}/practice` | `{ answers: number[] }` | `PracticeResult` (unlimited, not counted as an attempt, per-question `correct`) | Practice/drill mode |

## Engagement & gamification

| Method | Path | Body | Response | Used by |
| --- | --- | --- | --- | --- |
| GET | `/api/me/activity` | — | `WatchActivity` (streak, longestStreak, weekProgress, weeklyGoal, todayWatched, watchedLessons, days[]) | Dashboard, Lessons, Profile |
| POST | `/api/me/watch` | `{ lessonId }` | `WatchActivity` (updated) | Mark-watched sync |
| GET | `/api/me/badges` | — | `BadgesResult` (level + earned[] + locked[]) | Dashboard, Profile |
| PATCH | `/api/me/settings` | `{ avatar?, notifications? }` | `{ avatar, notifications }` | Avatar picker, notification toggle |
| GET | `/api/announcements` | — | `Announcement[]` | Dashboard |
| GET | `/api/leaderboard?limit={n}` | — | `LeaderboardEntry[]` | Landing (5), Dashboard (3) |

## Notes

Notes are stored **client-side only** (`localStorage`, key `nca_notes`) — no API calls.

## Client-side localStorage keys reference

| Key | Purpose |
| --- | --- |
| `nca_token` | Auth bearer token |
| `nca_user` | Logged-in user object |
| `nca_lang` | Language (`ar`/`en`) |
| `nca_theme` | Theme (`dark`/`light`) |
| `nca_sound` | Sound toggle (`'1'`/`'0'`) |
| `nca_watched` | Watched lesson IDs (JSON array) |
| `nca_resume_{lessonId}` | Per-lesson playback position (seconds) |
| `nca_notes` | Per-lesson notes map |
| `nca_onboarding_done` | Dismissed onboarding checklist |
| `nca_seen_badges` | Badge IDs already celebrated |
| `nca_last_announcement_seen` | Timestamp of newest seen announcement |
| `nca_streak_reminder_date` | Date of last streak-reminder notification |