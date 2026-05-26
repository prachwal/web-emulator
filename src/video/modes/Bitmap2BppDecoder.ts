import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface Bitmap2BppMemory {
  bitmap: Uint8Array;
  colorRam: Uint8Array;
  screenRam?: Uint8Array;
  width: number;
  height: number;
  cols: number;
  rows: number;
  backgroundColorIndex: number;
  borderColorIndex?: number;
  foregroundColorIndex?: number;
}

export class Bitmap2BppDecoder implements IVideoModeDecoder<Bitmap2BppMemory> {
  readonly id = 'bitmap-2bpp';
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(width: number, height: number) {
    this.sourceWidth = width;
    this.sourceHeight = height;
  }

  decode(memory: Bitmap2BppMemory, target: Uint8Array, frameNumber: number): void {
    const fw = this.sourceWidth;
    const fh = this.sourceHeight;
    const cols = memory.cols;
    const rows = memory.rows;
    const cellW = fw / cols;
    const cellH = fh / rows;
    const border = memory.borderColorIndex ?? 0;

    if (border) target.fill(border);

    for (let y = 0; y < fh; y++) {
      for (let x = 0; x < fw; x++) {
        const cellCol = Math.floor(x / cellW);
        const cellRow = Math.floor(y / cellH);
        const cellIdx = cellRow * cols + cellCol;
        const colorNybble = cellIdx < memory.colorRam.length ? memory.colorRam[cellIdx] & 0x0f : 7;

        const byteIdx = Math.floor(y * Math.ceil(fw / 4) + x / 4);
        const bitShift = 6 - (x % 4) * 2;
        const bits = byteIdx < memory.bitmap.length ? (memory.bitmap[byteIdx] >> bitShift) & 3 : 0;

        let color: number;
        switch (bits) {
          case 0:
            color = memory.backgroundColorIndex;
            break;
          case 1:
            color = colorNybble;
            break;
          case 2:
            color = memory.foregroundColorIndex ?? 7;
            break;
          default:
            color = memory.backgroundColorIndex;
        }

        target[y * fw + x] = color;
      }
    }
  }
}
