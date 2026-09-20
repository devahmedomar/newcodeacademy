# 02 — Pages & Routes

Route table from `app.routes.ts`:

| Path | Component | Auth required | Notes |
| --- | --- | --- | --- |
| `/` | `Landing` | No | Public marketing/landing page with top-5 leaderboard |
| `/login` | `Login` | No | Student sign-in |
| `/dashboard` | `Dashboard` | Yes (authGuard) | Home / overview |
| `/lessons` | `Lessons` | Yes | Video lessons, roadmap, quizzes, notes |
| `/grades` | `Grades` | Yes | Exams, homework, quizzes, points, averages |
| `/payments` | `Payments` | Yes | Current dues + payment history |
| `/profile` | `ProfilePage` | Yes | Avatar, level, badges, streak, heatmap, settings |
| `**` (wildcard) | — | — | Redirects to `/` |

**History in git** shows the app grew feature-by-feature: quiz/grading, change-password, dark mode, profile page with stats/badges/settings, bottom-nav and badge cards, responsive player, and finally a destroyed-flag fix for the player setup.

---

## Landing page (`pages/landing`)

Public entry point (`/`).

Behaviour:
- If an authenticated student lands here, they are **redirected immediately to `/dashboard`**.
- Otherwise it renders a marketing page:
  - **Hero**: badge ("Secondary School · Programming"), headline, subtitle, single CTA → "Student sign in" → `/login`.
  - **Leaderboard section** ("Top 5 this term"): calls `GET /api/leaderboard?limit=5`, shows rank (medal styling for top 3), name, a percentage progress bar, earned points, and percent. Handles loading / error / empty states.
  - **Features section**: 3 cards — Video lessons, Quizzes & exams, Points & leaderboard.
  - **Footer**: brand + `© {year} New Code Academy`.
- Language toggle and dark-mode toggle are in the top-right.

---

## Login page (`pages/login`)

`/login` — the only unauthenticated functional page.

Behaviour:
- Split layout: left brand panel (tagline, features list), right sign-in card.
- Email + password (with show/hide toggle) floating labels.
- On submit:
  1. Calls `auth.login(email, password)` → `POST /auth/login`.
  2. If `user.role === 'student'` → navigate to `/dashboard`.
  3. If the account is a teacher → shows error `login.teacherOnly` ("Teachers should use the Teacher Dashboard.").
  4. Any failure shows the backend error message.
- Language + theme toggles also available in the corner (pre-login).
- On success, token is stored in `localStorage` as `nca_token` and user object as `nca_user`.

---

## Dashboard (`pages/dashboard`)

`/dashboard` — the student home. Loads in parallel:
- `getMyProfile()` → `GET /api/students/me`
- `getActivity()` → `GET /api/me/activity` (optional, failures ignored)
- `getBadges()` → `GET /api/me/badges` (optional)
- `getAnnouncements()` → `GET /api/announcements` (optional, defaults [])

Then it also loads the **top-3 leaderboard** (`GET /api/leaderboard?limit=3`).

Sections rendered (top to bottom):
1. **Header**: "Welcome back, {first name} 👋" + "My profile" button.
2. **New-badge banner**: green success message listing newly earned badge names (detected via `BadgeCelebrationService`).
3. **Onboarding checklist** (see §09): steps like pick avatar, turn on sounds, allow notifications, watch first lesson, take first quiz. Tracked with `nca_onboarding_done` flag and a "Skip for now" link.
4. **Announcements**: latest 2 announcements with pinned bookmark indicator.
5. **Payment banner**: appears when the current month is unpaid/late — shows status tag + amount due + link to `/payments`.
6. **Stat cards**:
   - Overall course progress %.
   - Streak (days) + weekly progress `{a} of {b} lessons` with a progress bar ({b} from weekly goal, default 5).
   - Number of modules.
7. **Course progress card**: overall progress bar + "{a} of {b} lessons completed".
8. **Next lesson card**: first unwatched lesson (title + module) with "Watch now" → `/lessons`. Falls back to the first lesson.
9. **Tip of the day**: one of 6 rotating study tips based on the day index (`floor(Date.now()/86400000) % 6`).
10. **Top 3 students**: rank, name, earned points.
11. **Recent grades table**: last ≤6 rows mixing Exams and Homework, each with title, type tag (Exam/Homework), score `x / max`, and colored percent (green ≥85, amber ≥70, red <70). "View all" → `/grades`.

---

## Lessons page (`pages/lessons`)

`/lessons` — the main learning page. Detailed in `03-learning-lessons.md`.

---

## Grades page (`pages/lessons` `pages/grades`)

`/grades` — academic record. Detailed in `05-grades-and-points.md`.

---

## Payments page (`pages/payments`)

`/payments` — tuition. Detailed in `07-payments.md`.

---

## Profile page (`pages/profile`)

`/profile` — the student's own profile + settings. Detailed in `06-gamification.md` and `09-personalization.md`.