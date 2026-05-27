import { AttributeTextScreen } from '../AttributeTextScreen';
import { commodoreGraphics } from './shared';

export function createVic20Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const pg = (x: number, y: number, codes: number[], f = 1, b = 0) => {
    for (let i = 0; i < codes.length; i++) s.putChar(x + i, y, codes[i], f, b);
  };
  w(0, 0, 'VIC-20  BASIC', 7, 6);
  w(0, 1, ' 3583 BYTES FREE', 7, 6);
  w(0, 3, 'READY.', 7, 6);
  w(1, 4, '10 PRINT "HELLO"', 7, 6);
  w(1, 5, '20 POKE 36879,27', 7, 6);
  w(1, 7, 'VIC CHIP: 6560/6561', 3, 6);
  w(1, 8, '22x23  176x184  NO SPRITES', 3, 6);
  if (rows > 10) {
    w(1, 10, '16-COLOR PALETTE:', 7, 6);
    for (let c = 0; c < 8 && c + 18 < cols; c++) {
      w(18 + c, 10, '' + c, c + 1, 6);
    }
    for (let c = 0; c < 8 && c + 18 < cols; c++) {
      w(18 + c, 11, '' + (c + 8), c + 9, 6);
    }
    w(1, 12, '4-BIT NYBBLE COLOR RAM', 5, 6);
    if (cols > 10) {
      pg(1, 13, commodoreGraphics, 1, 6);
      w(1, 14, 'PETSCII CHR$(192-207)', 1, 6);
    }
  }
  if (rows > 16) {
    w(1, 16, 'ABC XYZ  abc xyz  0123', 7, 6);
    w(1, 17, 'PETSCII 2 SETS CHARGEN', 7, 6);
    w(1, 18, '176x184 BITMAP 1bpp', 7, 6);
  }
  return s;
}
