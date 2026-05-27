import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer, colorRow, commodoreGraphics } from './shared';

export function createC64Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 14);
  const w = (x: number, y: number, t: string, f = 1, b = 14) => s.writeText(x, y, t, f, b);
  const pg = (x: number, y: number, codes: number[], f = 1, b = 14) => {
    for (let i = 0; i < codes.length; i++) s.putChar(x + i, y, codes[i], f, b);
  };
  const top = bar(cols, '*');
  w(0, 0, top, 7, 12);
  w(0, 1, spacer(cols, '**** COMMODORE 64 BASIC ****'), 7, 12);
  w(0, 2, top, 7, 12);
  w(2, 4, '10 PRINT CHR$(205.5+RND(1));', 13, 6);
  w(2, 5, '20 GOTO 10', 13, 6);
  w(2, 6, 'RUN', 5, 6);
  if (rows > 8) {
    w(2, 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 14);
    w(2, 9, '0123456789  16 COLORS', 1, 14);
    if (cols > 28) {
      colorRow(s, 22, 9, 2, 8, 14);
    }
    if (cols > 10) {
      pg(2, 10, commodoreGraphics, 1, 14);
      w(2, 11, 'PETSCII CHR$(192-207)', 3, 14);
    }
    w(2, 12, 'COLOR RAM $D800 nybble', 7, 6);
  }
  if (rows > 14) {
    w(2, 14, 'VIC-II: 320x200 16c BM', 7, 6);
    w(2, 15, 'VIC-II: 160x200 4c MC', 7, 6);
    w(2, 16, 'SID:    3xOSC + FILTER', 7, 6);
    w(2, 17, 'CIA:    $DC00 $DD00', 7, 6);
  }
  w(0, rows - 1, top, 7, 12);
  return s;
}
