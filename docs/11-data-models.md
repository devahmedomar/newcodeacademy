# 11 — Data Models

All interfaces from `src/app/models.ts`, plus the `User` type from `auth.service.ts`.

## Lesson

```ts
interface Lesson {
  _id: string;
  title: string;
  description?: string;
  youtubeVideoId: string;   // YouTube video ID only — embeds via youtube-nocookie.com
  order: number;            // ordering within a module
  module: string;           // module/unit name
  published: boolean;
  uploadDate: string;
  hasQuiz?: boolean;        // true when a quiz is attached
}
```

## Exams & homework

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
```

## Payments

```ts
type PaymentStatus = 'paid' | 'unpaid' | 'late';

interface Payment {
  _id: string;
  studentId: string;
  month: string;      // "September", …
  amount: number;     // EGP
  status: PaymentStatus;
  paidOn?: string;
  markedBy: string;   // teacher who confirmed the payment
}
```

## Quizzes

```ts
interface QuizQuestion {
  question: string;
  options: string[];        // choices
  explanation?: string;     // shown after grading
}

interface QuizForStudent {
  _id: string;
  lessonId: string;
  attemptsLeft: number;     // server-owned count of graded attempts
  bestScore: number;
  bestPercent: number;
  questions: QuizQuestion[]; // answers withheld until submit
}

interface QuizQuestionResult {
  question: string;
  options: string[];
  chosen: number;           // index the student chose
  correctIndex: number;     // revealed after submission
  explanation?: string;
}

interface QuizAttemptResult {
  _id: string;
  quizId: string;
  score: number;
  total: number;
  percent: number;
  attemptsLeft: number;
  bestScore: number;
  bestPercent: number;
  results: QuizQuestionResult[];
}

interface PracticeResult {
  quizId: string;
  score: number;
  total: number;
  percent: number;
  practice: true;           // marker — not a graded attempt
  results: Array<QuizQuestionResult & { correct: boolean }>;
}

interface QuizAttemptSummary {
  _id: string;
  quizId: string;
  lessonId: string;
  lessonTitle: string;
  module: string;
  score: number;
  total: number;
  percent: number;
  createdAt: string;
}
```

## Leaderboard & points

```ts
interface LeaderboardEntry {
  _id: string;
  name: string;
  earned: number;
  possible: number;
  percent: number;
}

interface PointsBucket { earned: number; possible: number; }

interface PointsSummary {
  total:    PointsBucket & { percent: number };
  quizzes:  PointsBucket;
  homeworks: PointsBucket;
  exams:    PointsBucket;
}
```

## Profile (the big aggregate)

```ts
interface Profile {
  user: {
    id: string;
    name: string;
    email: string;
    enrollmentDate: string;
    avatar?: string;          // emoji
    notifications?: boolean;  // notification preference
  };
  exams: Exam[];
  homeworks: Homework[];
  payments: Payment[];
  lessons: Lesson[];
  quizAttempts: QuizAttemptSummary[];      // every attempt (grades page)
  quizBestAttempts: QuizAttemptSummary[];  // best per quiz (averages/points)
  points: PointsSummary;
  currentMonth: string;
  currentPayment: Payment | null;
}
```

## Engagement / gamification

```ts
interface WatchDay { date: string; count: number; }   // 'YYYY-MM-DD'

interface WatchActivity {
  streak: number;           // current consecutive-day streak
  longestStreak: number;
  weekProgress: number;     // lessons this week
  weeklyGoal: number;       // target (client default 5)
  todayWatched: boolean;
  watchedLessons: string[]; // server-confirmed watched ids
  days: WatchDay[];         // heatmap source
}

interface LevelInfo {
  level: number;
  pointsIntoLevel: number;
  pointsForNext: number;
  progressPercent: number;
}

interface BadgeText { en: string; ar: string; }

interface Badge {
  id: string;
  icon: string;         // emoji
  title: BadgeText;
  description: BadgeText;
  earned: boolean;
}

interface BadgesResult {
  level: LevelInfo;
  earned: Badge[];
  locked: Badge[];
}
```

## Announcements

```ts
interface Announcement {
  _id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}
```

## Notes (client-side)

```ts
interface Note {
  lessonId: string;
  text: string;
  updatedAt: string;
}
// Stored as Record<lessonId, Note> in localStorage 'nca_notes'
```

## Auth user

```ts
interface User {        // auth.service.ts
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}
```