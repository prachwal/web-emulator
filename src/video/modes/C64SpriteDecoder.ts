import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface C64SpriteData {
  x: number;
  y: number;
  color: number;
  data: Uint8Array;
}

export interface C64SpriteMemory {
  sprites: C64SpriteData[];
  framebufferWidth: number;
  framebufferHeight: number;
}

export class C64SpriteDecoder implements IVideoModeDecoder<C64SpriteMemory> {
  readonly id = 'c64-sprites' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(width: number = 320, height: number = 200) {
    this.sourceWidth = width;
    this.sourceHeight = height;
  }

  decode(memory: C64SpriteMemory, target: Uint8Array, _frameNumber: number): void {
    const fw = this.sourceWidth;
    const fh = this.sourceHeight;
    const { sprites } = memory;

    for (let si = 0; si < sprites.length; si++) {
      const spr = sprites[si];
      if (!spr.data || spr.data.length < 63) continue;

      for (let row = 0; row < 21; row++) {
        const byteOffset = row * 3;
        for (let col = 0; col < 24; col++) {
          const byteIdx = Math.floor(col / 8);
          const bit = (spr.data[byteOffset + byteIdx] >> (7 - (col % 8))) & 1;
          if (!bit) continue;
          const px = spr.x + col;
          const py = spr.y + row;
          if (px >= 0 && px < fw && py >= 0 && py < fh) {
            target[py * fw + px] = spr.color;
          }
        }
      }
    }
  }
}
