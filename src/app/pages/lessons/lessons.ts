import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { Message } from 'primeng/message';
import { PortalService } from '../../services/portal.service';
import { ProgressService } from '../../services/progress.service';
import { I18nService } from '../../services/i18n.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { Lesson, QuizForStudent, QuizAttemptResult } from '../../models';

@Component({
  selector: 'app-lessons',
  imports: [DatePipe, Card, Tag, Button, ProgressBar, Message, SafeUrlPipe],
  styleUrl: './lessons.css',
  templateUrl: './lessons.html',
})
export class Lessons {
  private portal = inject(PortalService);
  progress = inject(ProgressService);
  i18n = inject(I18nService);

  lessons = signal<Lesson[]>([]);
  active = signal<Lesson | null>(null);
  loading = signal(true);
  error = signal('');

  quizMode = signal(false);
  quiz = signal<QuizForStudent | null>(null);
  quizLoading = signal(false);
  quizError = signal('');
  selectedAnswers = signal<(number | null)[]>([]);
  submitting = signal(false);
  result = signal<QuizAttemptResult | null>(null);

  locked = signal(false);
  attemptsLeft = signal(2);
  bestScore = signal(0);
  bestPercent = signal(0);

  readonly embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

  async ngOnInit() {
    try {
      const profile = await this.portal.getMyProfile();
      this.lessons.set(profile.lessons);
      const first = profile.lessons[0];
      if (first) this.active.set(first);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load lessons');
    } finally {
      this.loading.set(false);
    }
  }

  modules() {
    const m = new Set(this.lessons().map((l) => l.module));
    return [...m];
  }

  byModule(module: string) {
    return this.lessons()
      .filter((l) => l.module === module)
      .sort((a, b) => a.order - b.order);
  }

  moduleProgress(module: string) {
    const list = this.byModule(module);
    return {
      count: this.progress.watchedCount(list),
      total: list.length,
      percent: this.progress.progressPercent(list),
    };
  }

  open(l: Lesson) {
    if (this.active()?._id === l._id) return;
    this.active.set(l);
    this.quiz.set(null);
    this.quizError.set('');
    this.quizMode.set(false);
    this.selectedAnswers.set([]);
    this.result.set(null);
    this.locked.set(false);
  }

  toggleWatched(l: Lesson) {
    this.progress.toggle(l._id);
    this.active.set({ ...l });
  }

  arrowIcon() {
    return this.i18n.dir() === 'rtl' ? 'pi pi-arrow-left' : 'pi pi-arrow-right';
  }

  canRetake() {
    return this.attemptsLeft() > 0;
  }

  async openQuiz() {
    const lesson = this.active();
    if (!lesson) return;
    this.quizMode.set(true);
    this.quizError.set('');
    this.result.set(null);
    this.locked.set(false);
    this.quizLoading.set(true);
    try {
      const q = await this.portal.getLessonQuiz(lesson._id);
      this.quiz.set(q);
      this.attemptsLeft.set(q.attemptsLeft);
      this.bestScore.set(q.bestScore);
      this.bestPercent.set(q.bestPercent);
      this.selectedAnswers.set(q.questions.map(() => null));
      if (q.attemptsLeft <= 0) this.locked.set(true);
    } catch (e) {
      this.quizError.set(e instanceof Error ? e.message : 'Failed to load quiz');
      this.locked.set(false);
    } finally {
      this.quizLoading.set(false);
    }
  }

  closeQuiz() {
    this.quizMode.set(false);
    this.quiz.set(null);
    this.quizError.set('');
    this.selectedAnswers.set([]);
    this.result.set(null);
    this.locked.set(false);
  }

  selectAnswer(idx: number, value: number) {
    const cur = [...this.selectedAnswers()];
    cur[idx] = value;
    this.selectedAnswers.set(cur);
  }

  allAnswered() {
    return this.selectedAnswers().every((a) => a !== null);
  }

  async submit() {
    const q = this.quiz();
    if (!q) return;
    this.submitting.set(true);
    this.quizError.set('');
    try {
      const res = await this.portal.submitQuiz(q._id, this.selectedAnswers().map((a) => a as number));
      this.result.set(res);
      this.attemptsLeft.set(res.attemptsLeft);
      this.bestScore.set(res.bestScore);
      this.bestPercent.set(res.bestPercent);
    } catch (e) {
      this.quizError.set(e instanceof Error ? e.message : 'Failed to submit quiz');
    } finally {
      this.submitting.set(false);
    }
  }

  restartQuiz() {
    const q = this.quiz();
    if (!q || !this.canRetake()) return;
    this.result.set(null);
    this.selectedAnswers.set(q.questions.map(() => null));
  }
}