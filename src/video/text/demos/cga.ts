import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer, colorRow } from './shared';

export function createCgaDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  const mode40 = cols <= 40;
  w(0, 0, bar(cols), 7, 0);
  w(0, 1, spacer(cols, mode40 ? 'IBM CGA 40x25 320x200' : 'IBM CGA 80x25 640x200'), 7, 0);
  w(0, 2, bar(cols), 7, 0);
  w(2, 4, 'MODE 4: 320x200  4 COLORS', 7, 0);
  w(2, 5, 'MODE 6: 640x200  2 COLORS', 7, 0);
  w(2, 6, mode40 ? 'PAL 0: G/R/Br  PAL1: C/M/W' : '16-COLOR RGBI PALETTE', 7, 0);
  if (rows > 8) {
    w(2, 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 15, 0);
    w(2, 9, 'abcdefghijklmnopqrstuvwxyz', 7, 0);
    w(2, 10, '0123456789 .,;:!?', 7, 0);
  }
  if (rows > 12 && cols > 16) {
    w(2, 12, 'CGA PALETTE:', 7, 0);
    colorRow(s, 2, 13, 0, 8, 0);
    colorRow(s, 2, 14, 8, 8, 0);
  }
  w(0, rows - 1, bar(cols), 7, 0);
  return s;
}
