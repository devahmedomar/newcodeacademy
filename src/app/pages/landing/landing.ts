import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { AuthService } from '../../services/auth.service';
import { PortalService } from '../../services/portal.service';
import { I18nService } from '../../services/i18n.service';
import { ThemeService } from '../../services/theme.service';
import { LeaderboardEntry } from '../../models';

@Component({
  selector: 'app-landing',
  imports: [Button, Card],
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing implements OnInit {
  private auth = inject(AuthService);
  private portal = inject(PortalService);
  private router = inject(Router);
  i18n = inject(I18nService);
  theme = inject(ThemeService);

  ranking = signal<LeaderboardEntry[]>([]);
  loading = signal(true);
  error = signal(false);

  async ngOnInit() {
    if (this.auth.isStudent()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    try {
      this.ranking.set(await this.portal.getLeaderboard(5));
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  signIn() {
    this.router.navigate(['/login']);
  }

  podium(): (LeaderboardEntry | null)[] {
    const r = this.ranking();
    return [r[1] ?? null, r[0] ?? null, r[2] ?? null];
  }

  rest(): LeaderboardEntry[] {
    return this.ranking().slice(3);
  }

  place(s: LeaderboardEntry) {
    return this.ranking().indexOf(s) + 1;
  }

  initial(s: LeaderboardEntry) {
    return s.name.trim().charAt(0).toUpperCase() || '•';
  }

  currentYear() {
    return new Date().getFullYear();
  }

  t(key: string, params?: Record<string, string | number>) {
    return this.i18n.t(key, params);
  }
}