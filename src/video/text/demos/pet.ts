import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer, commodoreGraphics } from './shared';

export function createPetDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const wg = (x: number, y: number, t: string, f = 1, b = 0) => {
    for (let i = 0; i < t.length; i++) s.putChar(x + i, y, t.charCodeAt(i) | 0x80, f, b);
  };
  const pg = (x: number, y: number, codes: number[], f = 1, b = 0) => {
    for (let i = 0; i < codes.length; i++) s.putChar(x + i, y, codes[i], f, b);
  };
  const model = cols >= 80 ? '4032 (80 COL)' : '2001 (40 COL)';
  wg(0, 0, bar(cols, '*'), 1, 1);
  wg(0, 1, '*** COMMODORE PET ' + model + ' ***'.padEnd(cols - 2, ' ') + ' ', 1, 1);
  wg(0, 2, bar(cols, '*'), 1, 1);
  w(2, 4, '10 PRINT "HELLO"', 1, 0);
  w(2, 5, '20 INPUT A$', 1, 0);
  w(2, 6, '30 PRINT A$', 1, 0);
  w(2, 7, '40 GOTO 20', 1, 0);
  if (rows > 9) {
    w(2, 9, 'PET ' + (cols >= 80 ? '4032' : '2001'), 1, 0);
    w(2, 10, cols >= 80 ? '80x25  32K  BASIC 4.0' : '40x25  16K  BASIC 1.0', 1, 0);
    w(2, 11, 'IEEE-488  PETSCII  CRTC', 1, 0);
    if (cols > 18) {
      pg(2, 12, commodoreGraphics, 1, 0);
      w(2, 13, 'PETSCII CHR$(192-207)', 1, 0);
    }
  }
  if (rows > 15) {
    w(2, 15, 'UPPER+GRAPHIC  SET', 1, 0);
    w(2, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(2, 17, '0123456789', 1, 0);
    w(2, 18, 'PETSCII GRAPHICS 128-159:', 1, 0);
    if (cols > 16) {
      const gfx: number[] = [];
      for (let i = 128; i < 160 && gfx.length < cols - 2; i++) gfx.push(i);
      pg(2, 19, gfx, 1, 0);
    }
  }
  if (rows > 21) {
    w(2, 21, 'LOWER+UPPER  SET (shifted)', 1, 0);
    s.writeText(2, 22, 'abcdefghijklmnopqrstuvwxyz', 1, 0);
  }
  return s;
}
