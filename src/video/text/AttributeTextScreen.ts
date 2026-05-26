export class AttributeTextScreen {
  public readonly chars: Uint8Array;
  public readonly foreground: Uint8Array;
  public readonly background: Uint8Array;

  constructor(
    public readonly columns: number,
    public readonly rows: number,
  ) {
    const size = columns * rows;
    this.chars = new Uint8Array(size);
    this.foreground = new Uint8Array(size);
    this.background = new Uint8Array(size);
    this.clear();
  }

  clear(charCode = 32, foreground = 15, background = 0): void {
    this.chars.fill(charCode & 0xff);
    this.foreground.fill(foreground & 0xff);
    this.background.fill(background & 0xff);
  }

  putChar(
    x: number,
    y: number,
    charCode: number,
    foreground = 15,
    background = 0,
  ): void {
    if (x < 0 || x >= this.columns) return;
    if (y < 0 || y >= this.rows) return;
    const index = y * this.columns + x;
    this.chars[index] = charCode & 0xff;
    this.foreground[index] = foreground & 0xff;
    this.background[index] = background & 0xff;
  }

  getChar(x: number, y: number): { charCode: number; foreground: number; background: number } {
    if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) {
      return { charCode: 0, foreground: 0, background: 0 };
    }
    const index = y * this.columns + x;
    return {
      charCode: this.chars[index],
      foreground: this.foreground[index],
      background: this.background[index],
    };
  }

  writeText(
    x: number,
    y: number,
    text: string,
    foreground = 15,
    background = 0,
  ): void {
    for (let i = 0; i < text.length; i++) {
      this.putChar(x + i, y, text.charCodeAt(i), foreground, background);
    }
  }

  fill(charCode: number, foreground: number, background: number): void {
    this.chars.fill(charCode & 0xff);
    this.foreground.fill(foreground & 0xff);
    this.background.fill(background & 0xff);
  }

  scroll(): void {
    const rowSize = this.columns;
    const totalSize = this.chars.length;
    this.chars.copyWithin(0, rowSize);
    this.foreground.copyWithin(0, rowSize);
    this.background.copyWithin(0, rowSize);
    const start = totalSize - rowSize;
    this.chars.fill(32, start);
    this.foreground.fill(15, start);
    this.background.fill(0, start);
  }
}
