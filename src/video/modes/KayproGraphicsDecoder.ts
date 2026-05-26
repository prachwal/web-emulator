import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface KayproGraphicsMemory {
  chars: Uint8Array;
  attrs?: Uint8Array;
  cols: number;
  rows: number;
  fgColor: number;
  bgColor: number;
}

const blockPixels = [
  1, 0, 3, 2, 5, 4, 7, 6,
];

export class KayproGraphicsDecoder implements IVideoModeDecoder<KayproGraphicsMemory> {
  readonly id = 'kaypro-graphics' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor() {
    this.sourceWidth = 160;
    this.sourceHeight = 100;
  }

  decode(memory: KayproGraphicsMemory, target: Uint8Array, _frameNumber: number): void {
    const { chars, attrs, cols, rows, fgColor, bgColor } = memory;
    const w = this.sourceWidth;
    const h = this.sourceHeight;
    target.fill(bgColor);

    for (let cellRow = 0; cellRow < rows; cellRow++) {
      for (let cellCol = 0; cellCol < cols; cellCol++) {
        const cellIdx = cellRow * cols + cellCol;
        const ch = cellIdx < chars.length ? chars[cellIdx] : 0;
        const inv = attrs ? (attrs[cellIdx] & 0x80) !== 0 : false;

        for (let by = 0; by < 4; by++) {
          for (let bx = 0; bx < 2; bx++) {
            const bitIdx = by * 2 + bx;
            const mapIdx = blockPixels[bitIdx];
            const bit = (ch >> mapIdx) & 1;
            const color = (bit ? fgColor : bgColor);
            const px = cellCol * 2 + bx;
            const py = cellRow * 4 + by;
            if (px < w && py < h) {
              target[py * w + px] = inv ? (color === fgColor ? bgColor : fgColor) : color;
            }
          }
        }
      }
    }
  }
}
