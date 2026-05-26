import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface C64MulticolorMemory {
  bitmap: Uint8Array;
  screenRam: Uint8Array;
  colorRam: Uint8Array;
  width: number;
  height: number;
  cols: number;
  rows: number;
  backgroundColor: number;
  borderColor?: number;
}

export class C64MulticolorDecoder implements IVideoModeDecoder<C64MulticolorMemory> {
  readonly id = 'c64-multicolor' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(width: number = 160, height: number = 200) {
    this.sourceWidth = width;
    this.sourceHeight = height;
  }

  decode(memory: C64MulticolorMemory, target: Uint8Array, _frameNumber: number): void {
    const fw = this.sourceWidth;
    const fh = this.sourceHeight;
    const cols = memory.cols;
    const rows = memory.rows;
    const cellW = fw / cols;
    const cellH = fh / rows;

    target.fill(memory.borderColor ?? memory.backgroundColor);

    for (let y = 0; y < fh; y++) {
      for (let x = 0; x < fw; x++) {
        const cellCol = Math.floor(x / cellW);
        const cellRow = Math.floor(y / cellH);
        const cellIdx = cellRow * cols + cellCol;

        const byteIdx = Math.floor(y * Math.ceil(fw / 4) + x / 4);
        const bitShift = 6 - (x % 4) * 2;
        const bits = byteIdx < memory.bitmap.length
          ? (memory.bitmap[byteIdx] >> bitShift) & 3
          : 0;

        const scr = cellIdx < memory.screenRam.length ? memory.screenRam[cellIdx] : 0;
        const cm = cellIdx < memory.colorRam.length ? memory.colorRam[cellIdx] & 0x0f : 7;

        let colorIdx: number;
        switch (bits) {
          case 0: colorIdx = memory.backgroundColor; break;
          case 1: colorIdx = scr >> 4; break;
          case 2: colorIdx = scr & 0x0f; break;
          default: colorIdx = cm; break;
        }

        target[y * fw + x] = colorIdx;
      }
    }
  }
}
