import { AttributeTextScreen } from '../AttributeTextScreen';

export function createRainbowDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'DEC RAINBOW 100  CP/M+MSDOS', 1, 0);
  w(0, 1, '  Z80+8088  DUAL CPU  12" GREEN', 1, 0);
  w(1, 3, '10 PRINT "HELLO FROM RAINBOW"', 1, 0);
  w(1, 4, '20 GOTO 10', 1, 0);
  w(1, 5, '>RUN', 1, 0);
  if (rows > 7) {
    w(2, 7, 'HELLO FROM RAINBOW', 1, 0);
  }
  if (rows > 10) {
    w(0, 10, 'Rainbow 100  Video:', 1, 0);
    w(0, 11, '80x24  8x10 cell  640x240', 1, 0);
    w(0, 12, 'CP/M + MS-DOS  64-256KB', 1, 0);
  }
  if (rows > 15) {
    w(0, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(0, 16, '0123456789 .,;:!?', 1, 0);
  }
  return s;
}
