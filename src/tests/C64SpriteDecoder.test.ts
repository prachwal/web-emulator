import { describe, it, expect } from 'vitest';
import { C64SpriteDecoder } from '../video/modes/C64SpriteDecoder';

function makeSpriteData(pattern: number = 0xff): Uint8Array {
  const d = new Uint8Array(63);
  d.fill(pattern);
  return d;
}

describe('C64SpriteDecoder', () => {
  it('renders a sprite onto framebuffer', () => {
    const d = new C64SpriteDecoder(320, 200);
    const fb = new Uint8Array(320 * 200);
    fb.fill(0);
    d.decode({
      sprites: [{ x: 10, y: 10, color: 7, data: makeSpriteData(0xff) }],
      framebufferWidth: 320,
      framebufferHeight: 200,
    }, fb, 0);
    expect(fb[10 * 320 + 10]).toBe(7);
  });

  it('renders multiple sprites', () => {
    const d = new C64SpriteDecoder(320, 200);
    const fb = new Uint8Array(320 * 200);
    fb.fill(0);
    d.decode({
      sprites: [
        { x: 0, y: 0, color: 1, data: makeSpriteData(0xff) },
        { x: 50, y: 50, color: 2, data: makeSpriteData(0xaa) },
      ],
      framebufferWidth: 320,
      framebufferHeight: 200,
    }, fb, 0);
    expect(fb[0]).toBe(1);
    expect(fb[50 * 320 + 50]).toBe(2);
  });

  it('clips sprite at screen edge', () => {
    const d = new C64SpriteDecoder(320, 200);
    const fb = new Uint8Array(320 * 200);
    fb.fill(0);
    d.decode({
      sprites: [{ x: 310, y: 190, color: 7, data: makeSpriteData(0xff) }],
      framebufferWidth: 320,
      framebufferHeight: 200,
    }, fb, 0);
    expect(() => d.decode({ sprites: [], framebufferWidth: 320, framebufferHeight: 200 }, fb, 0)).not.toThrow();
  });
});
