import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../services/portal.service';
import { Profile } from '../../models';

@Component({
  selector: 'app-grades',
  imports: [DatePipe],
  styleUrl: './grades.css',
  templateUrl: './grades.html',
})
export class Grades {
  private portal = inject(PortalService);

  profile = signal<Profile | null>(null);
  loading = signal(true);
  error = signal('');

  async ngOnInit() {
    try {
      this.profile.set(await this.portal.getMyProfile());
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load grades');
    } finally {
      this.loading.set(false);
    }
  }

  percent(grade: number, max: number) {
    return max > 0 ? Math.round((grade / max) * 100) : 0;
  }

  averageExam() {
    const exams = this.profile()?.exams ?? [];
    if (exams.length === 0) return null;
    const total = exams.reduce((acc, e) => acc + this.percent(e.grade, e.maxGrade), 0);
    return Math.round(total / exams.length);
  }

  averageHw() {
    const hw = this.profile()?.homeworks ?? [];
    if (hw.length === 0) return null;
    const total = hw.reduce((acc, h) => acc + this.percent(h.points, h.maxPoints), 0);
    return Math.round(total / hw.length);
  }

  gradeColor(p: number) {
    if (p >= 85) return 'var(--success)';
    if (p >= 70) return 'var(--warning)';
    return 'var(--danger)';
  }
}