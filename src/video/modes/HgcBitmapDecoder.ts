import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface HgcBitmapMemory {
  pixels: Uint8Array;
  width: number;
  height: number;
  fgColor: number;
  bgColor: number;
}

export class HgcBitmapDecoder implements IVideoModeDecoder<HgcBitmapMemory> {
  readonly id = 'herc-bitmap' as const;
  readonly sourceWidth = 720;
  readonly sourceHeight = 348;

  decode(memory: HgcBitmapMemory, target: Uint8Array, _frameNumber: number): void {
    const w = this.sourceWidth;
    const h = this.sourceHeight;
    target.fill(memory.bgColor);

    const { pixels, fgColor, bgColor } = memory;
    for (let y = 0; y < h && y < memory.height; y++) {
      for (let x = 0; x < w && x < memory.width; x++) {
        const srcIdx = y * memory.width + x;
        if (srcIdx < pixels.length) {
          target[y * w + x] = pixels[srcIdx] ? fgColor : bgColor;
        }
      }
    }
  }
}
