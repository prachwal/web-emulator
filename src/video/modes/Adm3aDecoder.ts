import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface Adm3aMemory {
  cols: number;
  rows: number;
  chars: Uint8Array;
  cursorX: number;
  cursorY: number;
  fgColor: number;
  bgColor: number;
}

export class Adm3aDecoder implements IVideoModeDecoder<Adm3aMemory> {
  readonly id = 'adm3a' as const;
  sourceWidth: number;
  sourceHeight: number;

  constructor(cols: number = 80, rows: number = 24, cellW: number = 8, cellH: number = 16) {
    this.sourceWidth = cols * cellW;
    this.sourceHeight = rows * cellH;
  }

  decode(memory: Adm3aMemory, target: Uint8Array, _frameNumber: number): void {
    const { cols, rows, chars, cursorX, cursorY, fgColor, bgColor } = memory;
    const fw = this.sourceWidth;
    const fh = this.sourceHeight;
    const cellW = fw / cols;
    const cellH = fh / rows;

    target.fill(bgColor);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ch = chars[row * cols + col] ?? 0x20;
        if (ch < 0x20) continue;
        for (let gy = 0; gy < cellH; gy++) {
          for (let gx = 0; gx < cellW; gx++) {
            const px = col * cellW + gx;
            const py = row * cellH + gy;
            if (px < fw && py < fh) {
              target[py * fw + px] = bgColor;
            }
          }
        }
      }
    }

    if (cursorX >= 0 && cursorX < cols && cursorY >= 0 && cursorY < rows) {
      const cx = cursorX * cellW;
      const cy = cursorY * cellH;
      for (let gx = 0; gx < cellW && cx + gx < fw; gx++) {
        for (let gy = 0; gy < cellH && cy + gy < fh; gy++) {
          target[(cy + gy) * fw + (cx + gx)] = fgColor;
        }
      }
    }
  }
}
