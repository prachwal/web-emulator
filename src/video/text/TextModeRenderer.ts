import type { BitmapFont } from '../BitmapFont';
import { getGlyphBit } from '../BitmapFont';
import type { AttributeTextScreen } from './AttributeTextScreen';
import type { TextScreen } from './TextScreen';
import type { CharMapper } from './CharMapper';
import { asciiCharMapper } from './CharMapper';

export interface TextRenderOptions {
  invert?: boolean;
  flashPhase?: boolean;
}

export function renderAttributeTextToFramebuffer(
  screen: AttributeTextScreen,
  font: BitmapFont,
  framebuffer: Uint8Array,
  options: TextRenderOptions = {},
  mapper: CharMapper = asciiCharMapper,
): void {
  const outputWidth = screen.columns * font.charWidth;
  const outputHeight = screen.rows * font.charHeight;

  for (let row = 0; row < screen.rows; row++) {
    for (let col = 0; col < screen.columns; col++) {
      const cellIndex = row * screen.columns + col;

      const charCode = mapper.mapCharCode(screen.chars[cellIndex]);
      const fgColor = options.invert ? screen.background[cellIndex] : screen.foreground[cellIndex];
      const bgColor = options.invert ? screen.foreground[cellIndex] : screen.background[cellIndex];

      renderGlyphToFramebuffer(
        font, charCode, framebuffer,
        outputWidth, outputHeight,
        col * font.charWidth, row * font.charHeight,
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
  const outputWidth = screen.columns * font.charWidth;
  const outputHeight = screen.rows * font.charHeight;

  for (let row = 0; row < screen.rows; row++) {
    for (let col = 0; col < screen.columns; col++) {
      const cellIndex = row * screen.columns + col;
      const charCode = mapper.mapCharCode(screen.chars[cellIndex]);

      renderGlyphToFramebuffer(
        font, charCode, framebuffer,
        outputWidth, outputHeight,
        col * font.charWidth, row * font.charHeight,
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
  for (let gy = 0; gy < font.charHeight; gy++) {
    for (let gx = 0; gx < font.charWidth; gx++) {
      const bit = getGlyphBit(font, charCode, gx, gy);
      const px = posX + gx;
      const py = posY + gy;

      if (px < 0 || px >= outputWidth || py < 0 || py >= outputHeight) continue;

      framebuffer[py * outputWidth + px] = bit ? fgColor : bgColor;
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
