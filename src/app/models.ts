export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  youtubeVideoId: string;
  order: number;
  module: string;
  published: boolean;
  uploadDate: string;
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
  currentMonth: string;
  currentPayment: Payment | null;
}