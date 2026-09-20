# 05 — Grades, Points & Averages

The **Grades** page (`pages/grades`) reads the profile (`GET /api/students/me`) and renders the student's full academic record.

## Data model

```ts
interface Exam {
  _id: string;
  studentId: string;
  subject: string;
  lessonRef?: string;
  title: string;
  grade: number;
  maxGrade: number;
  date: string;
}

interface Homework {
  _id: string;
  studentId: string;
  title: string;
  points: number;
  maxPoints: number;
  submittedAt?: string;
  feedback?: string;
}

interface PointsBucket { earned: number; possible: number; }

interface PointsSummary {
  total:  PointsBucket & { percent: number };
  quizzes: PointsBucket;
  homeworks: PointsBucket;
  exams: PointsBucket;
}
```

## Page sections

### 1. Points summary (4 cards)
| Card | Value |
| --- | --- |
| Total points | `earned / possible pts` + overall percent (colored) |
| Exam points | `exams.earned / exams.possible` |
| Homework points | `homeworks.earned / homeworks.possible` |
| Quiz points | `quizzes.earned / quizzes.possible` |

The total percent drives the green/amber/red color:
- `>= 85` → green (`--nca-ok`)
- `>= 70` → amber (`--nca-warn`)
- otherwise → red (`--nca-bad`)

### 2. Averages (3 cards)
- **Exams average**: mean of per-exam percentages (`grade/maxGrade`).
- **Homework average**: mean of per-homework percentages (`points/maxPoints`).
- **Quiz average**: mean of the **best** quiz-attempt percentages (`quizBestAttempts`).

All averages use the same green/amber/red colouring and render `—` when a category is empty.

### 3. Exams table
Columns: Title | Subject | Score (`grade / maxGrade`) | % (severity tag) | Date (localized).

### 4. Homework table
Columns: Title | Points (`points / maxPoints`) | % (severity tag) | Feedback (or `—`).

### 5. Quiz attempts table
Columns: Lesson | Module | Score (`score / total`) | % (severity tag) | Date (`createdAt`, localized).

Each row's percentage tag uses severity: `success` (≥85), `warn` (70–84), `danger` (<70).

## Grade colour rule (shared everywhere)

```ts
gradeColor(p)   // p >= 85 → var(--nca-ok)
                // p >= 70 → var(--nca-warn)
                // else    → var(--nca-bad)
gradeSeverity(p)// success | warn | danger   (same thresholds)
```

## Where points come from

Per the landing-page copy, points are earned from **exams, quizzes, and homework**. The server computes the `PointsSummary`. The **best** quiz attempt is what counts (`quizBestAttempts`), while the attempts history table lists every attempt made.

## Related views

- Dashboard "Recent grades" is a merged, ≤6-row preview of exams + homework with the same color coding.
- The dashboard's "overall progress %" is separate: it is the fraction of *watched lessons* out of total lessons (from `ProgressService`), not the points percent.