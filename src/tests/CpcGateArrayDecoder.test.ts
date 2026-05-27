import { describe, it, expect } from 'vitest';
import { CpcGateArrayDecoder } from '../video/modes/CpcGateArrayDecoder';

describe('CpcGateArrayDecoder', () => {
  it('decodes mode 2 (640x200 2 colors)', () => {
    const d = new CpcGateArrayDecoder(2);
    expect(d.sourceWidth).toBe(640);
    expect(d.sourceHeight).toBe(200);
    const vram = new Uint8Array(0x4000);
    vram.fill(0xff);
    const fb = new Uint8Array(640 * 200);
    d.decode({ videoRam: vram, mode: 2, inkPalette: [0, 1] }, fb, 0);
    expect(fb[0]).toBe(1);
    expect(fb[1]).toBe(1);
  });

  it('decodes mode 1 (320x200 4 colors)', () => {
    const d = new CpcGateArrayDecoder(1);
    expect(d.sourceWidth).toBe(320);
    const vram = new Uint8Array(0x4000);
    vram.fill(0xe4);
    const fb = new Uint8Array(320 * 200);
    d.decode({ videoRam: vram, mode: 1, inkPalette: [0, 1, 2, 3] }, fb, 0);
    expect(fb[0]).toBe(3);
    expect(fb[1]).toBe(2);
    expect(fb[2]).toBe(1);
    expect(fb[3]).toBe(0);
  });

  it('decodes mode 0 (160x200 16 colors)', () => {
    const d = new CpcGateArrayDecoder(0);
    expect(d.sourceWidth).toBe(160);
    const vram = new Uint8Array(0x4000);
    vram.fill(0x12);
    const fb = new Uint8Array(160 * 200);
    d.decode({ videoRam: vram, mode: 0, inkPalette: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] }, fb, 0);
    expect(fb[0]).toBe(1);
    expect(fb[1]).toBe(2);
  });
});
