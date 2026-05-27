import { describe, it, expect } from 'vitest';
import { BinaryFontDecoder, defaultFontParams } from '../video/fonts/BinaryFontDecoder';

function makeFontData(bytesPerGlyph: number, glyphCount: number, fill: (c: number, row: number) => number): Uint8Array {
  const data = new Uint8Array(bytesPerGlyph * glyphCount);
  for (let c = 0; c < glyphCount; c++) {
    for (let r = 0; r < bytesPerGlyph; r++) {
      data[c * bytesPerGlyph + r] = fill(c, r);
    }
  }
  return data;
}

describe('BinaryFontDecoder', () => {
  it('decodes MSB-first glyph', () => {
    const data = new Uint8Array(16);
    data[0] = 0xFF; data[1] = 0x81;
    const d = new BinaryFontDecoder(data, { charWidth: 8, charHeight: 2, cellWidth: 8, cellHeight: 2, glyphCount: 2, offset: 0, bytesPerGlyph: 2, bytesPerRow: 0, bitOrder: 'msb-first', invert: false });
    const g = d.decodeGlyph(0);
    expect(g.pixels[0]).toBe(1);    // MSB of 0xFF
    expect(g.pixels[7]).toBe(1);    // LSB of 0xFF
    expect(g.pixels[8]).toBe(1);    // MSB of 0x81
    expect(g.pixels[15]).toBe(1);   // LSB of 0x81
  });

  it('decodes LSB-first glyph', () => {
    const data = new Uint8Array(16);
    data[0] = 0x01;
    const d = new BinaryFontDecoder(data, { charWidth: 8, charHeight: 1, cellWidth: 8, cellHeight: 1, glyphCount: 2, offset: 0, bytesPerGlyph: 1, bytesPerRow: 0, bitOrder: 'lsb-first', invert: false });
    const g = d.decodeGlyph(0);
    expect(g.pixels[0]).toBe(1);    // LSB of 0x01 = bit 0
    expect(g.pixels[7]).toBe(0);
  });

  it('honours offset', () => {
    const data = makeFontData(8, 4, (c, r) => c === 2 ? 0x42 : 0);
    const d = new BinaryFontDecoder(data, { charWidth: 8, charHeight: 8, cellWidth: 8, cellHeight: 8, glyphCount: 1, offset: 16, bytesPerGlyph: 8, bytesPerRow: 0, bitOrder: 'msb-first', invert: false });
    const g = d.decodeGlyph(0);
    expect(g.pixels[1]).toBe(1); // 0x42 = 01000010
    expect(g.pixels[6]).toBe(1);
  });

  it('detects invalid size', () => {
    const data = new Uint8Array(10);
    const d = new BinaryFontDecoder(data, { charWidth: 8, charHeight: 8, cellWidth: 8, cellHeight: 8, glyphCount: 256, offset: 0, bytesPerGlyph: 8, bytesPerRow: 0, bitOrder: 'msb-first', invert: false });
    expect(d.isValid).toBe(false);
    expect(d.error).not.toBeNull();
  });

  it('accepts valid size', () => {
    const data = new Uint8Array(2048);
    const d = new BinaryFontDecoder(data, { charWidth: 8, charHeight: 8, cellWidth: 8, cellHeight: 8, glyphCount: 256, offset: 0, bytesPerGlyph: 8, bytesPerRow: 0, bitOrder: 'msb-first', invert: false });
    expect(d.isValid).toBe(true);
    expect(d.error).toBeNull();
  });

  it('defaultFontParams guesses from file size', () => {
    const data = new Uint8Array(1024);
    const p = defaultFontParams(data);
    expect(p.glyphCount).toBe(128);
    expect(p.bytesPerGlyph).toBe(8);
  });

  it('decodes charWidth > 8 pixels', () => {
    // 10px wide font: 2 bytes per row, 8 rows = 16 bytes per glyph
    const data = new Uint8Array(32);
    data[0] = 0xFF; data[1] = 0xC0; // row 0: first 10 bits = 1111111111
    data[16] = 0x81; data[17] = 0x00; // glyph 1, row 0: 1000000010
    const d = new BinaryFontDecoder(data, { charWidth: 10, charHeight: 8, cellWidth: 10, cellHeight: 8, glyphCount: 2, offset: 0, bytesPerGlyph: 16, bytesPerRow: 2, bitOrder: 'msb-first', invert: false });
    const g = d.decodeGlyph(0);
    expect(g.pixels[0]).toBe(1);
    expect(g.pixels[9]).toBe(1);
    expect(g.width).toBe(10);
  });

  it('handles stride > rowBytes', () => {
    // 6px wide font stored with 2 bytes stride (wasted bits)
    const data = new Uint8Array(32);
    data[0] = 0xFC; // row 0: 111111 in 8 bits, with stride=2
    data[1] = 0x00;
    const d = new BinaryFontDecoder(data, { charWidth: 6, charHeight: 8, cellWidth: 6, cellHeight: 8, glyphCount: 2, offset: 0, bytesPerGlyph: 16, bytesPerRow: 2, bitOrder: 'msb-first', invert: false });
    const g = d.decodeGlyph(0);
    expect(g.pixels[0]).toBe(1);
    expect(g.pixels[5]).toBe(1);
    expect(g.width).toBe(6);
  });
});
