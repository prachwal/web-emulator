import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface CpcGateArrayMemory {
  videoRam: Uint8Array;
  mode: 0 | 1 | 2;
  inkPalette: number[];
}

function cpcAddr(x: number, y: number): number {
  const y0 = y & 7;
  const y1 = (y >> 3) & 7;
  const y2 = y >> 6;
  return y0 * 0x400 + y1 * 0x50 + y2 * 0x280 + x;
}

export class CpcGateArrayDecoder implements IVideoModeDecoder<CpcGateArrayMemory> {
  readonly id = 'cpc-gate-array' as const;
  sourceWidth: number;
  sourceHeight: number = 200;
  private _mode: 0 | 1 | 2 = 1;

  constructor(mode: 0 | 1 | 2 = 1) {
    this._mode = mode;
    this.sourceWidth = mode === 0 ? 160 : mode === 1 ? 320 : 640;
  }

  get mode(): 0 | 1 | 2 { return this._mode; }
  set mode(m: 0 | 1 | 2) {
    this._mode = m;
    this.sourceWidth = m === 0 ? 160 : m === 1 ? 320 : 640;
  }

  decode(memory: CpcGateArrayMemory, target: Uint8Array, _frameNumber: number): void {
    const vram = memory.videoRam;
    const w = this.sourceWidth;
    const h = this.sourceHeight;
    const pal = memory.inkPalette;
    const m = memory.mode;

    target.fill(pal[0] ?? 0);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < 80; x++) {
        const addr = cpcAddr(x, y);
        const byteVal = addr < vram.length ? vram[addr] : 0;

        if (m === 0) {
          const hi = (byteVal >> 4) & 0x0f;
          const lo = byteVal & 0x0f;
          if (x * 2 < w)     target[y * w + x * 2] = hi < pal.length ? pal[hi] : 0;
          if (x * 2 + 1 < w) target[y * w + x * 2 + 1] = lo < pal.length ? pal[lo] : 0;
        } else if (m === 1) {
          const p0 = (byteVal >> 6) & 3;
          const p1 = (byteVal >> 4) & 3;
          const p2 = (byteVal >> 2) & 3;
          const p3 = byteVal & 3;
          if (x * 4 < w)     target[y * w + x * 4] = p0 < pal.length ? pal[p0] : 0;
          if (x * 4 + 1 < w) target[y * w + x * 4 + 1] = p1 < pal.length ? pal[p1] : 0;
          if (x * 4 + 2 < w) target[y * w + x * 4 + 2] = p2 < pal.length ? pal[p2] : 0;
          if (x * 4 + 3 < w) target[y * w + x * 4 + 3] = p3 < pal.length ? pal[p3] : 0;
        } else {
          for (let b = 0; b < 8 && x * 8 + b < w; b++) {
            const bit = (byteVal >> (7 - b)) & 1;
            target[y * w + x * 8 + b] = bit < pal.length ? pal[bit] : 0;
          }
        }
      }
    }
  }
}
