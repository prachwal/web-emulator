import { describe, it, expect } from 'vitest';
import { validateId, generateJsonExport, generateTsExport } from '../video/fonts/FontPresetExport';
import type { FontDecodeParams } from '../video/fonts/BinaryFontDecoder';

const params: FontDecodeParams = {
  charWidth: 8, charHeight: 8, cellWidth: 8, cellHeight: 8,
  glyphCount: 256, offset: 0, bytesPerGlyph: 8,
  bitOrder: 'msb-first', invert: false,
};

const meta = { id: 'my-font', name: 'My Font', computer: 'Test', sourcePath: 'test-rom.bin', mapperId: 'ascii' as const };

describe('validateId', () => {
  it('accepts valid id', () => expect(validateId('my-font')).toBeNull());
  it('rejects uppercase', () => expect(validateId('MyFont')).not.toBeNull());
  it('rejects leading digit', () => expect(validateId('1font')).not.toBeNull());
  it('rejects spaces', () => expect(validateId('my font')).not.toBeNull());
});

describe('generateJsonExport', () => {
  it('includes all key fields', () => {
    const json = generateJsonExport(params, meta);
    const obj = JSON.parse(json);
    expect(obj.id).toBe('my-font');
    expect(obj.glyphCount).toBe(256);
    expect(obj.charWidth).toBe(8);
    expect(obj.offset).toBe(0);
    expect(obj.mapperId).toBe('ascii');
    expect(obj.sourcePath).toBe('test-rom.bin');
  });

  it('includes xBits for LSB', () => {
    const p = { ...params, bitOrder: 'lsb-first' as const };
    const json = generateJsonExport(p, meta);
    const obj = JSON.parse(json);
    expect(obj.xBits).toBe('[0, 1, 2, 3, 4, 5, 6, 7]');
  });
});

describe('generateTsExport', () => {
  it('generates valid TypeScript fragment', () => {
    const ts = generateTsExport(params, meta);
    expect(ts).toContain("id: 'my-font'");
    expect(ts).toContain('glyphCount: 256');
    expect(ts).toContain('xBits: msb8');
    expect(ts).toContain("mapperId: 'ascii'");
  });

  it('throws on invalid id', () => {
    expect(() => generateTsExport(params, { ...meta, id: 'Bad ID' })).toThrow();
  });
});
