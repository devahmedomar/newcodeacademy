export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  youtubeVideoId: string;
  order: number;
  module: string;
  published: boolean;
  uploadDate: string;
  hasQuiz?: boolean;
}

export interface Exam {
  _id: string;
  studentId: string;
  subject: string;
  lessonRef?: string;
  title: string;
  grade: number;
  maxGrade: number;
  date: string;
}

export interface Homework {
  _id: string;
  studentId: string;
  title: string;
  points: number;
  maxPoints: number;
  submittedAt?: string;
  feedback?: string;
}

export type PaymentStatus = 'paid' | 'unpaid' | 'late';

export interface Payment {
  _id: string;
  studentId: string;
  month: string;
  amount: number;
  status: PaymentStatus;
  paidOn?: string;
  markedBy: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  explanation?: string;
}

export interface QuizForStudent {
  _id: string;
  lessonId: string;
  attemptsLeft: number;
  bestScore: number;
  bestPercent: number;
  questions: QuizQuestion[];
}

export interface QuizQuestionResult {
  question: string;
  options: string[];
  chosen: number;
  correctIndex: number;
  explanation?: string;
}

export interface QuizAttemptResult {
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

export interface PracticeResult {
  quizId: string;
  score: number;
  total: number;
  percent: number;
  practice: true;
  results: Array<QuizQuestionResult & { correct: boolean }>;
}

export interface QuizAttemptSummary {
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

export interface LeaderboardEntry {
  _id: string;
  name: string;
  earned: number;
  possible: number;
  percent: number;
}

export interface PointsBucket {
  earned: number;
  possible: number;
}

export interface PointsSummary {
  total: PointsBucket & { percent: number };
  quizzes: PointsBucket;
  homeworks: PointsBucket;
  exams: PointsBucket;
}

export interface Profile {
  user: {
    id: string;
    name: string;
    email: string;
    enrollmentDate: string;
    avatar?: string;
    notifications?: boolean;
  };
  exams: Exam[];
  homeworks: Homework[];
  payments: Payment[];
  lessons: Lesson[];
  quizAttempts: QuizAttemptSummary[];
  quizBestAttempts: QuizAttemptSummary[];
  points: PointsSummary;
  currentMonth: string;
  currentPayment: Payment | null;
}

export interface WatchDay {
  date: string;
  count: number;
}

export interface WatchActivity {
  streak: number;
  longestStreak: number;
  weekProgress: number;
  weeklyGoal: number;
  todayWatched: boolean;
  watchedLessons: string[];
  days: WatchDay[];
}

export interface LevelInfo {
  level: number;
  pointsIntoLevel: number;
  pointsForNext: number;
  progressPercent: number;
}

export interface BadgeText {
  en: string;
  ar: string;
}

export interface Badge {
  id: string;
  icon: string;
  title: BadgeText;
  description: BadgeText;
  earned: boolean;
}

export interface BadgesResult {
  level: LevelInfo;
  earned: Badge[];
  locked: Badge[];
}

export interface Announcement {
  _id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

export interface Note {
  lessonId: string;
  text: string;
  updatedAt: string;
}