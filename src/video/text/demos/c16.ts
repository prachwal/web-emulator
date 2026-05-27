import { AttributeTextScreen } from '../AttributeTextScreen';

export function createC16Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'COMMODORE 16  TED 40x25', 1, 0);
  w(0, 1, '  320x200  128 COLORS', 1, 0);
  w(1, 3, '10 PRINT "HELLO C16"', 1, 0);
  w(1, 4, '20 GOTO 10', 1, 0);
  w(1, 5, '>RUN', 1, 0);
  if (rows > 7) {
    w(2, 7, 'HELLO C16', 1, 0);
  }
  if (rows > 10) {
    w(0, 10, 'Commodore 16  Video:', 1, 0);
    w(0, 11, '40x25  8x8  TED 7360', 1, 0);
    w(0, 12, '16K RAM  BASIC 2.0', 1, 0);
  }
  if (rows > 15) {
    w(0, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(0, 16, '0123456789 .,;:!?', 1, 0);
  }
  return s;
}

export function createPlus4Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'COMMODORE PLUS/4  TED 40x25', 1, 0);
  w(0, 1, '  320x200  128 COLORS', 1, 0);
  w(1, 3, '10 PRINT "HELLO PLUS/4"', 1, 0);
  w(1, 4, '20 GOTO 10', 1, 0);
  w(1, 5, '>RUN', 1, 0);
  if (rows > 7) {
    w(2, 7, 'HELLO PLUS/4', 1, 0);
  }
  if (rows > 10) {
    w(0, 10, 'Commodore Plus/4  Video:', 1, 0);
    w(0, 11, '40x25  8x8  TED 7360', 1, 0);
    w(0, 12, '64K RAM  BASIC 3.5', 1, 0);
  }
  if (rows > 15) {
    w(0, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(0, 16, '0123456789 .,;:!?', 1, 0);
  }
  return s;
}
