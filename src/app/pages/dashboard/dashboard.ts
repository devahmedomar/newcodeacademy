import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PortalService } from '../../services/portal.service';
import { ProgressService } from '../../services/progress.service';
import { I18nService } from '../../services/i18n.service';
import { Profile } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ProgressBar, Tag, Button, Card, TableModule],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private portal = inject(PortalService);
  progress = inject(ProgressService);
  i18n = inject(I18nService);

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

  recentGrades(p: Profile) {
    const rows: Array<{
      title: string;
      kind: string;
      grade: number;
      max: number;
      percent: number;
      color: string;
    }> = [];
    for (const e of p.exams) {
      const percent = this.percent(e.grade, e.maxGrade);
      rows.push({
        title: e.title,
        kind: 'Exam',
        grade: e.grade,
        max: e.maxGrade,
        percent,
        color: this.gradeColor(percent),
      });
    }
    for (const h of p.homeworks) {
      const percent = this.percent(h.points, h.maxPoints);
      rows.push({
        title: h.title,
        kind: 'Homework',
        grade: h.points,
        max: h.maxPoints,
        percent,
        color: this.gradeColor(percent),
      });
    }
    return rows.slice(0, 6);
  }

  gradeColor(p: number) {
    if (p >= 85) return 'var(--p-green-600)';
    if (p >= 70) return 'var(--p-amber-600)';
    return 'var(--p-red-500)';
  }

  arrowIcon() {
    return this.i18n.dir() === 'rtl' ? 'pi pi-arrow-left' : 'pi pi-arrow-right';
  }
}