export interface TextCursorState {
  x: number;
  y: number;
  visible: boolean;
  blinkPhase: boolean;
  blinkRate: number;
}

export class TextCursor {
  x: number = 0;
  y: number = 0;
  visible: boolean = true;
  blinkPhase: boolean = false;
  blinkRate: number = 530;

  private lastBlink: number = 0;

  constructor(
    public readonly columns: number,
    public readonly rows: number,
  ) {}

  moveTo(x: number, y: number): void {
    this.x = Math.max(0, Math.min(x, this.columns - 1));
    this.y = Math.max(0, Math.min(y, this.rows - 1));
  }

  advance(columns?: number): void {
    const cols = columns ?? this.columns;
    this.x++;
    if (this.x >= cols) {
      this.x = 0;
      this.y++;
      if (this.y >= this.rows) {
        this.y = this.rows - 1;
      }
    }
  }

  newline(): void {
    this.x = 0;
    this.y++;
    if (this.y >= this.rows) {
      this.y = this.rows - 1;
    }
  }

  backspace(): void {
    this.x--;
    if (this.x < 0) {
      this.x = this.columns - 1;
      this.y = Math.max(0, this.y - 1);
    }
  }

  tick(timestamp: number): void {
    if (timestamp - this.lastBlink >= this.blinkRate) {
      this.blinkPhase = !this.blinkPhase;
      this.lastBlink = timestamp;
    }
  }

  snapshot(): TextCursorState {
    return {
      x: this.x,
      y: this.y,
      visible: this.visible,
      blinkPhase: this.blinkPhase,
      blinkRate: this.blinkRate,
    };
  }

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.blinkPhase = false;
  }
}
