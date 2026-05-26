import { AttributeTextScreen } from './AttributeTextScreen';
import { TextScreen } from './TextScreen';

export function createDemoTextScreen(columns: number, rows: number): AttributeTextScreen {
  const screen = new AttributeTextScreen(columns, rows);
  screen.clear(32, 15, 0);

  const w = (x: number, y: number, t: string, f = 15, b = 0) =>
    screen.writeText(x, y, t, f, b);

  const bar = '+'.padEnd(columns - 2, '-') + '+';
  w(0, 0, bar, 14, 0);
  w(0, 1, '| CRT EMULATOR ACTIVE' + ' '.repeat(Math.max(0, columns - 23)) + '|', 14, 0);
  w(0, 2, bar, 14, 0);

  w(0, 4, ' Machine: ZX Spectrum', 11, 0);
  w(0, 5, ' Font:    C64 CHARGEN', 10, 0);
  w(0, 6, ' Mode:    40x25 text', 13, 0);

  w(0, 8, ' Colors:', 11, 0);
  for (let c = 0; c < 8 && c + 9 < columns; c++) {
    w(9 + c * 4, 9, `${c}`, c + 1, 0);
    w(9 + c * 4, 10, `${c + 8}`, c + 9, 0);
  }

  w(0, 12, ' 10 PRINT "HELLO WORLD"', 7, 0);
  w(0, 13, ' 20 GOTO 10', 7, 0);
  w(0, 14, ' RUN', 10, 0);
  w(0, 15, ' HELLO WORLD', 15, 0);
  w(0, 16, ' HELLO WORLD', 15, 0);

  w(0, 18, ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12, 0);
  w(0, 19, ' 0123456789', 13, 0);

  if (rows > 21) {
    w(0, rows - 2, ' Ctrl+P pause  F5 debug  ESC', 8, 0);
  }
  w(0, rows - 1, bar, 14, 0);

  return screen;
}

export function createBasicDemoScene(columns: number, rows: number): TextScreen {
  const screen = new TextScreen(columns, rows);
  screen.clear(32);

  const t = (x: number, y: number, text: string) => screen.writeText(x, y, text);

  t(2, 1, 'HELLO CRT EMULATOR!');
  t(2, 3, '10 PRINT "HELLO WORLD"');
  t(2, 4, '20 GOTO 10');
  t(2, 5, 'RUN');
  t(4, 7, 'HELLO WORLD');
  t(4, 8, 'HELLO WORLD');
  t(4, 9, 'HELLO WORLD');
  t(2, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  t(2, 15, 'abcdefghijklmnopqrstuvwxyz');
  t(2, 16, '0123456789');
  t(2, 22, 'READY.');

  return screen;
}

export function createColorTestScreen(columns: number, rows: number): AttributeTextScreen {
  const screen = new AttributeTextScreen(columns, rows);
  screen.clear(32, 15, 0);

  for (let fg = 0; fg < 16; fg++) {
    for (let bg = 0; bg < 16; bg++) {
      if (fg === bg) continue;
      const x = bg % columns;
      const y = fg + 2;
      if (x < columns - 1 && y < rows) {
        screen.putChar(x, y, 0xdb, fg, bg);
      }
    }
  }

  return screen;
}
