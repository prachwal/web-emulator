import { AttributeTextScreen } from './AttributeTextScreen';
import { TextScreen } from './TextScreen';

export function createDemoTextScreen(columns: number, rows: number): AttributeTextScreen {
  const screen = new AttributeTextScreen(columns, rows);
  screen.clear(32, 15, 0);

  const w = (x: number, y: number, t: string, f = 15, b = 0) =>
    screen.writeText(x, y, t, f, b);

  w(1, 1,  '╔══════════════════════════════════════╗', 14, 0);
  w(1, 2,  '║        CRT EMULATOR — TEXT MODE       ║', 14, 0);
  w(1, 3,  '╚══════════════════════════════════════╝', 14, 0);

  w(1, 5,  ' Fonts:', 11, 0);
  w(1, 6,  '   ZX Spectrum    C64 CHARGEN    PET 2001', 7, 0);
  w(1, 7,  '   Apple 1        IBM CGA        TRS-80 ', 7, 0);

  w(1, 9,  ' Colours:', 11, 0);
  for (let c = 0; c < 16; c++) {
    if (c < 8) {
      w(3 + c * 4, 10, ` ${c.toString(16).toUpperCase()} `, c, 0);
    } else {
      w(3 + (c - 8) * 4, 11, ` ${c.toString(16).toUpperCase()} `, c, 0);
    }
  }

  w(1, 13, ' Pixel aspect: 0.8333  |  4:3 display', 13, 0);
  w(1, 14, ' Integer scale + CRT scanlines active', 10, 0);

  w(1, 16, ' Character set (0-255):', 11, 0);

  const hex = '0123456789ABCDEF';
  for (let r = 0; r < 16; r++) {
    const rowLabel = hex[r];
    w(1, 17 + r, ` ${rowLabel}0: `, 8, 0);
    for (let c = 0; c < 16; c++) {
      const code = r * 16 + c;
      if (code >= 0x20 && code <= 0x7e) {
        w(5 + c, 17 + r, String.fromCharCode(code), 15, 0);
      }
    }
  }

  w(1, rows - 2, ' Ctrl+P to pause  |  F5 debug  |  Tab focus canvas', 8, 0);

  return screen;
}

export function createBasicDemoScene(columns: number, rows: number): TextScreen {
  const screen = new TextScreen(columns, rows);
  screen.clear(32);

  const t = (x: number, y: number, text: string) => screen.writeText(x, y, text);

  t(2, 1,  'HELLO CRT EMULATOR!');
  t(2, 3,  '10 PRINT "HELLO WORLD"');
  t(2, 4,  '20 GOTO 10');
  t(2, 5,  'RUN');
  t(4, 7,  'HELLO WORLD');
  t(4, 8,  'HELLO WORLD');
  t(4, 9,  'HELLO WORLD');

  t(2, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  t(2, 15, 'abcdefghijklmnopqrstuvwxyz');
  t(2, 16, '0123456789');
  t(2, 17, '!@#$%^&*()_+-=[]{}|;:,.<>?/~`');

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
