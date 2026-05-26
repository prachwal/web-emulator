export class Framebuffer {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
  }

  clear(value: number = 0): void {
    this.data.fill(value);
  }

  setPixel(x: number, y: number, colorIndex: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.data[y * this.width + x] = colorIndex;
  }

  getPixel(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.data[y * this.width + x];
  }

  fillRect(
    x: number,
    y: number,
    w: number,
    h: number,
    colorIndex: number,
  ): void {
    const x1 = Math.max(0, x);
    const y1 = Math.max(0, y);
    const x2 = Math.min(this.width, x + w);
    const y2 = Math.min(this.height, y + h);
    for (let row = y1; row < y2; row++) {
      const offset = row * this.width;
      this.data.fill(colorIndex, offset + x1, offset + x2);
    }
  }

  blit(
    source: Uint8Array,
    srcWidth: number,
    destX: number,
    destY: number,
  ): void {
    const srcHeight = source.length / srcWidth;
    for (let row = 0; row < srcHeight; row++) {
      const srcRow = row * srcWidth;
      const destRow = (destY + row) * this.width + destX;
      this.data.set(source.subarray(srcRow, srcRow + srcWidth), destRow);
    }
  }

  fillCheckerboard(
    tileSize: number,
    colors: [number, number],
  ): void {
    for (let y = 0; y < this.height; y++) {
      const row = y * this.width;
      for (let x = 0; x < this.width; x++) {
        const tx = Math.floor(x / tileSize);
        const ty = Math.floor(y / tileSize);
        this.data[row + x] = (tx + ty) % 2 === 0 ? colors[0] : colors[1];
      }
    }
  }

  clone(): Framebuffer {
    const fb = new Framebuffer(this.width, this.height);
    fb.data.set(this.data);
    return fb;
  }
}
