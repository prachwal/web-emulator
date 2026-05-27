import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer } from './shared';

export function createC128Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'COMMODORE 128  VDC 80-COLUMN MODE', 2, 0);
  w(0, 1, '128K  Z80+8502  CP/M 3.0  BASIC 7.0', 3, 0);
  w(1, 3, '10 PRINT "HELLO FROM C128"', 1, 0);
  w(1, 4, '20 FAST', 1, 0);
  w(1, 5, '30 FOR I=1 TO 5', 1, 0);
  w(1, 6, '40 PRINT I', 1, 0);
  w(1, 7, '50 NEXT', 1, 0);
  w(1, 8, 'RUN', 3, 0);
  if (rows > 10) w(4, 10, '1 2 3 4 5', 1, 0);
  if (rows > 12) {
    w(0, 12, 'Ready.', 2, 0);
    w(1, 14, 'VDC 8563: 640x200  80x25', 1, 0);
    w(1, 15, 'VIC-II:  320x200  40x25', 1, 0);
  }
  if (rows > 17) w(1, 17, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2, 0);
  if (rows > 18) w(1, 18, '0123456789 .,;:!?()[]{}', 1, 0);
  return s;
}

export function createC128ViciiDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 14);
  const w = (x: number, y: number, t: string, f = 1, b = 14) => s.writeText(x, y, t, f, b);
  const top = bar(cols, '*');
  w(0, 0, top, 7, 12);
  w(0, 1, spacer(cols, '** COMMODORE 128 VIC-II MODE **'), 7, 12);
  w(0, 2, top, 7, 12);
  w(2, 4, '10 KEY 1,"DIR"+CHR$(13)', 13, 6);
  w(2, 5, '20 DLOAD"PROGRAM', 13, 6);
  w(2, 7, 'C128  C64  CP/M  MODES', 5, 6);
  return s;
}
