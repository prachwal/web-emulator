import { describe, it, expect } from 'vitest';
import { Framebuffer } from '../video/Framebuffer';

describe('Framebuffer', () => {
  it('creates buffer with correct size', () => {
    const fb = new Framebuffer(256, 192);
    expect(fb.width).toBe(256);
    expect(fb.height).toBe(192);
    expect(fb.data.length).toBe(256 * 192);
  });

  it('sets and gets pixels', () => {
    const fb = new Framebuffer(10, 10);
    fb.setPixel(5, 5, 7);
    expect(fb.getPixel(5, 5)).toBe(7);
  });

  it('clamps out-of-bounds', () => {
    const fb = new Framebuffer(10, 10);
    fb.setPixel(-1, 0, 1);
    fb.setPixel(0, -1, 1);
    fb.setPixel(99, 99, 1);
    expect(fb.getPixel(-1, 0)).toBe(0);
    expect(fb.getPixel(99, 99)).toBe(0);
  });

  it('clears buffer', () => {
    const fb = new Framebuffer(10, 10);
    fb.fillRect(0, 0, 10, 10, 5);
    fb.clear(0);
    expect(fb.data.every(v => v === 0)).toBe(true);
  });

  it('fills checkerboard', () => {
    const fb = new Framebuffer(16, 16);
    fb.fillCheckerboard(4, [1, 0]);
    expect(fb.getPixel(0, 0)).toBe(1);
    expect(fb.getPixel(4, 0)).toBe(0);
    expect(fb.getPixel(0, 4)).toBe(0);
    expect(fb.getPixel(4, 4)).toBe(1);
  });

  it('blits source into buffer', () => {
    const fb = new Framebuffer(10, 10);
    const src = new Uint8Array([1, 2, 3, 4]);
    fb.blit(src, 2, 1, 1);
    expect(fb.getPixel(1, 1)).toBe(1);
    expect(fb.getPixel(2, 1)).toBe(2);
  });
});
