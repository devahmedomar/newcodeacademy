# 09 — Personalization & Engagement

The portal adapts to each student: avatar, theme, language (with full RTL), sounds, browser notifications, and celebration effects.

## Emoji avatar

- 12 emoji avatars: 🦊 🐼 🐯 🦁 🐸 🐵 🦄 🦉 🐺 🐨 🐹 🐢.
- Picking one calls `PATCH /api/me/settings { avatar }` and updates the in-memory profile optimistically.
- Shows "Avatar saved." briefly, and titleb of the picker is localized.
- The avatar is shown on the Profile page header and counted as "done" in the onboarding step "Pick your avatar".

## Dark / light theme (`ThemeService`)

- Choice stored as `nca_theme` (`dark`/`light`); when never chosen, defaults to `prefers-color-scheme` and **follows live system changes** (until the user picks manually).
- Toggle is available on the landing page, login page, and in the topbar.
- Applies `.dark-mode` class on `<body>` and sets `color-scheme`; PrimeNG is configured with `darkModeSelector: '.dark-mode'`, so all PrimeNG components theme automatically.
- Icon switches between sun ☀️ / moon 🌙.

## Language & RTL (`I18nService`)

- Two full dictionaries: **English** and **Arabic** (keys ~140 each), covering every string in the app.
- Toggle available on landing, login, and in the topbar. Stored in `nca_lang`.
- Sets `<html lang>` and `<html dir>` (`rtl` for Arabic); Angular `DatePipe` and `registerLocaleData('ar')` localize all dates.
- The `#t(key, params)` helper supports interpolation, e.g. `t('dash.welcome', { name })` → "Welcome back, {name} 👋".
- `i18n.payStatus(status)` maps `paid|unpaid|late` to localized labels.
- `i18n.dir()` is used for directional arrow icons (left/right) that flip in RTL.
- PrimeNG components render in the page's direction; the heatmap forces `ltr` because it is date-based.

## Sound effects (`SoundService`)

- Enabled by default; stored as `nca_sound` (`'0'` disables).
- WebAudio-generated beeps (no audio files):
  - `correct()` — two-note ascending chime, used on a correct quiz submission / drill.
  - `wrong()` — low triangle tone (defined, called by quiz logic paths).
  - `success()` — three-note fanfare for perfect scores.
- Toggle on the Profile settings card ("Sounds — light sound effects on achievements").

## Browser notifications (`NotificationsService`)

- Uses the standard `Notification` API (also gated client-side by permission).
- Enabling requires permission; stored server-side via `PATCH /api/me/settings { notifications: boolean }`.
- Profile settings card shows state: unsupported / default / granted / denied.

Two notification kinds (only fired when notifications are enabled AND permission granted):

1. **New announcement** (tag `nca-ann`):
   - Tracked with `nca_last_announcement_seen` timestamp.
   - On Dashboard load, if the newest announcement `createdAt` is newer than the last seen timestamp, a notification fires: "New announcement 🌟" — {title} — {body}. The seen timestamp is advanced.
   - Body link text is localized (`notif.annTitle`).
2. **Streak reminder** (tag `nca-streak`):
   - Tracked with `nca_streak_reminder_date` (fires max once per calendar day).
   - If the student has an active streak (`streak > 0`) but `todayWatched === false`, a reminder fires: "Keep your streak alive 🔥 — You haven't studied today yet — don't let your streak break!"

## Confetti (`ConfettiService`)

- Full-screen fixed `canvas` overlay, device-pixel-ratio aware.
- `burst(count)` launches colored rectangles/circles with gravity + rotation for ~110 frames.
- Triggered by `BadgeCelebrationService.newBadges()` (220 pieces) and when toggling notifications ON (`40` pieces).

## Announcements (Dashboard)

- `GET /api/announcements` → newest 2 shown in a "pin" list; pinned items get a bookmark icon.
- Also the source for the new-announcement notification above.

## Onboarding checklist

See §06 — a 5-step "Let's get started 🚀" checklist tracking avatar, sounds, notifications, first lesson, first quiz; dismissible via `nca_onboarding_done`.

## Settings API

`PATCH /api/me/settings` accepts `{ avatar?: string; notifications?: boolean }` and returns the updated `{ avatar, notifications }`.