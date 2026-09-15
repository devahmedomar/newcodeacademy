import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Profile, QuizForStudent, QuizAttemptResult, LeaderboardEntry } from '../models';

@Injectable({ providedIn: 'root' })
export class PortalService {
  constructor(private api: ApiService) {}

  getMyProfile() {
    return this.api.get<Profile>('/api/students/me');
  }

  getLessonQuiz(lessonId: string) {
    return this.api.get<QuizForStudent>(`/api/lessons/${lessonId}/quiz`);
  }

  submitQuiz(quizId: string, answers: number[]) {
    return this.api.post<QuizAttemptResult>(`/api/quizzes/${quizId}/attempts`, { answers });
  }

  getLeaderboard(limit = 5) {
    return this.api.get<LeaderboardEntry[]>(`/api/leaderboard?limit=${limit}`);
  }
}