import { Injectable, signal } from '@angular/core';

const KEY = 'nca_theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<Theme>(this.initial());

  private storedChoice: Theme | null;

  constructor() {
    this.storedChoice = this.stored();
    if (this.storedChoice === null) {
      this.listenToSystem();
    }
    this.apply();
  }

  private initial(): Theme {
    const saved = this.stored();
    if (saved === 'dark' || saved === 'light') return saved;
    try {
      return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  private stored(): Theme | null {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }

  private listenToSystem() {
    try {
      const mql = window.matchMedia(DARK_QUERY);
      const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (this.storedChoice !== null) return;
        this.isDark.set(e.matches ? 'dark' : 'light');
        this.apply();
      };
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange as EventListener);
      } else {
        mql.addListener(onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
      }
    } catch {
      /* ignore */
    }
  }

  private apply() {
    const dark = this.isDark() === 'dark';
    document.body.classList.toggle('dark-mode', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }

  toggle() {
    this.storedChoice = this.isDark() === 'dark' ? 'light' : 'dark';
    this.isDark.set(this.storedChoice);
    try {
      localStorage.setItem(KEY, this.storedChoice);
    } catch {
      /* ignore */
    }
    this.apply();
  }
}