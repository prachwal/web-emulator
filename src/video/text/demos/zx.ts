import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer } from './shared';

export function createZxDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
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
      s.putChar(i + 1, 11, 0xdb, 7, i);
      s.putChar(i + 1, 12, 0xdb, i + 8, 0);
    }
  }
  if (rows > 14) {
    w(1, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
    w(1, 15, '0123456789 .,!?;:', 7, 0);
  }
  if (rows > 17) {
    w(1, 17, 'PAPER 1 INK 7  BRIGHT +8', 5, 0);
    w(1, 18, 'FLASH bit 7  BORDER idx', 5, 0);
  }
  w(0, rows - 1, top, 2, 0);
  return s;
}
