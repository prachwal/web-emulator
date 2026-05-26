import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface Cga160x100Memory {
  pixels: Uint8Array;
  width: number;
  height: number;
  borderColor?: number;
}

export class Cga160x100Decoder implements IVideoModeDecoder<Cga160x100Memory> {
  readonly id = 'cga-160x100' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor() {
    this.sourceWidth = 160;
    this.sourceHeight = 100;
  }

  decode(memory: Cga160x100Memory, target: Uint8Array, _frameNumber: number): void {
    const w = this.sourceWidth;
    const h = this.sourceHeight;
    const border = memory.borderColor ?? 0;
    target.fill(border);

    for (let y = 0; y < h && y < memory.height; y++) {
      for (let x = 0; x < w && x < memory.width; x++) {
        const srcIdx = y * memory.width + x;
        target[y * w + x] = srcIdx < memory.pixels.length ? memory.pixels[srcIdx] : border;
      }
    }
  }
}
