import { describe, it, expect } from 'vitest';
import { loadFontFromBin, getGlyphBit } from '../video/BitmapFont';

describe('loadFontFromBin', () => {
  it('creates font with correct properties', () => {
    const data = new Uint8Array(2048);
    const font = loadFontFromBin('test', 'Test', data, 256, 8, 8, 'msb-left');
    expect(font.id).toBe('test');
    expect(font.glyphCount).toBe(256);
    expect(font.charWidth).toBe(8);
    expect(font.charHeight).toBe(8);
    expect(font.bytesPerGlyph).toBe(8);
  });

  it('handles different glyph counts', () => {
    const data = new Uint8Array(768);
    const font = loadFontFromBin('zx', 'ZX', data, 96, 8, 8, 'msb-left');
    expect(font.glyphCount).toBe(96);
    expect(font.data.length).toBe(768);
  });

  it('handles 14px high font', () => {
    const data = new Uint8Array(256 * 14);
    const font = loadFontFromBin('mda', 'MDA', data, 256, 8, 14, 'msb-left');
    expect(font.charHeight).toBe(14);
    expect(font.bytesPerGlyph).toBe(14);
    expect(font.data.length).toBe(3584);
  });
});

describe('getGlyphBit', () => {
  it('reads MSB-left bit order correctly', () => {
    const data = new Uint8Array(8);
    data[0] = 0x80;
    const font = loadFontFromBin('test', 'Test', data, 1, 8, 8, 'msb-left');
    expect(getGlyphBit(font, 0, 0, 0)).toBe(1);
    expect(getGlyphBit(font, 0, 1, 0)).toBe(0);
  });

  it('reads LSB-left bit order correctly', () => {
    const data = new Uint8Array(8);
    data[0] = 0x01;
    const font = loadFontFromBin('test', 'Test', data, 1, 8, 8, 'lsb-left');
    expect(getGlyphBit(font, 0, 0, 0)).toBe(1);
    expect(getGlyphBit(font, 0, 1, 0)).toBe(0);
  });
});
