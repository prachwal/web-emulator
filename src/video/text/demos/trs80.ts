import { AttributeTextScreen } from '../AttributeTextScreen';

export function createTrs80Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  const doubleW = cols <= 32;
  w(0, 0, doubleW ? 'TRS-80 MODEL III  32x16' : 'TRS-80 MODEL III  MEMORY SIZE?', 7, 0);
  w(0, 1, '  64K  RADIO SHACK  BASIC', 7, 0);
  w(0, 2, 'READY', 7, 0);
  w(2, 3, '>10 PRINT "HELLO WORLD"', 10, 0);
  w(2, 4, '>20 FOR I=1 TO 10', 10, 0);
  w(2, 5, '>30 PRINT I;', 10, 0);
  w(2, 6, '>40 NEXT I', 10, 0);
  w(2, 7, '>RUN', 14, 0);
  if (rows > 9) {
    w(4, 9, ' 1  2  3  4  5  6  7  8  9 10', 7, 0);
  }
  if (rows > 11) {
    w(0, 11, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
    w(0, 12, '0123456789 .,;:', 7, 0);
    w(0, 13, 'descender: g j p q y', 7, 0);
  }
  if (rows > 15) {
    w(0, 15, (doubleW ? '32x16' : '64x16') + '  CELL 8x12  512x192', 7, 0);
  }
  return s;
}
