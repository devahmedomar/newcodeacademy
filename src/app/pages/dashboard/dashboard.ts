import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { PortalService } from '../../services/portal.service';
import { EngagementService } from '../../services/engagement.service';
import { ProgressService } from '../../services/progress.service';
import { BadgeCelebrationService } from '../../services/badge-celebration.service';
import { NotificationsService } from '../../services/notifications.service';
import { SoundService } from '../../services/sound.service';
import { I18nService } from '../../services/i18n.service';
import { Profile, LeaderboardEntry, Announcement, WatchActivity } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ProgressBar, Tag, Button, Card, Message, TableModule],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private portal = inject(PortalService);
  private engagement = inject(EngagementService);
  progress = inject(ProgressService);
  private celebration = inject(BadgeCelebrationService);
  private notifier = inject(NotificationsService);
  sound = inject(SoundService);
  i18n = inject(I18nService);

  profile = signal<Profile | null>(null);
  loading = signal(true);
  error = signal('');

  leaderboard = signal<LeaderboardEntry[]>([]);
  lbLoading = signal(true);
  lbError = signal(false);

  announcements = signal<Announcement[]>([]);
  annLoading = signal(true);
  newBadges = signal<string[]>([]);

  async ngOnInit() {
    try {
      const [profile, activity, badges, announcements] = await Promise.all([
        this.portal.getMyProfile(),
        this.engagement.getActivity().catch(() => null),
        this.engagement.getBadges().catch(() => null),
        this.engagement.getAnnouncements().catch(() => []),
      ]);
      this.profile.set(profile);
      if (activity) this.progress.setActivity(activity);
      if (badges) {
        this.newBadges.set(this.celebration.newBadges(badges).map((b) => b.title.en));
      }
      this.announcements.set(announcements);
      this.notifyAfterLoad(profile, activity, announcements);
      this.loadLeaderboard();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      this.loading.set(false);
    }
  }

  private notifyAfterLoad(profile: Profile, activity: WatchActivity | null, announcements: Announcement[]) {
    const pref = profile.user.notifications;
    this.notifier.notifyNewAnnouncements(pref, announcements, (a: Announcement) => ({
      title: this.i18n.t('notif.annTitle'),
      body: `${a.title} — ${a.body}`,
    }));
    this.notifier.notifyStreakReminder(
      pref,
      activity?.todayWatched ?? false,
      activity?.streak ?? 0,
      this.i18n.t('notif.streakTitle'),
      this.i18n.t('notif.streakBody'),
    );
  }

  async loadLeaderboard() {
    try {
      this.leaderboard.set(await this.portal.getLeaderboard(3));
    } catch {
      this.lbError.set(true);
    } finally {
      this.lbLoading.set(false);
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
    return this.progress.streak();
  }

  weekGoal() {
    return this.progress.weeklyGoal();
  }

  weekProgress() {
    return this.progress.weekProgress();
  }

  weekPercent() {
    const g = this.weekGoal();
    return g > 0 ? Math.min(100, Math.round((this.weekProgress() / g) * 100)) : 0;
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
    if (p >= 85) return 'var(--nca-ok)';
    if (p >= 70) return 'var(--nca-warn)';
    return 'var(--nca-bad)';
  }

  arrowIcon() {
    return this.i18n.dir() === 'rtl' ? 'pi pi-arrow-left' : 'pi pi-arrow-right';
  }

  tipOfDay() {
    const day = Math.floor(Date.now() / 86400000);
    return this.i18n.t(`tips.t${day % 6}`);
  }

  onboarding(): Array<{ key: string; label: string; icon: string; done: boolean; route: string }> {
    const p = this.profile();
    if (!p) return [];
    const lang = this.i18n.lang();
    const label = (en: string, ar: string) => (lang === 'ar' ? ar : en);
    return [
      {
        key: 'avatar',
        label: label('Pick your avatar', 'اختر صورتك الرمزية'),
        icon: 'pi pi-user',
        done: !!p.user.avatar,
        route: '/profile',
      },
      {
        key: 'sound',
        label: label('Turn on sounds', 'فعّل الأصوات'),
        icon: 'pi pi-volume-up',
        done: this.sound.enabled(),
        route: '/profile',
      },
      {
        key: 'notif',
        label: label('Allow notifications', 'اسمح بالإشعارات'),
        icon: 'pi pi-bell',
        done: !!p.user.notifications,
        route: '/profile',
      },
      {
        key: 'video',
        label: label('Watch your first lesson', 'شاهد أول درس'),
        icon: 'pi pi-play-circle',
        done: this.progress.watchedIds().size > 0,
        route: '/lessons',
      },
      {
        key: 'quiz',
        label: label('Take your first quiz', 'خُض أول اختبار'),
        icon: 'pi pi-question-circle',
        done: p.quizAttempts.length > 0,
        route: '/lessons',
      },
    ];
  }

  onboardingVisible() {
    const all = this.onboarding();
    return !localStorage.getItem('nca_onboarding_done') && all.length > 0 && all.some((i) => !i.done);
  }

  onboardingDoneCount() {
    return this.onboarding().filter((i) => i.done).length;
  }

  dismissOnboarding() {
    localStorage.setItem('nca_onboarding_done', '1');
  }
}