export class RingBuffer<T> {
  private buffer: T[];
  private head: number = 0;
  private tail: number = 0;
  private _size: number = 0;

  constructor(capacity: number) {
    this.buffer = new Array(capacity);
  }

  get size(): number {
    return this._size;
  }

  get capacity(): number {
    return this.buffer.length;
  }

  push(value: T): void {
    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    if (this._size === this.capacity) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this._size++;
    }
  }

  pop(): T | undefined {
    if (this._size === 0) return undefined;
    const value = this.buffer[this.head];
    this.head = (this.head + 1) % this.capacity;
    this._size--;
    return value;
  }

  clear(): void {
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let idx = this.head;
    for (let i = 0; i < this._size; i++) {
      result.push(this.buffer[idx]);
      idx = (idx + 1) % this.capacity;
    }
    return result;
  }
}
