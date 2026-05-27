import { AttributeTextScreen } from '../AttributeTextScreen';

export function createCpc464Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'Amstrad CPC 464  Locomotive BASIC 1.0', 1, 0);
  w(0, 1, cols >= 80 ? '64K Z80A  16MHz  27 COLOURS  CASSETTE' : '64K Z80A  27 COL', 1, 0);
  w(1, 3, '10 PRINT "HELLO FROM CPC 464"', 1, 0);
  w(1, 4, '20 FOR i=1 TO 5', 1, 0);
  w(1, 5, '30 PRINT i', 1, 0);
  w(1, 6, '40 NEXT i', 1, 0);
  w(1, 7, 'RUN', 1, 0);
  if (rows > 9) w(4, 9, ' 1  2  3  4  5', 1, 0);
  if (rows > 11) {
    w(0, 11, 'Ready', 1, 0);
    w(1, 13, 'Mode 0: 160x200  16c  20 col', 1, 0);
    w(1, 14, 'Mode 1: 320x200  4c   40 col', 1, 0);
    w(1, 15, 'Mode 2: 640x200  2c   80 col', 1, 0);
  }
  if (rows > 17) w(1, 17, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
  if (rows > 18) w(1, 18, '0123456789 .,;:!?()[]{}', 1, 0);
  return s;
}

export function createCpc664Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'Amstrad CPC 664  Locomotive BASIC 1.1', 1, 0);
  w(0, 1, '64K Z80A  3" FLOPPY  CP/M 2.2', 1, 0);
  w(1, 3, '10 PRINT "CPC 664 WITH DISK"', 1, 0);
  w(1, 4, '20 SAVE"DEMO', 1, 0);
  w(1, 5, '30 RUN', 1, 0);
  w(0, 7, 'Ready', 1, 0);
  w(1, 9, '640x200  80 col  GREEN SCREEN', 1, 0);
  if (rows > 11) {
    w(1, 11, 'AMSDOS  |CPM  KEYBOARD', 1, 0);
    w(1, 13, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(1, 14, '0123456789 .,;:!?()[]{}', 1, 0);
  }
  return s;
}

export function createCpc6128Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'Amstrad CPC 6128  Locomotive BASIC 1.1', 1, 0);
  w(0, 1, '128K Z80A  CP/M 3.1  3" FLOPPY', 1, 0);
  w(1, 3, '10 MEMORY 49999', 1, 0);
  w(1, 4, '20 SYMBOL AFTER 256', 1, 0);
  w(1, 5, '30 MODE 2', 1, 0);
  w(1, 6, '40 PRINT "CPC 6128  128K"', 1, 0);
  w(1, 7, '50 RUN', 1, 0);
  w(0, 9, 'Ready', 1, 0);
  if (rows > 11) {
    w(1, 11, '128K RAM  BANK SWITCHING', 1, 0);
    w(1, 12, 'CP/M 3.1  AMSDOS  RS-232', 1, 0);
  }
  if (rows > 14) {
    w(1, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(1, 15, '0123456789 .,;:!?()[]{}', 1, 0);
  }
  return s;
}
