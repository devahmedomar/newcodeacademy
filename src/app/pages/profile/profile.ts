import { Component, inject, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { PortalService } from '../../services/portal.service';
import { EngagementService } from '../../services/engagement.service';
import { ProgressService } from '../../services/progress.service';
import { NotesService } from '../../services/notes.service';
import { BadgeCelebrationService } from '../../services/badge-celebration.service';
import { ConfettiService } from '../../services/confetti.service';
import { SoundService } from '../../services/sound.service';
import { I18nService } from '../../services/i18n.service';
import { Profile, WatchActivity, BadgesResult, Badge, LevelInfo } from '../../models';

const AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐵', '🦄', '🦉', '🐺', '🐨', '🐹', '🐢'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function iso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

@Component({
  selector: 'app-profile',
  imports: [Card, ProgressBar, Button, Message],
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class ProfilePage {
  private portal = inject(PortalService);
  private engagement = inject(EngagementService);
  progress = inject(ProgressService);
  notes = inject(NotesService);
  celebration = inject(BadgeCelebrationService);
  private confetti = inject(ConfettiService);
  sound = inject(SoundService);
  i18n = inject(I18nService);

  profile = signal<Profile | null>(null);
  activity = signal<WatchActivity | null>(null);
  badges = signal<BadgesResult | null>(null);
  loading = signal(true);
  error = signal('');

  newBadges = signal<Badge[]>([]);
  avatarMsg = signal('');

  soundWanted = signal(true);
  notifEnabled = signal(false);
  notifPerm = signal<'unsupported' | 'default' | 'granted' | 'denied'>('default');

  async ngOnInit() {
    this.soundWanted.set(this.sound.enabled());
    try {
      const [profile, activity, badges] = await Promise.all([
        this.portal.getMyProfile(),
        this.engagement.getActivity().catch(() => null),
        this.engagement.getBadges(),
      ]);
      this.profile.set(profile);
      if (activity) {
        this.activity.set(activity);
        this.progress.setActivity(activity);
      }
      this.badges.set(badges);
      this.notifInit(profile.user.notifications);
      this.newBadges.set(this.celebration.newBadges(badges));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load profile');
    } finally {
      this.loading.set(false);
    }
  }

  notifInit(pref?: boolean) {
    if (!('Notification' in window)) {
      this.notifPerm.set('unsupported');
      return;
    }
    this.notifPerm.set(Notification.permission);
    this.notifEnabled.set(Notification.permission === 'granted' && !!pref);
  }

  level(): LevelInfo | null {
    return this.badges()?.level ?? null;
  }

  avatar(): string {
    return this.profile()?.user.avatar || AVATARS[0];
  }

  earned(): Badge[] {
    return this.badges()?.earned ?? [];
  }

  locked(): Badge[] {
    return this.badges()?.locked ?? [];
  }

  title(b: Badge) {
    const t = b.title;
    return this.i18n.lang() === 'ar' ? t.ar : t.en;
  }

  desc(b: Badge) {
    const d = b.description;
    return this.i18n.lang() === 'ar' ? d.ar : d.en;
  }

  async pickAvatar(emoji: string) {
    if (this.avatar() === emoji) return;
    try {
      await this.engagement.updateSettings({ avatar: emoji });
      const p = this.profile();
      if (p) this.profile.set({ ...p, user: { ...p.user, avatar: emoji } });
      this.avatarMsg.set(this.i18n.t('profile.avatarSaved'));
      setTimeout(() => this.avatarMsg.set(''), 2500);
    } catch {
      /* ignore */
    }
  }

  weeklyGoal() {
    return this.activity()?.weeklyGoal ?? this.progress.weeklyGoal();
  }

  weekProgress() {
    return this.activity()?.weekProgress ?? this.progress.weekProgress();
  }

  weeklyPercent(a: WatchActivity) {
    return a.weeklyGoal > 0 ? Math.min(100, Math.round((a.weekProgress / a.weeklyGoal) * 100)) : 0;
  }

  readonly avatars = AVATARS;

  heatmapCells() {
    const counts = new Map<string, number>();
    for (const d of this.activity()?.days ?? []) counts.set(d.date, d.count);
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const start = new Date(today);
    start.setDate(today.getDate() - diff - 20 * 7);
    const cells: Array<{ date: string; level: number }> = [];
    for (let i = 0; i < 21 * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = iso(d);
      const c = counts.get(key) ?? 0;
      cells.push({ date: key, level: c === 0 ? 0 : c <= 2 ? 1 : c <= 4 ? 2 : 3 });
    }
    return cells;
  }

  notesCount() {
    return Object.keys(this.notes.notes()).length;
  }

  toggleSound() {
    this.sound.toggle();
    this.soundWanted.set(this.sound.enabled());
  }

  async toggleNotifications() {
    if (this.notifPerm() === 'unsupported') return;
    if (this.notifPerm() === 'default') {
      const p = await Notification.requestPermission();
      this.notifPerm.set(p);
      if (p !== 'granted') return;
    }
    const next = !this.notifEnabled();
    this.notifEnabled.set(next);
    this.confetti.burst(next ? 40 : 0);
    await this.engagement.updateSettings({ notifications: next }).catch(() => undefined);
  }

  levelRingStyle() {
    const lvl = this.level() ?? { progressPercent: 0 };
    const deg = (lvl.progressPercent / 100) * 360;
    return { background: `conic-gradient(var(--p-primary-color) ${deg}deg, var(--p-surface-200) ${deg}deg)` };
  }

  ringDotStyle() {
    const lvl = this.level() ?? { progressPercent: 0 };
    const deg = (lvl.progressPercent / 100) * 360;
    return { transform: `rotate(${deg}deg)` };
  }
}