import { AttributeTextScreen } from './AttributeTextScreen';
import { TextScreen } from './TextScreen';

function bar(cols: number, chr = '-'): string {
  return '+' + chr.repeat(Math.max(0, cols - 2)) + '+';
}

function spacer(cols: number, label: string): string {
  const inner = '| ' + label + ' '.repeat(Math.max(0, cols - label.length - 4)) + '|';
  return inner;
}

function colorRow(s: AttributeTextScreen, x: number, y: number, start: number, count: number, bg: number): void {
  for (let i = 0; i < count && x + i < s.columns; i++) {
    s.writeText(x + i, y, `${(start + i) % 16}`, (start + i) % 16, bg);
  }
}

const commodoreGraphics = [
  192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,
];

function createZxDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  const top = bar(cols, '=');
  w(0, 0, top, 2, 0);
  w(0, 1, spacer(cols, 'ZX SPECTRUM  256x192 ATTR'), 6, 0);
  w(0, 2, top, 2, 0);
  w(1, 4, '10 PRINT "HELLO WORLD"', 7, 0);
  w(1, 5, '20 GOTO 10', 7, 0);
  w(4, 7, 'HELLO WORLD', 15, 0);
  w(4, 8, 'HELLO WORLD', 15, 0);
  if (rows > 10) {
    w(1, 10, 'ATTR: INK+PAPER  BRIGHT+8  FLASH', 6, 0);
    for (let i = 0; i < 8 && i + 1 < cols; i++) {
      s.putChar(i + 1, 11, 0xdb, 7, i);
      s.putChar(i + 1, 12, 0xdb, i + 8, 0);
    }
  }
  if (rows > 14) {
    w(1, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 0);
    w(1, 15, '0123456789 .,!?;:', 7, 0);
  }
  if (rows > 17) {
    w(1, 17, 'PAPER 1 INK 7  BRIGHT +8', 5, 0);
    w(1, 18, 'FLASH bit 7  BORDER idx', 5, 0);
  }
  w(0, rows - 1, top, 2, 0);
  return s;
}

function createC64Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 14);
  const w = (x: number, y: number, t: string, f = 1, b = 14) => s.writeText(x, y, t, f, b);
  const pg = (x: number, y: number, codes: number[], f = 1, b = 14) => {
    for (let i = 0; i < codes.length; i++) s.putChar(x + i, y, codes[i], f, b);
  };
  const top = bar(cols, '*');
  w(0, 0, top, 7, 12);
  w(0, 1, spacer(cols, '**** COMMODORE 64 BASIC ****'), 7, 12);
  w(0, 2, top, 7, 12);
  w(2, 4, '10 PRINT CHR$(205.5+RND(1));', 13, 6);
  w(2, 5, '20 GOTO 10', 13, 6);
  w(2, 6, 'RUN', 5, 6);
  if (rows > 8) {
    w(2, 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 14);
    w(2, 9, '0123456789  16 COLORS', 1, 14);
    if (cols > 28) {
      colorRow(s, 22, 9, 2, 8, 14);
    }
    if (cols > 10) {
      pg(2, 10, commodoreGraphics, 1, 14);
      w(2, 11, 'PETSCII CHR$(192-207)', 3, 14);
    }
    w(2, 12, 'COLOR RAM $D800 nybble', 7, 6);
  }
  if (rows > 14) {
    w(2, 14, 'VIC-II: 320x200 16c BM', 7, 6);
    w(2, 15, 'VIC-II: 160x200 4c MC', 7, 6);
    w(2, 16, 'SID:    3xOSC + FILTER', 7, 6);
    w(2, 17, 'CIA:    $DC00 $DD00', 7, 6);
  }
  w(0, rows - 1, top, 7, 12);
  return s;
}

function createCgaDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  const mode40 = cols <= 40;
  w(0, 0, bar(cols), 7, 0);
  w(0, 1, spacer(cols, mode40 ? 'IBM CGA 40x25 320x200' : 'IBM CGA 80x25 640x200'), 7, 0);
  w(0, 2, bar(cols), 7, 0);
  w(2, 4, 'MODE 4: 320x200  4 COLORS', 7, 0);
  w(2, 5, 'MODE 6: 640x200  2 COLORS', 7, 0);
  w(2, 6, mode40 ? 'PAL 0: G/R/Br  PAL1: C/M/W' : '16-COLOR RGBI PALETTE', 7, 0);
  if (rows > 8) {
    w(2, 8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 15, 0);
    w(2, 9, 'abcdefghijklmnopqrstuvwxyz', 7, 0);
    w(2, 10, '0123456789 .,;:!?', 7, 0);
  }
  if (rows > 12 && cols > 16) {
    w(2, 12, 'CGA PALETTE:', 7, 0);
    colorRow(s, 2, 13, 0, 8, 0);
    colorRow(s, 2, 14, 8, 8, 0);
  }
  w(0, rows - 1, bar(cols), 7, 0);
  return s;
}

