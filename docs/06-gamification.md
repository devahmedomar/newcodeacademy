# 06 — Gamification

Engagement is a core theme of the portal: streaks, weekly goals, levels, badges, a leaderboard, and an activity heatmap.

## Streaks & weekly goal

From `GET /api/me/activity`:

```ts
interface WatchActivity {
  streak: number;          // current consecutive study days
  longestStreak: number;
  weekProgress: number;    // lessons watched this week
  weeklyGoal: number;      // target lessons this week (default 5 client-side)
  todayWatched: boolean;
  watchedLessons: string[]; // lessons marked watched on the server
  days: WatchDay[];         // { date: 'YYYY-MM-DD', count } for the heatmap
}
```

- Watch activity is **refreshed whenever a lesson is marked watched** and whenever Dashboard/Profile/Lessons pages load.
- Dashboard stat card shows the current streak with a fire emoji 🔥, plus "x of y lessons this week" and a progress bar capped at 100%.
- Profile card also shows current streak, longest streak, and a "today ✓" marker when `todayWatched`.
- When a student has a streak but **hasn't studied today**, a browser notification reminder fires (max once per day, see §09).
- Weekly goal default is **5** lessons/week on the client.

## Levels (`GET /api/me/badges`)

```ts
interface LevelInfo {
  level: number;
  pointsIntoLevel: number;   // points already earned into the current level
  pointsForNext: number;     // points needed to reach the next level
  progressPercent: number;
}
```

- Profile renders a **level ring**: a `conic-gradient` circle whose sweep equals `progressPercent`, with the level number in the centre.
- Below the ring: "Points: {pointsIntoLevel}" + "Points to next level: {pointsForNext}" and a progress bar.

## Badges

```ts
interface BadgeText { en: string; ar: string; }
interface Badge {
  id: string;
  icon: string;          // emoji
  title: BadgeText;
  description: BadgeText; // localized
  earned: boolean;
}
interface BadgesResult {
  level: LevelInfo;
  earned: Badge[];
  locked: Badge[];
}
```

- Profile "Badges" card: earned badges in a grid (highlighted with a `newly` style if just earned), then a divider, then **locked** badges shown greyed with a lock icon.
- Newly earned badges trigger:
  - A green "🎉 New badge!" banner on Profile and Dashboard.
  - **Confetti** (via `BadgeCelebrationService.newBadges()` which fires a 220-piece burst).
- Seen badges are tracked in `localStorage` (`nca_seen_badges`) so confetti/banners only appear for genuinely new badges.

## Leaderboard

- Public landing page: **Top 5 this term** (`GET /api/leaderboard?limit=5`).
- Dashboard: **Top 3 students** (`GET /api/leaderboard?limit=3`) with rank styling for 1st/2nd/3rd.
- Ranked by `earned` points; each entry shows name, earned points, and percent.

```ts
interface LeaderboardEntry {
  _id: string;
  name: string;
  earned: number;
  possible: number;
  percent: number;
}
```

## Activity heatmap (Profile)

A GitHub-style 21-week contribution heatmap rendered client-side.

- Cells for the last `21 * 7 = 147` days, week rows in LTR regardless of UI language.
- Each day's level from `days[]` counts: `0` = no watch, `1` ≤ 2 lessons, `2` ≤ 4 lessons, `3` > 4 lessons (darker = more).
- Tooltip shows the date; rendered from `ProfilePage.heatmapCells()`.

## Onboarding checklist (Dashboard)

A "Let's get started 🚀" checklist that nudges new students through 5 quick wins (each maps to a route):
1. **Pick your avatar** → `/profile` (done when `user.avatar` set)
2. **Turn on sounds** → `/profile` (done when `SoundService.enabled()`)
3. **Allow notifications** → `/profile` (done when `user.notifications`)
4. **Watch your first lesson** → `/lessons` (done when any lesson watched)
5. **Take your first quiz** → `/lessons` (done when `quizAttempts.length > 0`)

- Shows `completedCount / total`, check icons on done items.
- Hidden permanently once the user clicks "Skip for now" (`nca_onboarding_done` in `localStorage`).
- Does not reappear once every item is done.

## Tip of the day (Dashboard)

Six rotating study tips (`tips.t0` … `tips.t5`) chosen by `floor(Date.now() / 86400000) % 6`, localized per language.