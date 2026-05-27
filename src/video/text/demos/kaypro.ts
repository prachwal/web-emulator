import { AttributeTextScreen } from '../AttributeTextScreen';

export function createKayproDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 2, 0);
  const w = (x: number, y: number, t: string, f = 2, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'KAYPRO II  CP/M 80x25', 2, 0);
  w(0, 1, '  64K Z80A  9" GREEN CRT', 2, 0);
  w(2, 3, 'A>dir', 10, 0);
  w(2, 4, 'A: WS COM    A: WSMSGS OVR', 10, 0);
  w(2, 5, 'A: SUPERCLCK OVR  MBASIC COM', 10, 0);
  w(2, 6, 'A: WSOVLY1 OVR   S-BASIC COM', 10, 0);
  w(2, 7, 'A>', 10, 0);
  w(0, 9, '---', 2, 0);
  w(2, 10, '10 PRINT "HELLO FROM KAYPRO"', 10, 0);
  w(2, 11, '20 FOR I=1 TO 5', 10, 0);
  w(2, 12, '30 PRINT I;" ";', 10, 0);
  w(2, 13, '40 NEXT I', 10, 0);
  w(2, 14, 'RUN', 14, 0);
  w(4, 15, '1  2  3  4  5', 10, 0);
  w(0, 17, 'READY.', 10, 0);
  w(1, 19, 'ADM-3A TERMINAL  SY6545 CRTC', 2, 0);
  w(1, 20, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2, 0);
  w(1, 21, '0123456789 .,;:!?()[]{}', 2, 0);
  return s;
}
