import type { VideoMode } from '../core/types';
import { zxSpectrumColors, c64Colors } from './Palette';

export interface FontGeometry {
  glyphWidth: number;
  glyphHeight: number;
  cellWidth: number;
  cellHeight: number;
  bytesPerGlyph: number;
  leftBit: number;
  xBits?: number[];
  invertBits?: boolean;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Preset {
  id: string;
  machineId: string;
  machineName: string;

  type: 'text' | 'bitmap';
  label: string;

  cols: number;
  rows: number;
  charWidth: number;
  charHeight: number;

  framebufferWidth: number;
  framebufferHeight: number;
  pixelAspectRatio: number;
  displayAspectRatio: number;

  fontFile?: string;
  fontId?: string;
  totalChars: number;
  font: FontGeometry;

  margins: Margins;
  fgColor: string;
  bgColor: string;
  screenBg: string;
  bezelColor: string;
  labelColor: string;
  palette: string[];

  videoMode?: VideoMode;
  graphicsRenderer?: string;
}

function f8(h: number, left: number): FontGeometry {
  return {
    glyphWidth: 8, glyphHeight: h, cellWidth: 8, cellHeight: h,
    bytesPerGlyph: h, leftBit: left,
    xBits: left > 3 ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7],
  };
}

function f6m1(): FontGeometry {
  return {
    glyphWidth: 6, glyphHeight: 8, cellWidth: 6, cellHeight: 12,
    bytesPerGlyph: 8, leftBit: 5,
    xBits: [0, 1, 2, 3, 4, 5], invertBits: undefined,
  };
}

function f8hl(h: number, left: number, cellH: number): FontGeometry {
  return {
    glyphWidth: 8, glyphHeight: h, cellWidth: 8, cellHeight: cellH,
    bytesPerGlyph: h, leftBit: left,
    xBits: [0, 1, 2, 3, 4, 5, 6, 7],
  };
}

const A43 = 4 / 3;

const T = (
  id: string, machineId: string, machineName: string,
  cols: number, rows: number, cw: number, ch: number,
  fw: number, fh: number, par: number,
  fontFile: string | undefined, fontId: string | undefined,
  total: number, geom: FontGeometry,
  margins: Margins, fg: string, bg: string, screen: string, bezel: string, labelClr: string,
  palette: string[],
  vmode?: VideoMode,
): Preset => ({
  id, machineId, machineName, type: 'text', label: `${cols}×${rows}`,
  cols, rows, charWidth: cw, charHeight: ch,
  framebufferWidth: fw, framebufferHeight: fh,
  pixelAspectRatio: par, displayAspectRatio: A43,
  fontFile, fontId, totalChars: total, font: geom,
  margins, fgColor: fg, bgColor: bg, screenBg: screen,
  bezelColor: bezel, labelColor: labelClr, palette,
  videoMode: vmode,
});

const G = (
  id: string, machineId: string, machineName: string,
  label: string, cols: number, rows: number,
  fw: number, fh: number, par: number,
  fontFile: string | undefined, fontId: string | undefined,
  total: number, geom: FontGeometry,
  margins: Margins, fg: string, bg: string, screen: string, bezel: string, labelClr: string,
  palette: string[], renderer: string,
  vmode?: VideoMode,
): Preset => ({
  id, machineId, machineName, type: 'bitmap', label,
  cols, rows, charWidth: geom.glyphWidth, charHeight: geom.glyphHeight,
  framebufferWidth: fw, framebufferHeight: fh,
  pixelAspectRatio: par, displayAspectRatio: A43,
  fontFile, fontId, totalChars: total, font: geom,
  margins, fgColor: fg, bgColor: bg, screenBg: screen,
  bezelColor: bezel, labelColor: labelClr, palette,
  graphicsRenderer: renderer, videoMode: vmode,
});

const m = (t: number, r: number, b: number, l: number): Margins =>
  ({ top: t, right: r, bottom: b, left: l });

const zxPal = zxSpectrumColors;
const c64Pal = c64Colors;

