import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface Bitmap1BppMemory {
  bitmap: Uint8Array;
  width: number;
  height: number;
  fgColor: number;
  bgColor: number;
}

export class Bitmap1BppDecoder implements IVideoModeDecoder<Bitmap1BppMemory> {
  readonly id = 'bitmap-1bpp' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(width: number = 256, height: number = 192) {
    this.sourceWidth = width;
    this.sourceHeight = height;
  }

  decode(memory: Bitmap1BppMemory, target: Uint8Array, _frameNumber: number): void {
    target.fill(memory.bgColor);
    const { bitmap, width, height, fgColor, bgColor } = memory;
    const bytesPerRow = Math.ceil(width / 8);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const byteIndex = y * bytesPerRow + Math.floor(x / 8);
        const bit = byteIndex < bitmap.length
          ? (bitmap[byteIndex] >> (7 - (x % 8))) & 1
          : 0;
        target[y * width + x] = bit ? fgColor : bgColor;
      }
    }
  }
}
