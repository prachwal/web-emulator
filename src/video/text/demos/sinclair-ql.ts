import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer } from './shared';

export function createSinclairQlDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 2, 0);
  const w = (x: number, y: number, t: string, f = 2, b = 0) => s.writeText(x, y, t, f, b);
  const top = bar(cols, '-');
  w(0, 0, top, 1, 0);
  w(0, 1, spacer(cols, 'Sinclair QL   QDOS  68008'), 1, 0);
  w(0, 2, top, 1, 0);
  w(1, 4, '10 PRINT "HELLO FROM QL"', 3, 0);
  w(1, 5, '20 FOR i=1 TO 5', 3, 0);
  w(1, 6, '30 PRINT i', 3, 0);
  w(1, 7, '40 NEXT i', 3, 0);
  w(1, 8, 'RUN', 3, 0);
  if (rows > 10) w(4, 10, '1 2 3 4 5', 3, 0);
  if (rows > 12) {
    w(0, 12, 'Ready', 2, 0);
    w(1, 14, 'Mode 4: 512x256  4 col  64x24', 2, 0);
    w(1, 15, 'Mode 8: 256x256  8 col  32x24', 2, 0);
  }
  if (rows > 17) w(1, 17, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
  if (rows > 18) w(1, 18, '0123456789 .,;:!?()[]{}', 1, 0);
  w(0, rows - 1, top, 1, 0);
  return s;
}
