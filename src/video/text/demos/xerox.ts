import { AttributeTextScreen } from '../AttributeTextScreen';

export function createXeroxDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'XEROX 820-II  CP/M 80x24', 1, 0);
  w(0, 1, '  Z80  64K  DUAL 8" SSDD FLOPPIES', 1, 0);
  w(1, 3, '10 PRINT "HELLO FROM XEROX"', 1, 0);
  w(1, 4, '20 GOTO 10', 1, 0);
  w(1, 5, '>RUN', 1, 0);
  if (rows > 7) {
    w(2, 7, 'HELLO FROM XEROX', 1, 0);
  }
  if (rows > 10) {
    w(0, 10, 'Xerox 820-II  Video:', 1, 0);
    w(0, 11, '80x24  8x8  MONITOR', 1, 0);
    w(0, 12, 'CP/M 2.2  WORDSTAR', 1, 0);
  }
  if (rows > 15) {
    w(0, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(0, 16, '0123456789 .,;:!?', 1, 0);
  }
  return s;
}
