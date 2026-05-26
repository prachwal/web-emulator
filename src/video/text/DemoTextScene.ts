import { AttributeTextScreen } from './AttributeTextScreen';
import { TextScreen } from './TextScreen';

function bar(cols: number, chr = '-'): string {
  return '+' + chr.repeat(cols - 2) + '+';
}

function spacer(cols: number, label: string): string {
  const inner = '| ' + label + ' '.repeat(Math.max(0, cols - label.length - 4)) + '|';
  return inner;
}

function createZxDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 15, 0);
  const w = (x: number, y: number, t: string, f = 15, b = 0) => s.writeText(x, y, t, f, b);
  const top = bar(cols, '=');
  w(0, 0, top, 6, 0);
  w(0, 1, spacer(cols, 'ZX SPECTRUM DEMO'), 5, 0);
  w(0, 2, top, 6, 0);
  w(1, 4, '10 PRINT "HELLO WORLD"', 7, 0);
  w(1, 5, '20 GOTO 10', 7, 0);
  w(1, 6, 'RUN', 10, 0);
  w(4, 8, 'HELLO WORLD', 15, 0);
  w(4, 9, 'HELLO WORLD', 15, 0);
  if (rows > 11) {
    w(1, 11, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12, 0);
    w(1, 12, '0123456789 .,!?;:', 13, 0);
  }
  if (rows > 14) {
    w(1, 14, 'SCREEN$ = CHR$(8*64)', 6, 0);
    w(1, 15, 'PLOT  128,96', 6, 0);
  }
  if (rows > 17) {
    w(1, 17, 'PAPER 1: INK 7: BORDER 0', 5, 0);
    for (let i = 0; i < 8 && i + 11 < cols; i++) {
      w(11 + i * 2, 18, `${i}`, i + 1, 0);
    }
    for (let i = 0; i < 8 && i + 11 < cols; i++) {
      w(11 + i * 2, 19, `${i + 8}`, i + 9, 0);
    }
  }
  w(0, rows - 1, bar(cols, '='), 6, 0);
  return s;
}

function createC64Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 14);
  const w = (x: number, y: number, t: string, f = 1, b = 14) => s.writeText(x, y, t, f, b);
  const top = bar(cols, '*');
  w(0, 0, top, 7, 12);
  w(0, 1, spacer(cols, '**** COMMODORE 64 BASIC ****'), 7, 12);
  w(0, 2, top, 7, 12);
  w(2, 4, '10 PRINT CHR$(205.5+RND(1));', 13, 6);
  w(2, 5, '20 GOTO 10', 13, 6);
  w(2, 6, 'RUN', 5, 6);
  if (rows > 8) {
    w(2, 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 14);
    w(2, 9, '0123456789', 1, 14);
    if (cols > 16) {
      for (let i = 0; i < 8; i++) w(16 + i, 8, '' + i, i + 2, 14);
    }
    w(2, 10, 'POKE 53280,0 : POKE 53281,0', 3, 14);
    w(2, 11, 'SYS 49152', 3, 14);
    w(2, 12, 'COLOR RAM $D800 nybble', 7, 6);
  }
  if (rows > 14) {
    w(2, 14, 'VIC-II: $D000-$D02F', 7, 6);
    w(2, 15, 'SID:    $D400-$D418', 7, 6);
    w(2, 16, '16 COLORS  8 SPRITES', 7, 6);
    w(2, 17, '320x200 / 160x200 MC', 7, 6);
  }
  w(0, rows - 1, top, 7, 12);
  return s;
}

function createCgaDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, bar(cols), 7, 0);
  w(0, 1, spacer(cols, 'IBM CGA DEMO'), 7, 0);
  w(0, 2, bar(cols), 7, 0);
  w(2, 4, '10 SCREEN 1', 7, 0);
  w(2, 5, '20 LINE (0,0)-(319,199)', 7, 0);
  w(2, 6, '30 CIRCLE (160,100),50', 7, 0);
  w(2, 7, '40 PAINT (160,100)', 7, 0);
  if (rows > 9) {
    w(2, 9, 'MODE 80x25:  COLOR 7,0', 7, 0);
  }
  if (rows > 11) {
    w(2, 11, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 15, 0);
    w(2, 12, 'abcdefghijklmnopqrstuvwxyz', 7, 0);
    w(2, 13, '0123456789 .,;:!?', 7, 0);
  }
  w(0, rows - 1, bar(cols), 7, 0);
  return s;
}

function createPetDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const model = cols >= 80 ? '4032 (80 COL)' : '2001 (40 COL)';
  w(0, 0, bar(cols), 2, 0);
  w(0, 1, spacer(cols, 'COMMODORE PET ' + model), 2, 0);
  w(0, 2, bar(cols), 2, 0);
  w(2, 4, '10 PRINT "HELLO"', 1, 0);
  w(2, 5, '20 INPUT A$', 1, 0);
  w(2, 6, '30 PRINT A$', 1, 0);
  w(2, 7, '40 GOTO 20', 1, 0);
  if (rows > 9) {
    w(2, 9, 'PET ' + (cols >= 80 ? '4032' : '2001') + ': IEEE-488', 3, 0);
    w(2, 10, cols >= 80 ? '32K RAM  BASIC 4.0' : '16K RAM  BASIC 1.0', 3, 0);
  }
  if (rows > 12) {
    w(2, 12, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(2, 13, '0123456789', 1, 0);
  }
  w(0, rows - 1, bar(cols), 2, 0);
  return s;
}

function createMdaDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 2, b = 0) => s.writeText(x, y, t, f, b);
  w(2, 1, 'IBM MONOCHROME DISPLAY ADAPTER', 2, 0);
  w(2, 2, '720 x 350   80 x 25', 2, 0);
  w(1, 4, '---', 10, 0);
  w(1, 5, '9x14 character cell', 10, 0);
  w(1, 6, '4K video RAM at B000:0000', 10, 0);
  w(1, 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
  w(1, 9, 'abcdefghijklmnopqrstuvwxyz', 7, 0);
  w(1, 10, '0123456789', 7, 0);
  w(1, 12, 'The quick brown fox jumps', 2, 0);
  w(1, 13, 'over the lazy dog 012345', 2, 0);
  return s;
}

function createTrs80Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'TRS-80 MODEL III  MEMORY SIZE?', 7, 0);
  w(0, 1, '  64K  RADIO SHACK  BASIC', 7, 0);
  w(0, 2, 'READY', 7, 0);
  w(2, 3, '>10 PRINT "HELLO WORLD"', 10, 0);
  w(2, 4, '>20 FOR I=1 TO 10', 10, 0);
  w(2, 5, '>30 PRINT I;', 10, 0);
  w(2, 6, '>40 NEXT I', 10, 0);
  w(2, 7, '>RUN', 14, 0);
  if (rows > 9) {
    w(4, 9, ' 1  2  3  4  5  6  7  8  9 10', 7, 0);
  }
  if (rows > 11) {
    w(0, 11, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
    w(0, 12, '0123456789 .,;:', 7, 0);
  }
  if (rows > 14) {
    w(0, 14, 'READY.', 7, 0);
  }
  return s;
}

function createApple1Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const wi = (x: number, y: number, t: string, f = 1, b = 0) => {
    for (let i = 0; i < t.length; i++) s.putChar(x + i, y, t.charCodeAt(i) | 0x80, f, b);
  };
  w(0, 0, 'APPLE 1  |  WOZ MONITOR', 2, 0);
  w(0, 1, bar(cols, '\\'), 2, 0);
  wi(0, 2, bar(cols, '='), 0, 1);
  wi(0, 3, ' APPLE 1 DEMO ', 0, 1);
  wi(0, 4, bar(cols, '='), 0, 1);
  w(1, 6, '\\]10 PRINT "HELLO"', 1, 0);
  w(1, 7, '\\]20 GOTO 10', 1, 0);
  w(1, 8, '\\]RUN', 10, 0);
  if (rows > 10) {
    w(4, 10, 'HELLO', 1, 0);
  }
  if (rows > 12) {
    w(1, 12, '\\].R', 6, 0);
    w(1, 13, 'A=0.A0: 00 00 00 00', 6, 0);
  }
  if (rows > 15) {
    w(1, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(1, 16, '0123456789', 1, 0);
  }
  return s;
}

