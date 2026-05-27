import { AttributeTextScreen } from '../AttributeTextScreen';
import { bar, spacer } from './shared';

export function createMdaDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 2, 0);
  const w = (x: number, y: number, t: string, f = 2, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 1, 'IBM MONOCHROME DISPLAY ADAPTER', 2, 0);
  w(0, 2, '720 x 350  80 x 25  9x14 FONT', 2, 0);
  w(0, 4, '---', 10, 0);
  w(0, 5, 'TEXT ONLY  NO GRAPHICS MODE', 10, 0);
  w(0, 6, '4K VRAM AT B000:0000', 10, 0);
  w(0, 7, 'ATTRIB: FG BG BLINK UNDERLINE', 10, 0);
  w(0, 9, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
  w(0, 10, 'abcdefghijklmnopqrstuvwxyz', 7, 0);
  w(0, 11, '0123456789 .,;:!?()[]{}', 7, 0);
  w(0, 13, 'The quick brown fox jumps over', 2, 0);
  w(0, 14, 'the lazy dog 0123456789.', 2, 0);
  if (rows > 16) {
    w(0, 16, 'HGC: 720x348 BITMAP', 2, 0);
  }
  return s;
}
