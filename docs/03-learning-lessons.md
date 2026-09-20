# 03 — Learning & Lessons

The **Lessons** page (`pages/lessons`) is the core learning experience. It loads the student's profile to get the list of `Lesson` objects and initializes the YouTube IFrame API.

## Data model (from `models.ts`)

```ts
interface Lesson {
  _id: string;
  title: string;
  description?: string;
  youtubeVideoId: string;   // YouTube video ID, NOT a full URL
  order: number;            // ordering inside a module
  module: string;           // module name (grouping)
  published: boolean;
  uploadDate: string;
  hasQuiz?: boolean;        // whether this lesson has an attached quiz
}
```

The list comes from `GET /api/students/me` (the profile payload includes `lessons`).

## Layout & behaviour

- **Roadmap** (shown only when there are 2+ modules): a horizontal track of module nodes. Each node shows:
  - A checkmark if the module is fully watched, otherwise its progress %.
  - Module name.
  - "You are here" marker on the current (first incomplete) module.
- **Player card** for the active lesson:
  - YouTube embed (`https://www.youtube-nocookie.com/embed/{id}`, privacy-enhanced mode) via `SafeUrlPipe`.
  - If the IFrame API is ready, the **YouTube IFrame player** is used instead with `rel: 0` and `start` at the saved resume position.
  - Module tag + lesson title, description (if any).
- **Actions per lesson**:
  - "Mark watched / Watched" toggle button.
  - "Test your knowledge" (quiz) button — only shown if `lesson.hasQuiz`.
  - "Notes" button — opens the per-lesson notes dialog.

## Marking lessons as watched

Managed by `ProgressService` (client cache) + `EngagementService` (server).

- Watched lesson IDs are cached in `localStorage` under `nca_watched` (JSON array).
- Clicking the check toggles the local set; if it was newly marked, `POST /api/me/watch { lessonId }` syncs to the server and refreshes the activity (streak etc.).
- If the server call **fails**, the optimistic toggle is rolled back locally.
- On `setActivity()`, the locally cached watched IDs are merged with the server's `watchedLessons`.

Module progress per module: `watchedCount / total`, rendered as a progress bar in each module card.

## Resume-watching (per-lesson position)

- Every active lesson stores its playback position in `localStorage` under `nca_resume_{lessonId}`.
- While playing, the current time is **polled every 5 seconds** and saved.
- On (re)load, the player starts at the saved position if `> 5s`.
- A "Resume from {m:ss}" chip appears; a "From the start" link resets the stored position and calls `player.seekTo(0)`.
- These keys persist across sessions and devices only locally (not synced).

## Per-lesson notes

Stored **entirely in `localStorage`** under `nca_notes` (a map of `lessonId -> { lessonId, text, updatedAt }`) via `NotesService`.

- Open from the lesson player card; dialog shows the lesson title, current note in a textarea, and a Save button.
- Empty/whitespace notes are deleted rather than saved.
- The Profile page shows the total count of notes (`notesCount()`).

## Lesson list (module cards)

Each module is a card:
- Title, "x / y watched" counter, module progress bar.
- A list of lessons sorted by `order`, each row:
  - Watch-complete checkbox (CSS class `done` when watched, with ARIA label "Toggle watched for {title}").
  - Order number, title, upload date (localized).
  - A quiz badge (`?` icon) if the lesson `hasQuiz`.
  - A green "playing" pill on the currently active lesson.

Empty state: "No lessons are available yet. Ask your teacher to publish them."

## Responsiveness

Recent git history shows responsiveness was specifically tuned: iframe and player dimensions adapt, bottom nav and badge cards render well on small screens, and the player is torn down correctly when the component is destroyed (`ngOnDestroy` → `teardownPlayer()`, and a `destroyed` flag guards the async YouTube init callback).