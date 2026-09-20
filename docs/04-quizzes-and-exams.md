# 04 — Quizzes, Attempts, Review & Practice Mode

Each lesson can have an attached quiz (`Lesson.hasQuiz`). The quiz UI lives inside the Lessons page player card.

## Data model

```ts
interface QuizQuestion {
  question: string;
  options: string[];        // answer choices
  explanation?: string;     // shown after answering
}

interface QuizForStudent {
  _id: string;
  lessonId: string;
  attemptsLeft: number;     // remaining graded attempts
  bestScore: number;
  bestPercent: number;
  questions: QuizQuestion[]; // the correct answers are NOT sent to the client
}

interface QuizQuestionResult {
  question: string;
  options: string[];
  chosen: number;           // index student picked
  correctIndex: number;     // revealed only after submit
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
  practice: true;                          // marker
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

## Taking a quiz

1. "Test your knowledge" → `openQuiz()`:
   - Tears down the video player, switches the player card into quiz panel mode.
   - Loads the quiz via `GET /api/lessons/{lessonId}/quiz`.
   - Reads `attemptsLeft`, `bestScore`, `bestPercent`; initializes all answers to `null`.
   - If `attemptsLeft <= 0` the quiz is **locked** ("You have used all 2 attempts").
2. The student answers each question (one choice per question; submit button enabled only when **all** questions are answered).
3. "Submit answers" → `POST /api/quizzes/{quizId}/attempts { answers: number[] }`.
4. Sound feedback: `success()` jingle on a perfect 100%, `correct()` chime otherwise.

## Results & review

After submission, the full result is shown:
- **Score card**: `Your score: {score} of {total} · {percent}%`, pass/fail split at **≥ 50%**.
- **Best-score banner**: if `bestScore !== score`, shows "Best score …" so the student sees their top mark.
- **Question-by-question review**: each question lists every option with:
  - Green `correct` mark on the right answer (`correctIndex`).
  - Red `wrong` mark on the picked-wrong answer, labelled "Wrong — correct answer: {a}".
  - An **Explanation** box when the question has one.
- Retry button (`Try again`) if `attemptsLeft > 0`; otherwise a "no attempts left" tag.
- "Back to lesson" returns to the video.

**Attempt rules**: quizzes have a limited number of attempts (the code banner mentions "all 2 attempts"; the server owns the source of truth via `attemptsLeft`). The **best score** is what the student keeps and what counts toward their quiz points.

## Practice / Drill mode (`engagement.practiceQuiz`)

Practice mode is deliberately **not** a graded attempt — it doesn't consume `attemptsLeft` and doesn't change the best score.

- After a graded attempt, if any questions were wrong, a **"Practice: missed questions"** button appears.
- `wrongAnswers()` computes indices where `chosen !== correctIndex`.
- `startDrill()` opens a sub-view with **only the missed questions** re-asking them ("Retry only the questions you missed.").
- Submitting runs `POST /api/quizzes/{quizId}/practice { answers }` with the full answer array (rights answers reused from the last attempt, wrong ones replaced by the new picks).
- Results return per-question `correct` flags; shows "You nailed the questions you missed! x / y".
- If any are still wrong, the student can loop the drill again (still unlimited, still not graded).
- If there were no wrong answers, it says "No missed questions — perfect score!".
- Sound: success jingle if all correct in the drill, otherwise the correct chime.

## Where quiz results show up

- Immediately in the quiz panel (above).
- The **Grades** page lists every attempt (`quizAttempts`) and uses **best attempts** (`quizBestAttempts`) for averages/points.
- The dashboard counts "Take your first quiz" as done when `profile.quizAttempts.length > 0`.