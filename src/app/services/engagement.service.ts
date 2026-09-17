import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WatchActivity, BadgesResult, Announcement, PracticeResult, QuizQuestionResult } from '../models';

@Injectable({ providedIn: 'root' })
export class EngagementService {
  constructor(private api: ApiService) {}

  getActivity() {
    return this.api.get<WatchActivity>('/api/me/activity');
  }

  markWatched(lessonId: string) {
    return this.api.post<WatchActivity>('/api/me/watch', { lessonId });
  }

  getBadges() {
    return this.api.get<BadgesResult>('/api/me/badges');
  }

  updateSettings(settings: { avatar?: string; notifications?: boolean }) {
    return this.api.patch<{ avatar: string; notifications: boolean }>('/api/me/settings', settings);
  }

  getAnnouncements() {
    return this.api.get<Announcement[]>('/api/announcements');
  }

  practiceQuiz(quizId: string, answers: number[]) {
    return this.api.post<PracticeResult>(`/api/quizzes/${quizId}/practice`, { answers });
  }

  wrongAnswers(result: { results: QuizQuestionResult[] }): number[] {
    const wrong: number[] = [];
    result.results.forEach((r, i) => {
      if (r.chosen !== r.correctIndex) wrong.push(i);
    });
    return wrong;
  }
}