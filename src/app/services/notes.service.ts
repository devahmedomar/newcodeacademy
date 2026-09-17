import { Injectable, signal } from '@angular/core';
import { Note } from '../models';

const KEY = 'nca_notes';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private load(): Record<string, Note> {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, Note>;
    } catch {
      return {};
    }
  }

  private save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.notes()));
    } catch {
      /* ignore */
    }
  }

  readonly notes = signal<Record<string, Note>>(this.load());

  get(lessonId: string): Note | null {
    return this.notes()[lessonId] ?? null;
  }

  saveNote(lessonId: string, text: string) {
    const trimmed = text.trim();
    const next = { ...this.notes() };
    if (!trimmed) {
      delete next[lessonId];
    } else {
      next[lessonId] = { lessonId, text: trimmed, updatedAt: new Date().toISOString() };
    }
    this.notes.set(next);
    this.save();
  }

  count() {
    return Object.keys(this.notes()).length;
  }
}