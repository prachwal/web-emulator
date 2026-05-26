import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface SemiGraphicsMemory {
  chars: Uint8Array;
  cols: number;
  rows: number;
  fgColor: number;
  bgColor: number;
}

const blockPatterns: Record<number, number> = {
  0x00: 0b000000, 0x01: 0b000001, 0x02: 0b000010, 0x03: 0b000011,
  0x04: 0b000100, 0x05: 0b000101, 0x06: 0b000110, 0x07: 0b000111,
  0x08: 0b001000, 0x09: 0b001001, 0x0a: 0b001010, 0x0b: 0b001011,
  0x0c: 0b001100, 0x0d: 0b001101, 0x0e: 0b001110, 0x0f: 0b001111,
  0x10: 0b010000, 0x11: 0b010001, 0x12: 0b010010, 0x13: 0b010011,
  0x14: 0b010100, 0x15: 0b010101, 0x16: 0b010110, 0x17: 0b010111,
  0x18: 0b011000, 0x19: 0b011001, 0x1a: 0b011010, 0x1b: 0b011011,
  0x1c: 0b011100, 0x1d: 0b011101, 0x1e: 0b011110, 0x1f: 0b011111,
  0x20: 0b100000, 0x21: 0b100001, 0x22: 0b100010, 0x23: 0b100011,
  0x24: 0b100100, 0x25: 0b100101, 0x26: 0b100110, 0x27: 0b100111,
  0x28: 0b101000, 0x29: 0b101001, 0x2a: 0b101010, 0x2b: 0b101011,
  0x2c: 0b101100, 0x2d: 0b101101, 0x2e: 0b101110, 0x2f: 0b101111,
  0x30: 0b110000, 0x31: 0b110001, 0x32: 0b110010, 0x33: 0b110011,
  0x34: 0b110100, 0x35: 0b110101, 0x36: 0b110110, 0x37: 0b110111,
  0x38: 0b111000, 0x39: 0b111001, 0x3a: 0b111010, 0x3b: 0b111011,
  0x3c: 0b111100, 0x3d: 0b111101, 0x3e: 0b111110, 0x3f: 0b111111,
};

export class SemiGraphicsDecoder implements IVideoModeDecoder<SemiGraphicsMemory> {
  readonly id = 'semi-graphics' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(cols: number = 64, rows: number = 16) {
    this.sourceWidth = cols * 2;
    this.sourceHeight = rows * 3;
  }

  decode(memory: SemiGraphicsMemory, target: Uint8Array, _frameNumber: number): void {
    const { chars, cols, rows, fgColor, bgColor } = memory;
    const w = this.sourceWidth;
    const h = this.sourceHeight;
    target.fill(bgColor);

    for (let cellRow = 0; cellRow < rows; cellRow++) {
      for (let cellCol = 0; cellCol < cols; cellCol++) {
        const cellIdx = cellRow * cols + cellCol;
        const ch = cellIdx < chars.length ? chars[cellIdx] : 0x20;
        const pattern = ch >= 0x20 ? blockPatterns[ch - 0x20] ?? 0 : 0;

        for (let by = 0; by < 3; by++) {
          for (let bx = 0; bx < 2; bx++) {
            const bitIdx = by * 2 + bx;
            const bit = (pattern >> (5 - bitIdx)) & 1;
            const px = cellCol * 2 + bx;
            const py = cellRow * 3 + by;
            if (px < w && py < h) {
              target[py * w + px] = bit ? fgColor : bgColor;
            }
          }
        }
      }
    }
  }
}
