import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../services/portal.service';
import { ProgressService } from '../../services/progress.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { Lesson } from '../../models';

@Component({
  selector: 'app-lessons',
  imports: [DatePipe, SafeUrlPipe],
  styleUrl: './lessons.css',
  templateUrl: './lessons.html',
})
export class Lessons {
  private portal = inject(PortalService);
  progress = inject(ProgressService);

  lessons = signal<Lesson[]>([]);
  active = signal<Lesson | null>(null);
  loading = signal(true);
  error = signal('');

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
    this.active.set(l);
    this.progress.toggle(l._id);
    this.active.set({ ...l });
  }
}