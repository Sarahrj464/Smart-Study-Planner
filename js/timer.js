// Simple Pomodoro Timer module (js/timer.js)

class PomodoroTimer {
  constructor(options = {}) {
    this.work = (options.work || 25) * 60; // seconds
    this.short = (options.short || 5) * 60;
    this.long = (options.long || 15) * 60;
    this.mode = 'work';
    this.remaining = this.work;
    this.interval = null;
    this.onTick = options.onTick || function () {};
    this.onModeChange = options.onModeChange || function () {};
    this.onFinish = options.onFinish || function () {};
    this.sessionId = null;
  }

  setDurations({ work, short, long }) {
    this.work = work * 60;
    this.short = short * 60;
    this.long = long * 60;
    if (this.mode === 'work') this.remaining = this.work;
    this.onModeChange(this.mode);
  }

  async start(subject = 'General') {
    if (typeof DB !== 'undefined' && typeof DB.startStudySession === 'function') {
      try {
        const id = await DB.startStudySession(subject, Math.round(this.remaining / 60));
        this.sessionId = id;
      } catch (err) {
        console.warn('DB session start failed', err);
      }
    }

    if (this.interval) return;
    this.interval = setInterval(() => this.tick(), 1000);
    this.onModeChange(this.mode);
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  stop() {
    if (this.sessionId && typeof DB !== 'undefined' && typeof DB.endStudySession === 'function') {
      DB.endStudySession(this.sessionId).catch(err => console.warn('DB end session failed', err));
      this.sessionId = null;
    }

    this.pause();
    this.resetModeToWork();
    this.onTick(this.remaining);
  }

  tick() {
    if (this.remaining <= 0) {
      this.finishPeriod();
      return;
    }
    this.remaining -= 1;
    this.onTick(this.remaining);
  }

  finishPeriod() {
    this.onFinish(this.mode);

    if (this.mode === 'work') {
      if (this.sessionId && typeof DB !== 'undefined' && typeof DB.endStudySession === 'function') {
        DB.endStudySession(this.sessionId).catch(err => console.warn('DB end session failed', err));
        this.sessionId = null;
      }
      this.mode = 'short';
      this.remaining = this.short;
    } else if (this.mode === 'short') {
      this.mode = 'work';
      this.remaining = this.work;
    } else {
      this.mode = 'work';
      this.remaining = this.work;
    }

    this.onModeChange(this.mode);
  }

  resetModeToWork() {
    this.mode = 'work';
    this.remaining = this.work;
  }

  formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }
}

if (typeof window !== 'undefined') window.PomodoroTimer = PomodoroTimer;