import { describe, it, expect, beforeEach } from 'vitest';
import { AttributeTextScreen } from '../../video/text/AttributeTextScreen';
import { createDefaultFont } from '../../video/BitmapFont';
import { asciiCharMapper, petsciiCharMapper } from '../../video/text/CharMapper';
import { renderHeadlessText } from '../../video/text/HeadlessTextRenderer';
import { hashBuffer, expectGolden, resetGoldens } from './GoldenSnapshot';

beforeEach(() => resetGoldens());

describe('golden: text rendering', () => {
  it('ASCII 40x25 text screen', () => {
    const screen = new AttributeTextScreen(40, 25);
    screen.clear(32, 7, 0);
    screen.writeText(0, 0, 'HELLO CRT EMULATOR', 15, 0);
    screen.writeText(0, 1, '40x25  ASCII  GOLDEN', 7, 0);
    for (let i = 0; i < 26 && i + 2 < 40; i++) {
      screen.putChar(i + 2, 3, 0x41 + i, i < 8 ? i + 1 : 7, 0);
    }
    screen.writeText(0, 5, '0123456789 ABC abc', 7, 0);
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({ screen, font, mapper: asciiCharMapper });
    const h = hashBuffer(result.indexed);
    expectGolden('ascii-40x25', h);
    // verify non-zero hash
    expect(h).not.toBe(hashBuffer(new Uint8Array(result.indexed.length)));
  });

  it('ZX Spectrum attributes (INK/PAPER/BRIGHT/FLASH)', () => {
    const screen = new AttributeTextScreen(32, 24);
    screen.clear(32, 7, 0);
    // INK/PAPER test
    screen.putChar(1, 1, 0xdb, 0x07, 0); // attr: INK=7, PAPER=0 (white on black)
    screen.putChar(2, 1, 0xdb, 0x38, 0); // attr: PAPER=7, INK=0 (black on white, swapped)
    // BRIGHT test
    screen.putChar(4, 1, 0xdb, 0x47, 0); // attr: INK=7, PAPER=0, BRIGHT=1 (0x40)
    // FLASH test (frame 0 = visible)
    screen.putChar(6, 1, 0xdb, 0x87, 0); // attr: INK=7, PAPER=0, FLASH=1 (0x80)
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({
      screen, font, mapper: asciiCharMapper,
      options: { zxAttr: screen.foreground, frameNumber: 0 },
    });
    const h = hashBuffer(result.indexed);
    expectGolden('zx-attributes', h);
  });

  it('ZX FLASH alternates with frameNumber', () => {
    const screen = new AttributeTextScreen(8, 1);
    screen.clear(32, 0, 0);
    screen.putChar(1, 0, 0xdb, 0x87, 0); // attr: INK=7, PAPER=0, FLASH=1

    const font = createDefaultFont(8, 8);
    // frame 0: FLASH off -> INK=7 (fg) visible
    const r0 = renderHeadlessText({
      screen, font, mapper: asciiCharMapper,
      options: { zxAttr: screen.foreground, frameNumber: 0 },
    });
    // frame 16: FLASH on -> INK/PAPER swapped -> all bg (PAPER=0 = black)
    const r16 = renderHeadlessText({
      screen, font, mapper: asciiCharMapper,
      options: { zxAttr: screen.foreground, frameNumber: 16 },
    });
    const h0 = hashBuffer(r0.indexed);
    const h16 = hashBuffer(r16.indexed);
    expectGolden('zx-flash-frame0', h0);
    expectGolden('zx-flash-frame16', h16);
    expect(h0).not.toBe(h16);
  });

  it('Apple 1 inverse bit (MSB=1 swaps fg/bg)', () => {
    const screen = new AttributeTextScreen(40, 1);
    screen.clear(32, 7, 0);
    screen.putChar(0, 0, 0x41, 7, 0);       // normal 'A'
    screen.putChar(2, 0, 0x41 | 0x80, 7, 0); // inverse 'A' (MSB set)
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({
      screen, font, mapper: asciiCharMapper,
      options: { invertMsb: true },
    });
    const h = hashBuffer(result.indexed);
    expectGolden('apple1-inverse', h);
  });

  it('font with cellWidth > charWidth (padding)', () => {
    const screen = new AttributeTextScreen(4, 1);
    screen.clear(32, 1, 0);
    screen.putChar(0, 0, 0x41, 1, 0); // 'A'
    screen.putChar(2, 0, 0x42, 1, 0); // 'B'

    // Create a font with 6px glyph in 8px cell
    const font = createDefaultFont(8, 8);
    const paddedFont = { ...font, cellWidth: 10, cellHeight: 8 };

    const result = renderHeadlessText({ screen, font: paddedFont, mapper: asciiCharMapper });
    const h = hashBuffer(result.indexed);
    expectGolden('font-cell-padding', h);
  });

  it('PETSCII mapper (C64 charset)', () => {
    const screen = new AttributeTextScreen(40, 5);
    screen.clear(32, 1, 0);
    screen.writeText(0, 0, '**** COMMODORE 64 BASIC V2 ****', 1, 0);
    screen.writeText(0, 1, ' 64K RAM SYSTEM  38911 BASIC BYTES FREE', 1, 0);
    screen.writeText(0, 3, 'READY.', 1, 0);
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({ screen, font, mapper: petsciiCharMapper });
    const h = hashBuffer(result.indexed);
    expectGolden('petscii-c64-boot', h);
  });
});
