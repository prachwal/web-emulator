import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer } from './shared';

export function createZx128Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  const top = bar(cols, '=');
  w(0, 0, top, 2, 0);
  w(0, 1, spacer(cols, 'ZX SPECTRUM 128  128K AY-3-8912'), 6, 0);
  w(0, 2, top, 2, 0);
  w(1, 4, '10 PRINT "SPECTRUM 128"', 7, 0);
  w(1, 5, '20 PLAY "CDEFG"', 6, 0);
  w(1, 6, '30 FOR f=1 TO 10', 7, 0);
  w(1, 7, '40 PRINT f', 7, 0);
  w(1, 8, '50 NEXT f', 7, 0);
  w(1, 9, 'RUN', 14, 0);
  if (rows > 11) {
    w(4, 11, '1 2 3 4 5 6 7 8 9 10', 10, 0);
    w(0, 13, '128K RAM  AY SOUND  +3 DISK', 5, 0);
  }
  if (rows > 15) {
    w(1, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
    w(1, 16, '0123456789 .,!?;:', 7, 0);
  }
  w(0, rows - 1, top, 2, 0);
  return s;
}
