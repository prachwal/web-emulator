export class TextScreen {
  public readonly chars: Uint8Array;

  constructor(
    public readonly columns: number,
    public readonly rows: number,
  ) {
    this.chars = new Uint8Array(columns * rows);
    this.clear();
  }

  clear(charCode = 32): void {
    this.chars.fill(charCode);
  }

  putChar(x: number, y: number, charCode: number): void {
    if (x < 0 || x >= this.columns) return;
    if (y < 0 || y >= this.rows) return;
    this.chars[y * this.columns + x] = charCode & 0xff;
  }

  getChar(x: number, y: number): number {
    if (x < 0 || x >= this.columns) return 0;
    if (y < 0 || y >= this.rows) return 0;
    return this.chars[y * this.columns + x];
  }

  writeText(x: number, y: number, text: string): void {
    for (let i = 0; i < text.length; i++) {
      this.putChar(x + i, y, text.charCodeAt(i));
    }
  }

  scroll(): void {
    const rowSize = this.columns;
    this.chars.copyWithin(0, rowSize);
    this.chars.fill(32, this.chars.length - rowSize);
  }

  fill(charCode: number): void {
    this.chars.fill(charCode & 0xff);
  }
}
