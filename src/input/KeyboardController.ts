export interface KeyEventMessage {
  type: 'key-down' | 'key-up';
  code: string;
  repeat: boolean;
}

export class KeyboardController {
  private keysDown: Set<string> = new Set();
  private handlers: Array<(msg: KeyEventMessage) => void> = [];

  constructor(target: EventTarget = document) {
    target.addEventListener('keydown', this.handleKeyDown);
    target.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: Event): void => {
    const event = e as KeyboardEvent;
    if (event.repeat) return;
    this.keysDown.add(event.code);
    const msg: KeyEventMessage = { type: 'key-down', code: event.code, repeat: false };
    this.handlers.forEach(h => h(msg));
  };

  private handleKeyUp = (e: Event): void => {
    const event = e as KeyboardEvent;
    this.keysDown.delete(event.code);
    const msg: KeyEventMessage = { type: 'key-up', code: event.code, repeat: false };
    this.handlers.forEach(h => h(msg));
  };

  onKeyEvent(handler: (msg: KeyEventMessage) => void): void {
    this.handlers.push(handler);
  }

  isDown(code: string): boolean {
    return this.keysDown.has(code);
  }

  dispose(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.handlers = [];
  }
}
