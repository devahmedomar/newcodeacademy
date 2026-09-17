import { Injectable } from '@angular/core';
import { Badge, BadgesResult } from '../models';
import { ConfettiService } from './confetti.service';

const KEY = 'nca_seen_badges';

@Injectable({ providedIn: 'root' })
export class BadgeCelebrationService {
  constructor(private confetti: ConfettiService) {}

  private seen(): Set<string> {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  private store(ids: string[]) {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }

  markSeen(badges: Badge[]) {
    this.store(badges.map((b) => b.id));
  }

  newBadges(badges: BadgesResult): Badge[] {
    const seen = this.seen();
    const fresh = badges.earned.filter((b) => !seen.has(b.id));
    this.markSeen(badges.earned);
    if (fresh.length > 0) this.confetti.burst(220);
    return fresh;
  }
}