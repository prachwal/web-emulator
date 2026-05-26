import { describe, it, expect } from 'vitest';
import type { BitmapFont } from '../video/BitmapFont';
import {
  getGlyphData,
  getGlyphBit,
  loadFontFromBin,
  createDefaultFont,
  renderGlyphToBuffer,
} from '../video/BitmapFont';

function makeTestFont(charWidth: number = 8, charHeight: number = 8): BitmapFont {
  const glyphCount = 256;
  const bytesPerGlyph = charHeight;
  const data = new Uint8Array(glyphCount * bytesPerGlyph);
  for (let i = 0; i < glyphCount; i++) {
    for (let row = 0; row < charHeight; row++) {
      data[i * bytesPerGlyph + row] = 0xFF;
    }
  }
  return {
    id: 'test', name: 'Test', glyphCount, charWidth, charHeight,
    bytesPerGlyph, data, bitOrder: 'msb-left',
  };
}

describe('getGlyphData', () => {
  it('returns glyph data for valid charCode', () => {
    const font = makeTestFont();
    const data = getGlyphData(font, 0x41);
    expect(data.length).toBe(8);
    expect(data[0]).toBe(0xFF);
  });

  it('returns empty buffer for out-of-range charCode', () => {
    const font = makeTestFont();
    const data = getGlyphData(font, 999);
    expect(data.length).toBe(8);
    expect(data[0]).toBe(0);
  });
});

describe('getGlyphBit', () => {
  it('reads bit from glyph (MSB-first)', () => {
    const font = makeTestFont();
    expect(getGlyphBit(font, 0x41, 0, 0)).toBe(1);
    expect(getGlyphBit(font, 0x41, 7, 0)).toBe(1);
  });

  it('reads bit from glyph (LSB-first)', () => {
    const data = new Uint8Array(8);
    data[0] = 0x01;
    const font = {
      id: 'test', name: 'Test', glyphCount: 1, charWidth: 8, charHeight: 8,
      bytesPerGlyph: 8, data, bitOrder: 'lsb-left' as const,
    };
    expect(getGlyphBit(font, 0, 0, 0)).toBe(1);
  });
});

describe('loadFontFromBin', () => {
  it('creates font from binary data', () => {
    const data = new Uint8Array(256 * 8);
    const font = loadFontFromBin('test-id', 'Test', data, 256, 8, 8);
    expect(font.id).toBe('test-id');
    expect(font.name).toBe('Test');
    expect(font.glyphCount).toBe(256);
    expect(font.bytesPerGlyph).toBe(8);
    expect(font.bitOrder).toBe('msb-left');
  });
});

describe('createDefaultFont', () => {
  it('creates font with expected dimensions', () => {
    const font = createDefaultFont(8, 8);
    expect(font.glyphCount).toBe(256);
    expect(font.charWidth).toBe(8);
    expect(font.charHeight).toBe(8);
    expect(font.bytesPerGlyph).toBe(8);
    expect(font.bitOrder).toBe('msb-left');
  });
});

describe('renderGlyphToBuffer', () => {
  it('renders glyph into buffer', () => {
    const font = createDefaultFont(8, 8);
    const buffer = new Uint8Array(8 * 8);
    renderGlyphToBuffer(font, 0x41, buffer, 8, 0, 0, 1, 0);
    expect(buffer[0]).toBe(1);
  });
});
