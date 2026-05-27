import type { VideoMode } from '../../core/types';

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
  computer: string;
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
  borderColor?: string;
  palette: string[];
  videoMode?: VideoMode;
  graphicsRenderer?: string;
}

export function f8(h: number, left: number): FontGeometry {
  return {
    glyphWidth: 8, glyphHeight: h, cellWidth: 8, cellHeight: h,
    bytesPerGlyph: h, leftBit: left,
    xBits: left > 3 ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7],
  };
}

export function f6m1(): FontGeometry {
  return {
    glyphWidth: 6, glyphHeight: 8, cellWidth: 6, cellHeight: 12,
    bytesPerGlyph: 8, leftBit: 5,
    xBits: [0, 1, 2, 3, 4, 5], invertBits: undefined,
  };
}

export function f8hl(h: number, left: number, cellH: number): FontGeometry {
  return {
    glyphWidth: 8, glyphHeight: h, cellWidth: 8, cellHeight: cellH,
    bytesPerGlyph: h, leftBit: left,
    xBits: [0, 1, 2, 3, 4, 5, 6, 7],
  };
}

export const A43 = 4 / 3;

function screenBorder(screen: string, borderColor?: string): string {
  if (borderColor) return borderColor;
  if (!screen || screen === '#000000' || screen === '#000') return '#151515';
  return screen;
}

function computerFromName(name: string): string {
  const first = name.split(/\s+/)[0];
  if (first === 'IBM' || first === 'Commodore' || first === 'Amstrad' || first === 'Kaypro') return first;
  if (name.startsWith('ZX')) return 'Sinclair';
  if (name.startsWith('TRS-80')) return 'Tandy';
  if (name.startsWith('Apple')) return 'Apple';
  if (name.startsWith('VIC-20')) return 'Commodore';
  return first;
}

export const T = (
  id: string, machineId: string, machineName: string,
  cols: number, rows: number, cw: number, ch: number,
  fw: number, fh: number, par: number,
  fontFile: string | undefined, fontId: string | undefined,
  total: number, geom: FontGeometry,
  margins: Margins, fg: string, bg: string, screen: string, bezel: string, labelClr: string,
  palette: string[],
  vmode?: VideoMode,
  borderColor?: string,
): Preset => ({
  id, machineId, machineName, computer: computerFromName(machineName), type: 'text', label: `${cols}×${rows}`,
  cols, rows, charWidth: cw, charHeight: ch,
  framebufferWidth: fw, framebufferHeight: fh,
  pixelAspectRatio: par, displayAspectRatio: A43,
  fontFile, fontId, totalChars: total, font: geom,
  margins, fgColor: fg, bgColor: bg, screenBg: screen,
  bezelColor: bezel, labelColor: labelClr, palette,
  videoMode: vmode,
  borderColor: screenBorder(screen, borderColor),
});

export const G = (
  id: string, machineId: string, machineName: string,
  label: string, cols: number, rows: number,
  fw: number, fh: number, par: number,
  fontFile: string | undefined, fontId: string | undefined,
  total: number, geom: FontGeometry,
  margins: Margins, fg: string, bg: string, screen: string, bezel: string, labelClr: string,
  palette: string[], renderer: string,
  vmode?: VideoMode,
  borderColor?: string,
): Preset => ({
  id, machineId, machineName, computer: computerFromName(machineName), type: 'bitmap', label,
  cols, rows, charWidth: geom.glyphWidth, charHeight: geom.glyphHeight,
  framebufferWidth: fw, framebufferHeight: fh,
  pixelAspectRatio: par, displayAspectRatio: A43,
  fontFile, fontId, totalChars: total, font: geom,
  margins, fgColor: fg, bgColor: bg, screenBg: screen,
  bezelColor: bezel, labelColor: labelClr, palette,
  graphicsRenderer: renderer, videoMode: vmode,
  borderColor: screenBorder(screen, borderColor),
});

export const m = (t: number, r: number, b: number, l: number): Margins =>
  ({ top: t, right: r, bottom: b, left: l });
