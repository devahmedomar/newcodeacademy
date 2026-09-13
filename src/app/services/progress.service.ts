import { Injectable, signal } from '@angular/core';

const KEY = 'nca_watched';

@Injectable({ providedIn: 'root' })
export class ProgressService {
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

  streakCount(): number {
    const ids = [...this.watchedIds()];
    if (ids.length === 0) return 0;
    return ids.length <= 10 ? ids.length : 10;
  }

  reset() {
    localStorage.removeItem(KEY);
    this.watchedIds.set(new Set());
  }
}