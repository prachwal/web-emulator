import { AttributeTextScreen } from '../AttributeTextScreen';

export function createEpsonPx8Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'EPSON PX-8  CP/M 80x8 LCD', 1, 0);
  w(0, 1, '  8086  64K  ROM-BASED SW', 1, 0);
  w(1, 3, '10 PRINT "HELLO PX-8"', 1, 0);
  w(1, 4, '20 GOTO 10', 1, 0);
  w(1, 5, '>RUN', 1, 0);
  if (rows > 7) {
    return s;
  }
  w(0, 7, 'HELLO PX-8', 1, 0);
  return s;
}
