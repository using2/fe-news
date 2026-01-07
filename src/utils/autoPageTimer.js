export class AutoPageTimer {
  constructor(duration = 20000, onComplete, onProgress) {
    this.duration = duration;
    this.onComplete = onComplete;
    this.onProgress = onProgress;

    this.startTime = null;
    this.animationId = null;
    this.isPaused = false;
    this.pausedTime = 0;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;

    this.animate();
  }

  animate = (timestamp) => {
    if (!this.isRunning || this.isPaused) {
      return;
    }

    if (!this.startTime) {
      this.startTime = timestamp;
    }

    const elapsed = timestamp - this.startTime - this.pausedTime;
    const progress = Math.min(elapsed / this.duration, 1);

    if (this.onProgress) {
      this.onProgress(progress);
    }

    if (progress >= 1) {
      this.stop();
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  pause() {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.pausedTime = 0;
    this.startTime = null;

    this.animationId = requestAnimationFrame(this.animate);
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.onProgress) {
      this.onProgress(0);
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  getState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
    };
  }

  destroy() {
    this.stop();
    this.onComplete = null;
    this.onProgress = null;
  }
}
