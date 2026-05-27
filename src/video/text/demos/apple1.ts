import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar } from './shared';

export function createApple1Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const wi = (x: number, y: number, t: string, f = 1, b = 0) => {
    for (let i = 0; i < t.length; i++) s.putChar(x + i, y, t.charCodeAt(i) | 0x80, f, b);
  };
  w(0, 0, 'APPLE 1  |  WOZ MONITOR', 2, 0);
  w(0, 1, bar(cols, '\\'), 2, 0);
  wi(0, 2, ' INVERTED MSB=1 ', 1, 1);
  wi(0, 3, ' FG <-> BG SWAP ', 1, 1);
  w(1, 5, '\\]10 PRINT "HELLO"', 1, 0);
  w(1, 6, '\\]20 GOTO 10', 1, 0);
  w(1, 7, '\\]RUN', 10, 0);
  if (rows > 9) {
    w(4, 9, 'HELLO', 1, 0);
  }
  if (rows > 11) {
    w(1, 11, '\\].R', 6, 0);
    w(1, 12, 'A=0.A0: 00 00 00 00', 6, 0);
  }
  if (rows > 14) {
    w(1, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(1, 15, '0123456789', 1, 0);
  }
  if (rows > 17) {
    w(1, 17, '40x24  8x8 LSB-FIRST', 1, 0);
    w(1, 18, '6502 @ 1MHz  4KB RAM', 1, 0);
  }
  return s;
}
