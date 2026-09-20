# 01 — Overview & Architecture

## What is this project?

The **Student Portal** is a single-page application (SPA) built with Angular for the **New Code Academy** — a secondary-school programming academy. It is the **student-facing** side of the system; teachers use a separate Teacher Dashboard (mentioned in the login flow but not part of this repo).

Everything a student does on a daily basis is here:

- Watch the day's video lesson
- Take the quiz attached to a lesson
- See their grades from exams and homework
- See if their monthly tuition is paid
- Track streaks, level, badges, and class ranking

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Angular (v22, standalone components, signals) |
| UI component library | PrimeNG 22 + PrimeIcons |
| Theme system | PrimeNG Aura preset (`@primeuix/themes`) with a custom primary color (indigo) |
| Styling | Custom SCSS/CSS + PrimeNG utility classes + PrimeFlex-like spacing classes |
| HTTP | Native `fetch` wrapped in `ApiService` |
| State | Angular **signals** (`signal`, `computed`) + `localStorage` for persistent client state |
| Localization | Hand-rolled `I18nService` (English + Arabic, RTL support) |
| Build/deploy | Angular CLI, npm, Vercel (`vercel.json`) |
| Backend API | External REST API (Express + MongoDB) — **not in this repo** |

## Folder architecture

```
src/
├── environments/           # environment.ts (apiUrl, license key)
└── app/
    ├── app.ts/html/css     # Root shell: topbar, bottom-nav, change-password dialog
    ├── app.routes.ts       # Route table + auth guard wiring
    ├── app.config.ts       # PrimeNG preset + providers
    ├── models.ts           # All data interfaces (shared)
    ├── guards/
    │   └── auth.guard.ts   # Protects authenticated pages
    ├── pipes/
    │   └── safe-url.pipe.ts# Sanitized <iframe> URLs (YouTube embed)
    ├── pages/              # 7 feature pages (landing, login, dashboard, lessons, grades, payments, profile)
    └── services/           # 12 injectable services (API, auth, i18n, theme, progress, etc.)
```

## Services overview

| Service | File | Responsibility |
| --- | --- | --- |
| `ApiService` | `services/api.service.ts` | HTTP client: `get/post/put/patch`, attaches `Bearer` token, clears session on 401 |
| `AuthService` | `services/auth.service.ts` | Login, logout, change password, `user` signal, `isStudent` computed |
| `PortalService` | `services/portal.service.ts` | Core student data: profile, lesson quiz, submit quiz, leaderboard |
| `EngagementService` | `services/engagement.service.ts` | Activity/streak, mark-watched, badges, settings patch, announcements, quiz practice |
| `ProgressService` | `services/progress.service.ts` | Watch-state (local cache + server sync), streaks, weekly goal, progress math |
| `NotesService` | `services/notes.service.ts` | Per-lesson notes stored in `localStorage` |
| `NotificationsService` | `services/notifications.service.ts` | Browser Notification API: new announcements + streak reminders |
| `SoundService` | `services/sound.service.ts` | WebAudio beeps for correct/wrong/success |
| `ConfettiService` | `services/confetti.service.ts` | Canvas-confetti burst on achievements |
| `BadgeCelebrationService` | `services/badge-celebration.service.ts` | Detects newly earned badges, triggers confetti |
| `ThemeService` | `services/theme.service.ts` | Dark/light mode (stored + system preference listener) |
| `I18nService` | `services/i18n.service.ts` | EN/AR dictionaries, `dir` (rtl/ltr), `t()` translation |

## Application shell (`app.ts` / `app.html`)

- **Topbar** (desktop): brand + nav (Home, Lessons, Grades, Payments, Profile), then a user row with:
  - Language toggle (EN / العربية)
  - Dark-mode toggle
  - Change-password button (opens a modal dialog)
  - Logout button
- **Bottom nav** (mobile/small screens): same 5 links.
- **Change-password dialog**: modal with current + new password fields, client validation (`newPassword.length >= 6`), calls `PUT /auth/password`.
- The topbar/bottom-nav only render for authenticated **students** (`@if (auth.isStudent())`).

## Route guard

`authGuard` checks `auth.token` exists **and** `auth.isStudent()`. If not, it redirects to `/login`.

## Styling notes

- `src/styles.css` defines CSS variables including semantic grade colors used across pages:
  - `--nca-ok` (>= 85%), `--nca-warn` (70–84%), `--nca-bad` (< 70%).
- Dark mode toggles a `.dark-mode` class on `<body>`; PrimeNG is configured with `darkModeSelector: '.dark-mode'`.

## Config

- `app.config.ts` defines a PrimeNG **Aura** preset with indigo primary colors and dark-mode selector.
- `environment.ts` holds `apiUrl` (dev: `http://localhost:4000`) and the PrimeUI license key.