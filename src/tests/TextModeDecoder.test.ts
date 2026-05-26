import { describe, it, expect } from 'vitest';
import { TextModeDecoder } from '../video/modes/TextModeDecoder';
import { createDefaultFont } from '../video/BitmapFont';

describe('TextModeDecoder', () => {
  it('decodes text mode framebuffer', () => {
    const decoder = new TextModeDecoder(40, 25, 8, 8);
    const font = createDefaultFont(8, 8);
    const screenRam = new Uint8Array(40 * 25);
    const colorRam = new Uint8Array(40 * 25);

    screenRam.fill(0x41);
    colorRam.fill(7);

    const memory = {
      columns: 40,
      rows: 25,
      charWidth: 8,
      charHeight: 8,
      screenRam,
      colorRam,
      font,
      backgroundColorIndex: 0,
    };

    const target = new Uint8Array(decoder.sourceWidth * decoder.sourceHeight);
    decoder.decode(memory, target, 0);

    expect(target[0]).toBe(7);
    expect(target.length).toBe(40 * 8 * 25 * 8);
  });

  it('handles background color', () => {
    const decoder = new TextModeDecoder(40, 25, 8, 8);
    const font = createDefaultFont(8, 8);
    const screenRam = new Uint8Array(40 * 25);
    const colorRam = new Uint8Array(40 * 25);

    const memory = {
      columns: 40,
      rows: 25,
      charWidth: 8,
      charHeight: 8,
      screenRam,
      colorRam,
      font,
      backgroundColorIndex: 5,
    };

    const target = new Uint8Array(decoder.sourceWidth * decoder.sourceHeight);
    decoder.decode(memory, target, 0);

    expect(target[0]).toBe(0); // bg from colorRam high nibble
  });

  it('vic20 colorModel reads 4-bit nybble foreground', () => {
    const decoder = new TextModeDecoder(22, 23, 8, 8);
    const font = createDefaultFont(8, 8);
    const screenRam = new Uint8Array(22 * 23);
    const colorRam = new Uint8Array(22 * 23);
    screenRam.fill(0x20); // space → all bits 0
    colorRam.fill(0x0f); // low nybble = 15 (white)

    const memory = {
      columns: 22, rows: 23, charWidth: 8, charHeight: 8,
      screenRam, colorRam, font, backgroundColorIndex: 0,
      colorModel: 'vic20' as const,
    };

    const target = new Uint8Array(decoder.sourceWidth * decoder.sourceHeight);
    decoder.decode(memory, target, 0);
    expect(target[0]).toBe(0); // space + bg=0 → 0
    // colorRam = 0x0f: low nybble=15 (fg), vic20 ignores high nybble
    expect(target[8 * 23 * 8 + 0]).toBe(0); // next cell also space + bg=0

    // Test with fg color: screenRam = 'A' (solid block)
    screenRam.fill(0x41);
    decoder.decode(memory, target, 0);
    expect(target[0]).toBe(15); // fg from low nybble
  });

  it('mda underline renders bottom 2 rows when fg=1', () => {
    const decoder = new TextModeDecoder(40, 25, 8, 14);
    const font = createDefaultFont(8, 14);
    const screenRam = new Uint8Array(40 * 25);
    const colorRam = new Uint8Array(40 * 25);

    screenRam.fill(0x20);
    colorRam.fill(0x01); // fg=1 (underline), bg=0

    const memory = {
      columns: 40,
      rows: 25,
      charWidth: 8,
      charHeight: 14,
      screenRam,
      colorRam,
      font,
      backgroundColorIndex: 0,
      colorModel: 'mda' as const,
    };

    const target = new Uint8Array(decoder.sourceWidth * decoder.sourceHeight);
    decoder.decode(memory, target, 0);

    // Row 12 (0-indexed) of first char cell = underline → should be fg=1
    expect(target[12 * decoder.sourceWidth]).toBe(1);
    // Row 0 of first char cell = blank space → should be bg=0
    expect(target[0]).toBe(0);
  });
});
