import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer } from './shared';

/** ZX Spectrum attribute: auto-detect BRIGHT from ink>=8 */
function zxAttr(ink: number, paper: number, flash = false): number {
  const bright = ink >= 8 ? 0x40 : 0;
  return (paper & 0x07) << 3 | (ink & 0x07) | bright | (flash ? 0x80 : 0);
}

export function createZxDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, zxAttr(7, 0), 0);
  const w = (x: number, y: number, t: string, ink = 7, paper = 0) =>
    s.writeText(x, y, t, zxAttr(ink, paper), 0);
  const top = bar(cols, '=');
  w(0, 0, top, 2, 0);
  w(0, 1, spacer(cols, 'ZX SPECTRUM  256x192 ATTR'), 6, 0);
  w(0, 2, top, 2, 0);
  w(1, 4, '10 PRINT "HELLO WORLD"', 7, 0);
  w(1, 5, '20 GOTO 10', 7, 0);
  w(4, 7, 'HELLO WORLD', 15, 0);
  w(4, 8, 'HELLO WORLD', 15, 0);
  if (rows > 10) {
    w(1, 10, 'ATTR: INK+PAPER  BRIGHT+8  FLASH', 6, 0);
    for (let i = 0; i < 8 && i + 1 < cols; i++) {
      s.putChar(i + 1, 11, 0xdb, zxAttr(7, i), 0);
      s.putChar(i + 1, 12, 0xdb, zxAttr(15, i), 0); // bright INK
    }
    for (let i = 0; i < 4 && i < cols; i++) {
      s.putChar(i * 2 + 1, 13, 'F'.charCodeAt(0), zxAttr(7, i, true), 0); // flash
    }
  }
  if (rows > 14) {
    w(1, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
    w(1, 15, '0123456789 .,!?;:', 7, 0);
  }
  if (rows > 17) {
    w(1, 17, 'PAPER 1 INK 7  BRIGHT +8', 5, 1);
    w(1, 18, 'FLASH bit 7  BORDER idx', 5, 0);
  }
  w(0, rows - 1, top, 2, 0);
  return s;
}
