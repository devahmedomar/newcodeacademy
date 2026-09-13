import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortalService } from '../../services/portal.service';
import { ProgressService } from '../../services/progress.service';
import { Profile } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private portal = inject(PortalService);
  progress = inject(ProgressService);

  profile = signal<Profile | null>(null);
  loading = signal(true);
  error = signal('');

  async ngOnInit() {
    try {
      this.profile.set(await this.portal.getMyProfile());
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      this.loading.set(false);
    }
  }

  percent(grade: number, max: number) {
    return max > 0 ? Math.round((grade / max) * 100) : 0;
  }

  overallProgress() {
    const lessons = this.profile()?.lessons ?? [];
    return lessons.length ? this.progress.overallProgress(lessons) : 0;
  }

  nextLesson() {
    const lessons = this.profile()?.lessons ?? [];
    const next = lessons.find((l) => !this.progress.isWatched(l._id));
    return next ?? lessons[0] ?? null;
  }

  streak() {
    return this.progress.streakCount();
  }

  moduleCount() {
    return new Set((this.profile()?.lessons ?? []).map((l) => l.module)).size;
  }
}