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
      const fgColor = swap ? screen.background[cellIndex] : screen.foreground[cellIndex];
      const bgColor = swap ? screen.foreground[cellIndex] : screen.background[cellIndex];

      renderGlyphToFramebuffer(
        font, charCode, framebuffer,
        outputWidth, outputHeight,
        col * cellW, row * cellH,
        fgColor, bgColor,
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

  for (let gy = 0; gy < cellH; gy++) {
    for (let gx = 0; gx < cellW; gx++) {
      const px = posX + gx;
      const py = posY + gy;

      if (px < 0 || px >= outputWidth || py < 0 || py >= outputHeight) continue;

      if (gy < font.charHeight && gx < font.charWidth) {
        const bit = getGlyphBit(font, charCode, gx, gy);
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
