import { Component, inject, signal, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { Message } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { PortalService } from '../../services/portal.service';
import { EngagementService } from '../../services/engagement.service';
import { ProgressService } from '../../services/progress.service';
import { NotesService } from '../../services/notes.service';
import { SoundService } from '../../services/sound.service';
import { I18nService } from '../../services/i18n.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import {
  Lesson,
  QuizForStudent,
  QuizAttemptResult,
  PracticeResult,
  QuizQuestionResult,
} from '../../models';

declare const YT: any;

const RESUME_PREFIX = 'nca_resume_';

@Component({
  selector: 'app-lessons',
  imports: [DatePipe, FormsModule, Card, Tag, Button, ProgressBar, Message, Dialog, Textarea, SafeUrlPipe],
  styleUrl: './lessons.css',
  templateUrl: './lessons.html',
})
export class Lessons implements OnDestroy {
  private portal = inject(PortalService);
  private engagement = inject(EngagementService);
  progress = inject(ProgressService);
  notes = inject(NotesService);
  private sound = inject(SoundService);
  i18n = inject(I18nService);

  lessons = signal<Lesson[]>([]);
  active = signal<Lesson | null>(null);
  loading = signal(true);
  error = signal('');

  quizMode = signal(false);
  quiz = signal<QuizForStudent | null>(null);
  quizLoading = signal(false);
  quizError = signal('');
  selectedAnswers = signal<(number | null)[]>([]);
  submitting = signal(false);
  result = signal<QuizAttemptResult | null>(null);

  locked = signal(false);
  attemptsLeft = signal(2);
  bestScore = signal(0);
  bestPercent = signal(0);

  drillMode = signal(false);
  drillIndices = signal<number[]>([]);
  drillAnswers = signal<(number | null)[]>([]);
  drillResult = signal<PracticeResult | null>(null);
  drillError = signal('');

  notesOpen = signal(false);
  noteText = signal('');
  noteMsg = signal('');

  ytState = signal<'loading' | 'ready' | 'failed'>('loading');
  resumeSeconds = signal(0);
  private player: any = null;
  private watchTimer: number | null = null;
  private polling = false;

  readonly embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

