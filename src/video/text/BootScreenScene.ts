import { AttributeTextScreen } from './AttributeTextScreen';

export function createBootScreenForMachine(
  machineId: string,
  cols: number,
): AttributeTextScreen {
  const fn = bootScreens[machineId];
  if (!fn) return createGenericBoot(cols, 24);
  const rows = 24;
  if (!fn) return createGenericBoot(cols, rows);
  return fn(cols);
}

function w(s: AttributeTextScreen, x: number, y: number, t: string, f = 1, b = 0) {
  s.writeText(x, y, t, f, b);
}

function createGenericBoot(cols: number, rows: number): AttributeTextScreen {
  const s = new AttributeTextScreen(cols, rows);
  s.clear(32, 15, 0);
  const c = Math.floor((cols - 16) / 2);
  w(s, c, Math.floor(rows / 2) - 1, '--- CRT EMULATOR ---', 15, 0);
  w(s, c, Math.floor(rows / 2) + 1, 'POWER ON SELF TEST', 7, 0);
  return s;
}

const bootScreens: Record<string, (cols: number) => AttributeTextScreen> = {
  // === Sinclair ===
  // Real ZX Spectrum boot: white on black, "Sinclair BASIC" header, copyright,
  // blank line, then "0 REM " with K cursor. No READY.
  zx(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 7, 0);
    w(s, 6, 1, 'Sinclair BASIC', 7, 0);
    w(s, 4, 2, '(C) 1982 Sinclair Research Ltd', 7, 0);
    w(s, 2, 5, '0', 7, 0);
    w(s, 0, 23, 'READY', 7, 0);
    return s;
  },

  // Real ZX128 boot: copyright + memory test counter, then BASIC prompt
  zx128(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 7, 0);
    w(s, 3, 1, 'Sinclair BASIC 128', 7, 0);
    w(s, 4, 2, '(C) 1986 Sinclair Research Ltd', 7, 0);
    w(s, 2, 5, '128K BASIC', 7, 0);
    w(s, 0, 7, '0', 7, 0);
    return s;
  },

  // Real QL boot: white on black in Mode 4, QDOS info left-aligned
  'sinclair-ql'(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 7, 0);
    w(s, 0, 2, 'QL SERIAL No  000000', 7, 0);
    w(s, 0, 3, 'MICRODRIVE STORAGE', 7, 0);
    w(s, 0, 4, 'QDOS VERSION 1.03', 7, 0);
    w(s, 0, 5, '128 KB RAM', 7, 0);
    w(s, 0, 8, 'BASIC', 7, 0);
    w(s, 0, 9, ' 0 REMark', 7, 0);
    return s;
  },

  // === Commodore ===
  // Real C64 boot: white (1) on blue (6), exactly:
  //     **** COMMODORE 64 BASIC V2 ****
  //   64K RAM SYSTEM  38911 BASIC BYTES FREE
  //   ...
  //   READY.
  c64(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 1, 6);
    w(s, 4, 2, '**** COMMODORE 64 BASIC V2 ****', 1, 6);
    w(s, 6, 4, ' 64K RAM SYSTEM  38911 BASIC BYTES FREE', 1, 6);
    w(s, 0, 7, 'READY.', 1, 6);
    return s;
  },

  // Real C128 VDC boot: green (1) on black, 80-col mode info
  c128(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 1, 0);
    w(s, 4, 2, 'COMMODORE 128 BASIC V7.0', 1, 0);
    w(s, 6, 4, '128K RAM SYSTEM  122365 BYTES FREE', 1, 0);
    w(s, 0, 6, '80-COLUMN MODE', 1, 0);
    w(s, 0, 9, 'READY.', 1, 0);
    return s;
  },

  // Real PET boot: white on black, BASIC header
  pet(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 1, 0);
    w(s, 3, 2, '*** COMMODORE PET ***', 1, 0);
    w(s, 5, 4, '8K RAM SYSTEM', 1, 0);
    w(s, 0, 7, 'READY.', 1, 0);
    return s;
  },

  // Real VIC-20 boot: white on black, 22 columns
  vic20(cols: number) {
    const s = new AttributeTextScreen(cols, 23);
    s.clear(32, 1, 0);
    w(s, 1, 1, '**** VIC-20 BASIC ****', 1, 0);
    w(s, 2, 3, ' 3583 BYTES FREE', 1, 0);
    w(s, 0, 6, 'READY.', 1, 0);
    return s;
  },

  // Real C16 boot: white on black
  c16(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 1, 0);
    w(s, 3, 2, '**** COMMODORE 16 ****', 1, 0);
    w(s, 4, 4, ' 16K RAM SYSTEM', 1, 0);
    w(s, 6, 5, ' 12277 BASIC BYTES FREE', 1, 0);
    w(s, 0, 8, 'READY.', 1, 0);
    return s;
  },

  // Real Plus/4 boot: white on black
  plus4(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 1, 0);
    w(s, 3, 2, '**** COMMODORE PLUS/4 ****', 1, 0);
    w(s, 4, 4, ' 64K RAM SYSTEM', 1, 0);
    w(s, 6, 5, ' 58877 BASIC BYTES FREE', 1, 0);
    w(s, 0, 8, 'READY.', 1, 0);
    return s;
  },

  // === IBM ===
  cga(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 7, 0);
    w(s, 0, 0, 'IBM Personal Computer BASIC', 7, 0);
    w(s, 0, 1, 'Version C1.10 Copyright IBM Corp 1981', 7, 0);
    w(s, 4, 4, ' 61404 Bytes free', 7, 0);
    w(s, 0, 6, 'Ok', 7, 0);
    return s;
  },

  mda(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 2, 0);
    w(s, 0, 0, 'IBM Personal Computer BASIC', 2, 0);
    w(s, 0, 1, 'Version C1.10 Copyright IBM Corp 1981', 2, 0);
    w(s, 4, 4, ' 61404 Bytes free', 2, 0);
    w(s, 0, 6, 'Ok', 2, 0);
    return s;
  },

  // === Tandy ===
  trs80(cols: number) {
    const s = new AttributeTextScreen(cols, 16);
    s.clear(32, 1, 0);
    w(s, 0, 0, 'TRS-80 Model III BASIC', 1, 0);
    w(s, 0, 1, '(C) 1980 Tandy Corp', 1, 0);
    w(s, 1, 4, 'MEMORY SIZE = 49152', 1, 0);
    w(s, 0, 6, 'READY', 1, 0);
    w(s, 0, 7, '>', 1, 0);
    return s;
  },

  // === Apple ===
  apple1(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 1, 0);
    w(s, 2, 1, 'APPLE 1', 1, 0);
    w(s, 2, 2, 'MONITOR', 1, 0);
    w(s, 2, 5, '\\', 1, 0);
    return s;
  },

  // === Amstrad ===
  // CPC boot uses fg=15 (white in all CPC palettes), bg=0 (black)
  'cpc-464'(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 15, 0);
    const c = Math.floor((cols - 7) / 2);
    w(s, c, 2, 'AMSTRAD', 15, 0);
    w(s, Math.max(0, c - 3), 4, '464  BASIC  v1.0', 15, 0);
    w(s, Math.max(0, c - 4), 6, '(c) 1984 Amsoft', 15, 0);
    w(s, 0, 10, 'READY', 15, 0);
    return s;
  },
  'cpc-664'(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 15, 0);
    const c = Math.floor((cols - 7) / 2);
    w(s, c, 2, 'AMSTRAD', 15, 0);
    w(s, Math.max(0, c - 3), 4, '664  BASIC  v1.1', 15, 0);
    w(s, Math.max(0, c - 4), 6, '(c) 1985 Amsoft', 15, 0);
    w(s, 0, 10, 'READY', 15, 0);
    return s;
  },
  'cpc-6128'(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 15, 0);
    const c = Math.floor((cols - 7) / 2);
    w(s, c, 2, 'AMSTRAD', 15, 0);
    w(s, Math.max(0, c - 3), 4, '6128  BASIC  v1.1', 15, 0);
    w(s, Math.max(0, c - 4), 6, '(c) 1985 Amsoft', 15, 0);
    w(s, 0, 10, 'READY', 15, 0);
    return s;
  },

  // === CP/M ===
  'kaypro-ii'(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 2, 0);
    w(s, 20, 2, 'KAYPRO II', 2, 0);
    w(s, 4, 4, '  Z80 CPU  64K RAM  CP/M 2.2', 2, 0);
    w(s, 4, 6, '  Two 5.25\" DS/DD Disk Drives', 2, 0);
    w(s, 4, 8, '  Perfect Writer  Perfect Calc', 2, 0);
    w(s, 8, 12, 'A>', 2, 0);
    return s;
  },
  'kaypro-4'(cols: number) {
    const s = new AttributeTextScreen(cols, 25);
    s.clear(32, 2, 0);
    w(s, 20, 2, 'KAYPRO 4/84', 2, 0);
    w(s, 4, 4, '  Z80 CPU  64K RAM  CP/M 2.2', 2, 0);
    w(s, 4, 6, '  800K Disk Drives', 2, 0);
    w(s, 8, 12, 'A>', 2, 0);
    return s;
  },

  osborne(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 2, 0);
    w(s, 10, 2, 'Osborne 1', 2, 0);
    w(s, 4, 4, '  Z80A  64K  CP/M 2.2', 2, 0);
    w(s, 4, 6, '  52 Character Display', 2, 0);
    w(s, 4, 8, '  WordStar  SuperCalc  MBASIC', 2, 0);
    w(s, 8, 12, 'A>', 2, 0);
    return s;
  },

  otrona(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 3, 0);
    w(s, 16, 2, 'Otrona Attache', 3, 0);
    w(s, 4, 4, '  Z80A  64K  CP/M 2.2', 3, 0);
    w(s, 4, 6, '  Dual 5.25\" Disk Drives', 3, 0);
    w(s, 8, 12, 'A>', 3, 0);
    return s;
  },

  xerox(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 2, 0);
    w(s, 16, 2, 'Xerox 820-II', 2, 0);
    w(s, 4, 4, '  Z80  64K  CP/M 2.2', 2, 0);
    w(s, 4, 6, '  Dual 8\" SSDD Floppy Drives', 2, 0);
    w(s, 8, 12, 'A>', 2, 0);
    return s;
  },

  morrow(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 2, 0);
    w(s, 16, 2, 'Morrow MD3', 2, 0);
    w(s, 4, 4, '  Z80  64K  CP/M 2.2', 2, 0);
    w(s, 4, 6, '  6\" 26MB Hard Disk', 2, 0);
    w(s, 4, 8, '  Micro-Pro WordStar  SuperCalc', 2, 0);
    w(s, 8, 12, 'A>', 2, 0);
    return s;
  },

  rainbow(cols: number) {
    const s = new AttributeTextScreen(cols, 24);
    s.clear(32, 2, 0);
    w(s, 12, 2, 'DEC Rainbow 100', 2, 0);
    w(s, 4, 4, '  Z80 + 8088  CP/M + MS-DOS', 2, 0);
    w(s, 4, 6, '  80x24 Monochrome Terminal', 2, 0);
    w(s, 8, 12, 'A>', 2, 0);
    return s;
  },

  'epson-px8'(cols: number) {
    const s = new AttributeTextScreen(cols, 8);
    s.clear(32, 2, 0);
    w(s, 20, 0, 'EPSON PX-8', 2, 0);
    w(s, 4, 1, '  Z80  64K  CP/M 2.2', 2, 0);
    w(s, 4, 2, '  Built-in LCD 80x8', 2, 0);
    w(s, 10, 5, 'A>', 2, 0);
    return s;
  },
};
