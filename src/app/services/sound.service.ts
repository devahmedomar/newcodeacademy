import { Injectable, signal } from '@angular/core';

const KEY = 'nca_sound';

@Injectable({ providedIn: 'root' })
export class SoundService {
  readonly enabled = signal<boolean>(this.load());

  toggle() {
    this.enabled.set(!this.enabled());
    try {
      localStorage.setItem(KEY, String(this.enabled()));
    } catch {
      /* ignore */
    }
  }

  private load(): boolean {
    try {
      return localStorage.getItem(KEY) !== '0';
    } catch {
      return true;
    }
  }

  private beep(freq: number, start: number, duration: number, type: OscillatorType) {
    if (!this.enabled()) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.05);
    } catch {
      /* ignore */
    }
  }

  correct() {
    this.beep(523, 0, 0.12, 'sine');
    this.beep(659, 0.1, 0.16, 'sine');
  }

  wrong() {
    this.beep(196, 0, 0.2, 'triangle');
  }

  success() {
    this.beep(523, 0, 0.12, 'sine');
    this.beep(659, 0.1, 0.12, 'sine');
    this.beep(784, 0.2, 0.2, 'sine');
  }
}