  async ngOnInit() {
    try {
      const [profile] = await Promise.all([this.portal.getMyProfile(), this.initYouTube()]);
      this.lessons.set(profile.lessons);
      const first = profile.lessons[0];
      if (first) this.setActive(first);
      this.engagement.getActivity().then((a) => this.progress.setActivity(a)).catch(() => undefined);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load lessons');
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy() {
    this.teardownPlayer();
  }

  private initYouTube() {
    return new Promise<void>((resolve) => {
      const w = window as any;
      if (w.YT && w.YT.Player) {
        this.ytState.set('ready');
        resolve();
        return;
      }
      if (!document.querySelector('#yt-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      w.onYouTubeIframeAPIReady = () => {
        if (w.YT && w.YT.Player) this.ytState.set('ready');
        else this.ytState.set('failed');
        this.setupPlayerSafe();
        resolve();
      };
      setTimeout(() => {
        if (this.ytState() === 'loading') {
          this.ytState.set(w.YT && w.YT.Player ? 'ready' : 'failed');
          this.setupPlayerSafe();
          resolve();
        }
      }, 7000);
    });
  }

  private setupPlayerSafe() {
    const current = this.active();
    if (current && !this.quizMode()) this.setupPlayer(current);
  }

  private setupPlayer(lesson: Lesson) {
    this.teardownPlayer();
    if (this.ytState() !== 'ready' || this.quizMode()) return;
    const w = window as any;
    if (!w.YT || !w.YT.Player) return;
    const resume = this.resumeFor(lesson._id);
    this.resumeSeconds.set(resume);
    this.player = new w.YT.Player('yt-player', {
      videoId: lesson.youtubeVideoId,
      width: '100%',
      height: '100%',
      playerVars: { rel: 0, start: resume > 5 ? resume : 0 },
      events: {
        onStateChange: (e: any) => this.onPlayerState(e, lesson._id),
      },
    });
    this.startWatcher(lesson._id);
  }

  private onPlayerState(e: any, lessonId: string) {
    if (e.data === 1) {
      this.polling = true;
      this.syncResume(lessonId);
    } else if (e.data === 2 || e.data === 0) {
      this.syncResume(lessonId);
      this.polling = false;
    }
  }

  private syncResume(lessonId: string) {
    if (!this.player || !this.player.getCurrentTime) return;
    const t = Math.floor(this.player.getCurrentTime());
    try {
      localStorage.setItem(RESUME_PREFIX + lessonId, String(t));
    } catch {
      /* ignore */
    }
    this.resumeSeconds.set(t);
  }

  private startWatcher(lessonId: string) {
    this.stopWatcher();
    this.watchTimer = window.setInterval(() => {
      if (this.polling) this.syncResume(lessonId);
    }, 5000);
  }

  private stopWatcher() {
    if (this.watchTimer !== null) {
      clearInterval(this.watchTimer);
      this.watchTimer = null;
    }
  }

  private teardownPlayer() {
    this.stopWatcher();
    this.polling = false;
    if (this.player && this.player.destroy) {
      try {
        this.player.destroy();
      } catch {
        /* ignore */
      }
    }
    this.player = null;
  }

  private resumeFor(lessonId: string): number {
    try {
      return Number(localStorage.getItem(RESUME_PREFIX + lessonId)) || 0;
    } catch {
      return 0;
    }
  }

  resumeText() {
    const s = this.resumeSeconds();
    if (s <= 5) return '';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  clearResume() {
    const current = this.active();
    if (!current) return;
    try {
      localStorage.removeItem(RESUME_PREFIX + current._id);
    } catch {
      /* ignore */
    }
    this.resumeSeconds.set(0);
    if (this.player && this.player.seekTo) this.player.seekTo(0, true);
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

  setActive(l: Lesson) {
    this.active.set(l);
    this.quiz.set(null);
    this.quizError.set('');
    this.quizMode.set(false);
    this.selectedAnswers.set([]);
    this.result.set(null);
    this.locked.set(false);
    this.drillMode.set(false);
    this.drillIndices.set([]);
    this.drillAnswers.set([]);
    this.drillResult.set(null);
    this.drillError.set('');
    this.notesOpen.set(false);
    this.resumeSeconds.set(this.resumeFor(l._id));
    this.setupPlayer(l);
  }

  open(l: Lesson) {
    if (this.active()?._id === l._id) return;
    this.setActive(l);
  }

  toggleWatched(l: Lesson) {
    const wasWatched = this.progress.isWatched(l._id);
    this.progress.toggle(l._id);
    if (!wasWatched) this.progress.markWatchedServer(l._id);
    this.active.set({ ...l });
  }

  arrowIcon() {
    return this.i18n.dir() === 'rtl' ? 'pi pi-arrow-left' : 'pi pi-arrow-right';
  }

  roadmap() {
    const mods = this.modules();
    let markedCurrent = false;
    return mods.map((name) => {
      const mp = this.moduleProgress(name);
      const done = mp.total > 0 && mp.count === mp.total;
      const current = !done && !markedCurrent;
      if (current) markedCurrent = true;
      return { name, done, current, pct: mp.percent };
    });
  }

  canRetake() {
    return this.attemptsLeft() > 0;
  }

  async openQuiz() {
    const lesson = this.active();
    if (!lesson) return;
    this.teardownPlayer();
    this.quizMode.set(true);
    this.quizError.set('');
    this.result.set(null);
    this.locked.set(false);
    this.drillMode.set(false);
    this.drillResult.set(null);
    this.quizLoading.set(true);
    try {
      const q = await this.portal.getLessonQuiz(lesson._id);
      this.quiz.set(q);
      this.attemptsLeft.set(q.attemptsLeft);
      this.bestScore.set(q.bestScore);
      this.bestPercent.set(q.bestPercent);
      this.selectedAnswers.set(q.questions.map(() => null));
      if (q.attemptsLeft <= 0) this.locked.set(true);
    } catch (e) {
      this.quizError.set(e instanceof Error ? e.message : 'Failed to load quiz');
      this.locked.set(false);
    } finally {
      this.quizLoading.set(false);
    }
  }

  closeQuiz() {
    this.quizMode.set(false);
    this.quiz.set(null);
    this.quizError.set('');
    this.selectedAnswers.set([]);
    this.result.set(null);
    this.locked.set(false);
    this.drillMode.set(false);
    this.drillIndices.set([]);
    this.drillAnswers.set([]);
    this.drillResult.set(null);
    this.setupPlayerSafe();
  }

  selectAnswer(idx: number, value: number) {
    const cur = [...this.selectedAnswers()];
    cur[idx] = value;
    this.selectedAnswers.set(cur);
  }

  allAnswered() {
    return this.selectedAnswers().every((a) => a !== null);
  }

  async submit() {
    const q = this.quiz();
    if (!q) return;
    this.submitting.set(true);
    this.quizError.set('');
    try {
      const res = await this.portal.submitQuiz(q._id, this.selectedAnswers().map((a) => a as number));
      this.result.set(res);
      this.attemptsLeft.set(res.attemptsLeft);
      this.bestScore.set(res.bestScore);
      this.bestPercent.set(res.bestPercent);
      if (res.percent === 100) this.sound.success();
      else this.sound.correct();
    } catch (e) {
      this.quizError.set(e instanceof Error ? e.message : 'Failed to submit quiz');
    } finally {
      this.submitting.set(false);
    }
  }

  restartQuiz() {
    const q = this.quiz();
    if (!q || !this.canRetake()) return;
    this.result.set(null);
    this.selectedAnswers.set(q.questions.map(() => null));
  }

  // ---------- Missed-question drill ----------

  wrongIndices(): number[] {
    const r = this.result();
    return r ? this.engagement.wrongAnswers(r) : [];
  }

  canDrill() {
    return (this.result()?.attemptsLeft ?? 0) >= 0 && this.wrongIndices().length > 0;
  }

  startDrill() {
    const q = this.quiz();
    const r = this.result();
    if (!q || !r) return;
    const wrong = this.engagement.wrongAnswers(r);
    if (wrong.length === 0) {
      this.drillError.set(this.i18n.t('quiz.practiceRemaining'));
      return;
    }
    this.drillMode.set(true);
    this.drillIndices.set(wrong);
    this.drillAnswers.set(wrong.map(() => null));
    this.drillResult.set(null);
    this.drillError.set('');
  }

  drillQuestions(): QuizForStudent {
    const q = this.quiz();
    if (!q) return { _id: '', lessonId: '', attemptsLeft: 0, bestScore: 0, bestPercent: 0, questions: [] };
    const shown = this.drillIndices().map((i) => q.questions[i]);
    return { ...q, questions: shown };
  }

  selectDrillAnswer(idx: number, value: number) {
    const cur = [...this.drillAnswers()];
    cur[idx] = value;
    this.drillAnswers.set(cur);
  }

  allDrillAnswered() {
    return this.drillAnswers().every((a) => a !== null);
  }

  async submitDrill() {
    const q = this.quiz();
    const r = this.result();
    if (!q || !r) return;
    this.submitting.set(true);
    this.drillError.set('');
    try {
      const full: number[] = [];
      for (let i = 0; i < q.questions.length; i++) {
        const idxInDrill = this.drillIndices().indexOf(i);
        if (idxInDrill >= 0) {
          const ans = this.drillAnswers()[idxInDrill];
          full.push(ans === null ? r.results[i].chosen : ans);
        } else {
          full.push(r.results[i].chosen);
        }
      }
      const res = await this.engagement.practiceQuiz(q._id, full);
      this.drillResult.set(res);
      const shown = res.results.filter((_, i) => this.drillIndices().includes(i));
      if (shown.every((x) => x.correct)) this.sound.success();
      else this.sound.correct();
    } catch (e) {
      this.drillError.set(e instanceof Error ? e.message : 'Failed to run practice');
    } finally {
      this.submitting.set(false);
    }
  }

  exitDrill() {
    this.drillMode.set(false);
    this.drillResult.set(null);
    this.drillAnswers.set([]);
    this.drillError.set('');
  }

  drillCorrectCount(): number {
    const r = this.drillResult();
    if (!r) return 0;
    const idx = this.drillIndices();
    const shown = r.results.filter((_, i) => idx.includes(i));
    return shown.filter((x) => x.correct).length;
  }

  drillShownResults(): Array<QuizQuestionResult & { correct: boolean }> {
    const r = this.drillResult();
    if (!r) return [];
    return r.results.filter((_, i) => this.drillIndices().includes(i));
  }

  // ---------- Notes ----------

  openNotes() {
    const current = this.active();
    if (!current) return;
    this.noteText.set(this.notes.get(current._id)?.text ?? '');
    this.noteMsg.set('');
    this.notesOpen.set(true);
  }

  saveNote() {
    const current = this.active();
    if (!current) return;
    this.notes.saveNote(current._id, this.noteText());
    this.noteMsg.set(this.i18n.t('notes.saved'));
  }
}