function createPetDemo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const wg = (x: number, y: number, t: string, f = 1, b = 0) => {
    for (let i = 0; i < t.length; i++) s.putChar(x + i, y, t.charCodeAt(i) | 0x80, f, b);
  };
  const pg = (x: number, y: number, codes: number[], f = 1, b = 0) => {
    for (let i = 0; i < codes.length; i++) s.putChar(x + i, y, codes[i], f, b);
  };
  const model = cols >= 80 ? '4032 (80 COL)' : '2001 (40 COL)';
  wg(0, 0, bar(cols, '*'), 1, 1);
  wg(0, 1, '*** COMMODORE PET ' + model + ' ***'.padEnd(cols - 2, ' ') + ' ', 1, 1);
  wg(0, 2, bar(cols, '*'), 1, 1);
  w(2, 4, '10 PRINT "HELLO"', 1, 0);
  w(2, 5, '20 INPUT A$', 1, 0);
  w(2, 6, '30 PRINT A$', 1, 0);
  w(2, 7, '40 GOTO 20', 1, 0);
  if (rows > 9) {
    w(2, 9, 'PET ' + (cols >= 80 ? '4032' : '2001'), 1, 0);
    w(2, 10, cols >= 80 ? '80x25  32K  BASIC 4.0' : '40x25  16K  BASIC 1.0', 1, 0);
    w(2, 11, 'IEEE-488  PETSCII  CRTC', 1, 0);
    if (cols > 18) {
      pg(2, 12, commodoreGraphics, 1, 0);
      w(2, 13, 'PETSCII CHR$(192-207)', 1, 0);
    }
  }
  if (rows > 15) {
    w(2, 15, 'UPPER+GRAPHIC  SET', 1, 0);
    w(2, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(2, 17, '0123456789', 1, 0);
  }
  if (rows > 19) {
    w(2, 19, 'LOWER+UPPER  SET (shifted)', 1, 0);
    s.writeText(2, 20, 'abcdefghijklmnopqrstuvwxyz', 1, 0);
  }
  return s;
}

function createMdaDemo(cols: number, rows: number): AttributeTextScreen {
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

function createTrs80Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 7, 0);
  const w = (x: number, y: number, t: string, f = 7, b = 0) => s.writeText(x, y, t, f, b);
  const doubleW = cols <= 32;
  w(0, 0, doubleW ? 'TRS-80 MODEL III  32x16' : 'TRS-80 MODEL III  MEMORY SIZE?', 7, 0);
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
    w(0, 13, 'descender: g j p q y', 7, 0);
  }
  if (rows > 15) {
    w(0, 15, (doubleW ? '32x16' : '64x16') + '  CELL 8x12  512x192', 7, 0);
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
  wi(0, 2, ' INVERTED MSB=1 ', 1, 1);
  wi(0, 3, ' FG <-> BG SWAP ', 1, 1);
  w(1, 5, '\\]10 PRINT "HELLO"', 1, 0);
  w(1, 6, '\\]20 GOTO 10', 1, 0);
  w(1, 7, '\\]RUN', 10, 0);
  if (rows > 9) {
    w(4, 9, 'HELLO', 1, 0);
  }
  if (rows > 11) {
    w(1, 11, '\\].R', 6, 0);
    w(1, 12, 'A=0.A0: 00 00 00 00', 6, 0);
  }
  if (rows > 14) {
    w(1, 14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1, 0);
    w(1, 15, '0123456789', 1, 0);
  }
  if (rows > 17) {
    w(1, 17, '40x24  8x8 LSB-FIRST', 1, 0);
    w(1, 18, '6502 @ 1MHz  4KB RAM', 1, 0);
  }
  return s;
}

function createVic20Demo(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 1, 0);
  const w = (x: number, y: number, t: string, f = 1, b = 0) => s.writeText(x, y, t, f, b);
  const pg = (x: number, y: number, codes: number[], f = 1, b = 0) => {
    for (let i = 0; i < codes.length; i++) s.putChar(x + i, y, codes[i], f, b);
  };
  w(0, 0, 'VIC-20  BASIC', 7, 6);
  w(0, 1, ' 3583 BYTES FREE', 7, 6);
  w(0, 3, 'READY.', 7, 6);
  w(1, 4, '10 PRINT "HELLO"', 7, 6);
  w(1, 5, '20 POKE 36879,27', 7, 6);
  w(1, 7, 'VIC CHIP: 6560/6561', 3, 6);
  w(1, 8, '22x23  176x184  NO SPRITES', 3, 6);
  if (rows > 10) {
    w(1, 10, '16-COLOR PALETTE:', 7, 6);
    for (let c = 0; c < 8 && c + 18 < cols; c++) {
      w(18 + c, 10, '' + c, c + 1, 6);
    }
    for (let c = 0; c < 8 && c + 18 < cols; c++) {
      w(18 + c, 11, '' + (c + 8), c + 9, 6);
    }
    w(1, 12, '4-BIT NYBBLE COLOR RAM', 1, 6);
    if (cols > 10) {
      pg(1, 13, commodoreGraphics, 1, 6);
      w(1, 14, 'PETSCII CHR$(192-207)', 1, 6);
    }
  }
  if (rows > 16) {
    w(1, 16, 'ABC XYZ  abc xyz  0123', 7, 6);
    w(1, 17, 'PETSCII 2 SETS CHARGEN', 7, 6);
    w(1, 18, '176x184 BITMAP 1bpp', 7, 6);
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
