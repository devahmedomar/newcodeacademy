import { Injectable, signal } from '@angular/core';
import { WatchActivity } from '../models';
import { EngagementService } from './engagement.service';

const KEY = 'nca_watched';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private engagement: EngagementService) {}

  private load(): Set<string> {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  private save(ids: Set<string>) {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  }

  readonly watchedIds = signal<Set<string>>(this.load());

  readonly streak = signal(0);
  readonly longestStreak = signal(0);
  readonly weekProgress = signal(0);
  readonly weeklyGoal = signal(5);
  readonly activityLoaded = signal(false);

  setActivity(a: WatchActivity) {
    const local = new Set(this.watchedIds());
    for (const id of a.watchedLessons) local.add(id);
    this.save(local);
    this.watchedIds.set(local);
    this.streak.set(a.streak);
    this.longestStreak.set(a.longestStreak);
    this.weekProgress.set(a.weekProgress);
    this.weeklyGoal.set(a.weeklyGoal);
    this.activityLoaded.set(true);
  }

  isWatched(id: string) {
    return this.watchedIds().has(id);
  }

  toggle(id: string) {
    const next = new Set(this.watchedIds());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.save(next);
    this.watchedIds.set(next);
  }

  markWatchedServer(id: string) {
    return this.engagement.markWatched(id).then((a) => {
      this.setActivity(a);
      return a;
    }).catch(() => {
      const next = new Set(this.watchedIds());
      next.delete(id);
      this.save(next);
      this.watchedIds.set(next);
    });
  }

  watchedCount(moduleLessons: Array<{ _id: string }>) {
    return moduleLessons.filter((l) => this.watchedIds().has(l._id)).length;
  }

  progressPercent(moduleLessons: Array<{ _id: string }>) {
    if (moduleLessons.length === 0) return 0;
    return Math.round((this.watchedCount(moduleLessons) / moduleLessons.length) * 100);
  }

  overallProgress(lessons: Array<{ _id: string }>) {
    if (lessons.length === 0) return 0;
    return Math.round((this.watchedIds().size / lessons.length) * 100);
  }

  reset() {
    localStorage.removeItem(KEY);
    this.watchedIds.set(new Set());
    this.streak.set(0);
    this.longestStreak.set(0);
    this.weekProgress.set(0);
  }
}