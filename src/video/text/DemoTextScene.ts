import { AttributeTextScreen } from './AttributeTextScreen';
import { TextScreen } from './TextScreen';
import { createCpc464Demo, createCpc664Demo, createCpc6128Demo } from './demos/cpc';
import { createZxDemo } from './demos/zx';
import { createC64Demo } from './demos/c64';
import { createCgaDemo } from './demos/cga';
import { createPetDemo } from './demos/pet';
import { createMdaDemo } from './demos/mda';
import { createTrs80Demo } from './demos/trs80';
import { createApple1Demo } from './demos/apple1';
import { createVic20Demo } from './demos/vic20';
import { createKayproDemo } from './demos/kaypro';
import { createOsborneDemo } from './demos/osborne';
import { createOtronaDemo } from './demos/otrona';
import { createXeroxDemo } from './demos/xerox';
import { createC128Demo } from './demos/c128';
import { createZx128Demo } from './demos/zx128';
import { createSinclairQlDemo } from './demos/sinclair-ql';
import { createMorrowDemo } from './demos/morrow';
import { createRainbowDemo } from './demos/rainbow';
import { createEpsonPx8Demo } from './demos/epson-px8';
import { bar, spacer } from './demos/shared';

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
  kaypro: createKayproDemo,
  'kaypro-ii': createKayproDemo,
  'kaypro-4': createKayproDemo,
  'cpc-464': createCpc464Demo,
  'cpc-664': createCpc664Demo,
  'cpc-6128': createCpc6128Demo,
  osborne: createOsborneDemo,
  otrona: createOtronaDemo,
  xerox: createXeroxDemo,
  morrow: createMorrowDemo,
  rainbow: createRainbowDemo,
  'epson-px8': createEpsonPx8Demo,
  c128: createC128Demo,
  zx128: createZx128Demo,
  'sinclair-ql': createSinclairQlDemo,
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
