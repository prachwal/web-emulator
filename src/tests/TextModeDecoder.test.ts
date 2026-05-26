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
});