function createVic20Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  w(0, 0, 'VIC-20  BASIC', 7, 6);
  w(0, 1, ' 3583 BYTES FREE', 7, 6);
  w(0, 3, 'READY.', 7, 6);
  w(1, 4, '10 PRINT "HELLO"', 7, 6);
  w(1, 5, '20 POKE 36879,27', 7, 6);
  w(1, 7, 'VIC CHIP: 6560/6561', 3, 6);
  w(1, 8, '22 COLUMNS x 23 ROWS', 3, 6);
  if (rows > 10) {
    w(1, 10, 'COLOR 0-15:', 7, 6);
    for (let c = 0; c < 8 && c + 11 < cols; c++) {
      w(11 + c, 11, `${c}`, c + 1, 6);
    }
    for (let c = 0; c < 8 && c + 11 < cols; c++) {
      w(11 + c, 12, `${c + 8}`, c + 9, 6);
    }
  }
  if (rows > 14) {
    w(0, 14, '4-BIT COLOR RAM', 1, 6);
    w(0, 15, '176x184 BITMAP', 1, 6);
    w(0, 16, 'NO SPRITES (VIC-I)', 1, 6);
  }
  if (rows > 18) {
    w(0, 18, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 6);
    w(0, 19, '0123456789', 7, 6);
  }
  return s;
}

function createGenericDemo(cols: number, rows: number): AttributeTextScreen {
  const screen = new AttributeTextScreen(cols, rows);
  screen.clear(32, 15, 0);
  const w = (x: number, y: number, t: string, f = 15, b = 0) => screen.writeText(x, y, t, f, b);
  const top = bar(cols);
  w(0, 0, top, 14, 0);
  w(0, 1, spacer(cols, 'CRT EMULATOR'), 14, 0);
  w(0, 2, top, 14, 0);
  w(2, 4, '10 PRINT "HELLO WORLD"', 7, 0);
  w(2, 5, '20 GOTO 10', 7, 0);
  w(2, 6, 'RUN', 10, 0);
  w(4, 8, 'HELLO WORLD', 15, 0);
  w(4, 9, 'HELLO WORLD', 15, 0);
  w(2, 11, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12, 0);
  w(2, 12, '0123456789', 13, 0);
  w(0, rows - 1, top, 14, 0);
  return screen;
}

const demoFns: Record<string, (c: number, r: number) => AttributeTextScreen> = {
  zx: createZxDemo,
  c64: createC64Demo,
  cga: createCgaDemo,
  pet: createPetDemo,
  mda: createMdaDemo,
  trs80: createTrs80Demo,
  apple1: createApple1Demo,
  vic20: createVic20Demo,
};

export function createDemoForMachine(
  machineId: string,
  columns: number,
  rows: number,
): AttributeTextScreen {
  const fn = demoFns[machineId] ?? createGenericDemo;
  return fn(columns, rows);
}

export function createDemoTextScreen(columns: number, rows: number): AttributeTextScreen {
  return createGenericDemo(columns, rows);
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

export function createDiagnosticScreen(columns: number, rows: number): AttributeTextScreen {
  const screen = new AttributeTextScreen(columns, rows);
  screen.clear(32, 15, 0);
  screen.writeText(0, 0, 'TL ABC123', 15, 0);
  screen.writeText(columns - 2, 0, 'TR', 14, 0);
  screen.writeText(0, 3, 'AAA', 10, 0);
  screen.writeText(0, 4, 'BBB', 11, 0);
  screen.writeText(0, 5, 'CCC', 12, 0);
  screen.writeText(0, rows - 1, 'BL', 13, 0);
  screen.writeText(columns - 2, rows - 1, 'BR', 9, 0);
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
