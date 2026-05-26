export class Clock {
  private lastTime: number = 0;
  private delta: number = 0;
  private running: boolean = false;

  start(): void {
    this.lastTime = performance.now();
    this.running = true;
  }

  tick(): number {
    if (!this.running) return 0;
    const now = performance.now();
    this.delta = now - this.lastTime;
    this.lastTime = now;
    return this.delta;
  }

  getDelta(): number {
    return this.delta;
  }

  stop(): void {
    this.running = false;
  }
}
