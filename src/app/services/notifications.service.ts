import { Injectable } from '@angular/core';

const LAST_ANNOUNCEMENT_KEY = 'nca_last_announcement_seen';
const REMINDER_DATE_KEY = 'nca_streak_reminder_date';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return Promise.resolve<'unsupported' | NotificationPermission>('unsupported');
    }
    if (Notification.permission !== 'default') return Promise.resolve(Notification.permission);
    return Notification.requestPermission();
  }

  private enabled(pref?: boolean) {
    return (
      !!pref &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    );
  }

  dispatch(title: string, body: string, tag = 'nca') {
    if (!this.enabled(true) || !title) return;
    try {
      const n = new Notification(title, { body, tag, icon: 'assets/icons/icon-512.png' });
      n.onclick = () => {
        n.close();
        window.focus();
      };
    } catch {
      /* ignore */
    }
  }

  notifyNewAnnouncements(
    pref?: boolean,
    announcements: Array<{ createdAt: string }> = [],
    onAnnounce?: (a: any) => { title: string; body: string },
  ) {
    if (!this.enabled(pref) || announcements.length === 0) return;
    const newest = announcements.reduce((max, a) => {
      const t = new Date(a.createdAt).getTime();
      return Number.isFinite(t) && t > max ? t : max;
    }, 0);
    if (!newest) return;
    const lastSeen = Number(localStorage.getItem(LAST_ANNOUNCEMENT_KEY) ?? 0);
    if (newest <= lastSeen) return;
    localStorage.setItem(LAST_ANNOUNCEMENT_KEY, String(newest));
    const top = [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const t = onAnnounce ? onAnnounce(top) : { title: '', body: '' };
    this.dispatch(t.title, t.body, 'nca-ann');
  }

  notifyStreakReminder(pref: boolean | undefined, todayWatched: boolean, streak: number, title: string, body: string) {
    if (!this.enabled(pref) || todayWatched || streak <= 0) return;
    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    if (localStorage.getItem(REMINDER_DATE_KEY) === key) return;
    localStorage.setItem(REMINDER_DATE_KEY, key);
    this.dispatch(title, body, 'nca-streak');
  }
}