export const PRESETS: Preset[] = [
  // ── Text modes ────────────────────────────
  T('zx-text-32x24', 'zx', 'ZX Spectrum', 32, 24, 8, 8, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zxPal),

  T('c64-text-40x25', 'c64', 'Commodore 64', 40, 25, 8, 8, 320, 200, 5 / 6,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal),

  T('cga-text-40x25', 'cga', 'IBM CGA', 40, 25, 8, 8, 320, 200, 5 / 6,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880', [
      '#000000','#0000aa','#00aa00','#00aaaa','#aa0000','#aa00aa','#aaaa00','#aaaaaa',
      '#000055','#0000ff','#00ff00','#00ffff','#ff0000','#ff00ff','#ffff00','#ffffff',
    ]),

  T('cga-text-80x25', 'cga', 'IBM CGA', 80, 25, 8, 8, 640, 200, 5 / 12,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(6, 5, 6, 5), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880', [
      '#000000','#0000aa','#00aa00','#00aaaa','#aa0000','#aa00aa','#aaaa00','#aaaaaa',
      '#000055','#0000ff','#00ff00','#00ffff','#ff0000','#ff00ff','#ffff00','#ffffff',
    ]),

  T('pet-text-40x25', 'pet', 'Commodore PET', 40, 25, 8, 8, 320, 200, 5 / 6,
    'pet-2001.bin', 'pet-2001', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', [
      '#000000','#ffffff','#880000','#00aa00','#0000aa','#aa00aa','#00aaaa','#aaaa00',
      '#555555','#5555ff','#55ff55','#ff5555','#00ffff','#ff00ff','#ffff55','#aaffaa',
    ]),

  T('pet-text-80x25', 'pet', 'Commodore PET', 80, 25, 8, 8, 640, 200, 5 / 12,
    'pet-4032.bin', 'pet-4032', 256, f8(8, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#303030', '#666', [
      '#000000','#ffffff','#880000','#00aa00','#0000aa','#aa00aa','#00aaaa','#aaaa00',
      '#555555','#5555ff','#55ff55','#ff5555','#00ffff','#ff00ff','#ffff55','#aaffaa',
    ]),

  T('mda-text-80x25', 'mda', 'IBM MDA', 80, 25, 8, 14, 640, 350, 5 / 6,
    'cga-thick.bin', 'mda-cga', 256, f8hl(8, 7, 14),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e8e0d0', '#a09880', [
      '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ]),

  T('trs80-text-64x16', 'trs80', 'TRS-80 Model III', 64, 16, 8, 12, 512, 192, 1 / 2,
    'trs80-m3-chargen.bin', 'trs80-m3', 256, f8hl(8, 7, 12),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#707070', '#555', [
      '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ]),

  T('apple1-text-40x24', 'apple1', 'Apple 1', 40, 24, 8, 8, 320, 192, 5 / 6,
    'apple1.vid', 'apple1', 128, f8(8, 0),
    m(12, 10, 12, 10), '#33ff33', '#000000', '#000000', '#2a2018', '#5a4a3a', [
      '#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
      '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
    ]),

  T('vic20-text-22x23', 'vic20', 'VIC-20', 22, 23, 8, 8, 176, 184, 1,
    'vic20.bin', 'vic20-chargen', 256, f8(8, 7),
    m(10, 8, 10, 8), '#66ccff', '#000000', '#000000', '#c4b89a', '#8a7d60', [
      '#000000','#ffffff','#ff0000','#00ffff','#ff00ff','#00ff00','#0000ff','#ffff00',
      '#ff8800','#88ff00','#00ff88','#0088ff','#8800ff','#ff0088','#888888','#cccccc',
    ]),

  // ── Bitmap modes ───────────────────────────────
  G('zx-attr-256x192', 'zx', 'ZX Spectrum', 'Attr 256×192',
    32, 24, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zxPal,
    'spectrum-attr', 'attribute-bitmap'),

  G('c64-320x200', 'c64', 'Commodore 64', 'Bitmap 320×200',
    40, 25, 320, 200, 5 / 6,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal,
    'c64', 'bitmap-2bpp'),

  G('cga-320x200', 'cga', 'IBM CGA', 'CGA 320×200 4c',
    40, 25, 320, 200, 5 / 6,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880',
    ['#000000','#00ffff','#ff00ff','#ffffff','#00ffff','#ff00ff','#ffffff','#ffffff',
     '#000000','#00ffff','#ff00ff','#ffffff','#00ffff','#ff00ff','#ffffff','#ffffff'],
    'cga:320×200 4c', 'tilemap'),

  G('cga-640x200', 'cga', 'IBM CGA', 'CGA 640×200 2c',
    80, 25, 640, 200, 5 / 12,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(6, 5, 6, 5), '#ffffff', '#000000', '#000000', '#e8e0d0', '#a09880',
    ['#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
     '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],
    'mono', 'bitmap-1bpp'),
];

export function presetKey(p: Preset): string {
  return `${p.machineId}:${p.id}`;
}

export function presetsByMachine(machineId: string): Preset[] {
  return PRESETS.filter(p => p.machineId === machineId);
}

export function presetsByType(type: 'text' | 'bitmap'): Preset[] {
  return PRESETS.filter(p => p.type === type);
}

export function machineIds(): string[] {
  return [...new Set(PRESETS.map(p => p.machineId))];
}

export function machineName(id: string): string {
  return PRESETS.find(p => p.machineId === id)?.machineName ?? id;
}

export function presetsForMachine(machineId: string, type: 'text' | 'bitmap'): Preset[] {
  return PRESETS.filter(p => p.machineId === machineId && p.type === type);
}
