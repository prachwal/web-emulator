import type { BitmapFont } from '../BitmapFont';
import { getGlyphBit } from '../BitmapFont';
import type { AttributeTextScreen } from './AttributeTextScreen';
import type { TextScreen } from './TextScreen';
import type { CharMapper } from './CharMapper';
import { asciiCharMapper } from './CharMapper';

export interface TextRenderOptions {
  invert?: boolean;
  flashPhase?: boolean;
  invertMsb?: boolean;
  /** ZX Spectrum attribute byte per cell; when set, fg/bg encode INK/PAPER/BRIGHT/FLASH */
  zxAttr?: Uint8Array;
  frameNumber?: number;
}

export function renderAttributeTextToFramebuffer(
  screen: AttributeTextScreen,
  font: BitmapFont,
  framebuffer: Uint8Array,
  options: TextRenderOptions = {},
  mapper: CharMapper = asciiCharMapper,
): void {
  const cellW = font.cellWidth ?? font.charWidth;
  const cellH = font.cellHeight ?? font.charHeight;
  const outputWidth = screen.columns * cellW;
  const outputHeight = screen.rows * cellH;

  for (let row = 0; row < screen.rows; row++) {
    for (let col = 0; col < screen.columns; col++) {
      const cellIndex = row * screen.columns + col;

      let charCode = mapper.mapCharCode(screen.chars[cellIndex]);
      const invertGlobal = !!options.invert;
      const invertCell = !!(options.invertMsb && charCode >= 128);
      if (invertCell) charCode &= 0x7f;
      const swap = invertGlobal !== invertCell;

      let fgIdx = swap ? screen.background[cellIndex] : screen.foreground[cellIndex];
      let bgIdx = swap ? screen.foreground[cellIndex] : screen.background[cellIndex];

      // ZX Spectrum attribute decoding (INK/PAPER/BRIGHT/FLASH)
      if (options.zxAttr && cellIndex < options.zxAttr.length) {
        const attr = options.zxAttr[cellIndex];
        const flash = (attr >> 7) & 1;
        const flashPhase = options.flashPhase !== undefined ? options.flashPhase
          : (options.frameNumber !== undefined ? Math.floor(options.frameNumber / 16) % 2 : 0);
        fgIdx = attr & 0x07;
        bgIdx = (attr >> 3) & 0x07;
        if (attr & 0x40) { fgIdx += 8; bgIdx += 8; }
        if (flash && flashPhase) { const t = fgIdx; fgIdx = bgIdx; bgIdx = t; }
      }

      renderGlyphToFramebuffer(
        font, charCode, framebuffer,
        outputWidth, outputHeight,
        col * cellW, row * cellH,
        fgIdx, bgIdx,
      );
    }
  }
}

export function renderTextToFramebuffer(
  screen: TextScreen,
  font: BitmapFont,
  framebuffer: Uint8Array,
  fgColor: number = 15,
  bgColor: number = 0,
  mapper: CharMapper = asciiCharMapper,
): void {
  const cellW = font.cellWidth ?? font.charWidth;
  const cellH = font.cellHeight ?? font.charHeight;
  const outputWidth = screen.columns * cellW;
  const outputHeight = screen.rows * cellH;

  for (let row = 0; row < screen.rows; row++) {
    for (let col = 0; col < screen.columns; col++) {
      const cellIndex = row * screen.columns + col;
      const charCode = mapper.mapCharCode(screen.chars[cellIndex]);

      renderGlyphToFramebuffer(
        font, charCode, framebuffer,
        outputWidth, outputHeight,
        col * cellW, row * cellH,
        fgColor, bgColor,
      );
    }
  }
}

export function renderGlyphToFramebuffer(
  font: BitmapFont,
  charCode: number,
  framebuffer: Uint8Array,
  outputWidth: number,
  outputHeight: number,
  posX: number,
  posY: number,
  fgColor: number,
  bgColor: number,
): void {
  const cellW = font.cellWidth ?? font.charWidth;
  const cellH = font.cellHeight ?? font.charHeight;
  const scaleX = font.scaleX ?? 1;
  const scaleY = font.scaleY ?? 1;
  const glyphW = font.charWidth * scaleX;
  const glyphH = font.charHeight * scaleY;

  for (let gy = 0; gy < cellH; gy++) {
    for (let gx = 0; gx < cellW; gx++) {
      const px = posX + gx;
      const py = posY + gy;

      if (px < 0 || px >= outputWidth || py < 0 || py >= outputHeight) continue;

      if (gy < glyphH && gx < glyphW) {
        const bit = getGlyphBit(font, charCode, Math.floor(gx / scaleX), Math.floor(gy / scaleY));
        framebuffer[py * outputWidth + px] = bit ? fgColor : bgColor;
      } else {
        framebuffer[py * outputWidth + px] = bgColor;
      }
    }
  }
}

export function renderCharsetTable(
  font: BitmapFont,
  columns: number,
  rows: number,
  framebuffer: Uint8Array,
  fgColor: number = 15,
  bgColor: number = 0,
): void {
  const outputWidth = columns * font.charWidth;
  const glyphsPerRow = 16;
  const tableFont = font;

  for (let i = 0; i < 256 && i < font.glyphCount; i++) {
    const tableCol = i % glyphsPerRow;
    const tableRow = Math.floor(i / glyphsPerRow);
    const px = tableCol * font.charWidth;
    const py = tableRow * font.charHeight;

    renderGlyphToFramebuffer(
      tableFont, i, framebuffer,
      outputWidth, rows * font.charHeight,
      px, py, fgColor, bgColor,
    );
  }
}
