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
}

export interface QuizForStudent {
  _id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestionResult {
  question: string;
  options: string[];
  chosen: number;
  correctIndex: number;
}

export interface QuizAttemptResult {
  _id: string;
  quizId: string;
  score: number;
  total: number;
  percent: number;
  results: QuizQuestionResult[];
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

export interface Profile {
  user: {
    id: string;
    name: string;
    email: string;
    enrollmentDate: string;
  };
  exams: Exam[];
  homeworks: Homework[];
  payments: Payment[];
  lessons: Lesson[];
  quizAttempts: QuizAttemptSummary[];
  currentMonth: string;
  currentPayment: Payment | null;
}