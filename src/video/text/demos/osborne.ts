import { AttributeTextScreen } from '../AttributeTextScreen';

export function createOsborneDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'OSBORNE 1  CP/M 52x24', 1, 0);
  w(0, 1, '  64K Z80  DUAL 5.25" SSDD', 1, 0);
  w(1, 3, '10 PRINT "HELLO FROM OSBORNE"', 1, 0);
  w(1, 4, '20 GOTO 10', 1, 0);
  w(1, 5, '>RUN', 1, 0);
  if (rows > 7) {
    w(2, 7, 'HELLO FROM OSBORNE', 1, 0);
  }
  if (rows > 10) {
    w(0, 10, 'Osborne 1  Video:', 1, 0);
    w(0, 11, '52x24  8x8  5" CRT', 1, 0);
    w(0, 12, 'CP/M 2.2  MBASIC', 1, 0);
  }
  if (rows > 15) {
    w(0, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(0, 16, '0123456789 .,;:!?', 1, 0);
  }
  return s;
}
