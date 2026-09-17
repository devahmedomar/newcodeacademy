import { Injectable } from '@angular/core';

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  shape: 'rect' | 'circle';
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899'];

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private canvas: HTMLCanvasElement | null = null;

  burst(count = 160) {
    if (!this.canvas) this.setup();
    const c = this.canvas;
    if (!c) return;

    const ctx = c.getContext('2d');
    if (!ctx) return;

    const pieces: Piece[] = [];
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: c.width / 2,
        y: c.height / 3,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: -(Math.random() * 12 + 4),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }

    let frames = 0;
    const last = performance.now();
    const gravity = 0.22;
    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3);
      frames += dt;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of pieces) {
        p.vy += gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, Math.min(p.w, p.h) / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (frames < 110) {
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, c.width, c.height);
        this.teardown();
      }
    };
    requestAnimationFrame(step);
  }

  private setup() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    const ctx = this.canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    document.body.appendChild(this.canvas);
  }

  private teardown() {
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
  }
}