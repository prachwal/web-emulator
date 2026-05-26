export type BitOrder = 'msb-left' | 'lsb-left';

export interface BitmapFont {
  id: string;
  name: string;
  glyphCount: number;
  charWidth: number;
  charHeight: number;
  cellWidth?: number;
  cellHeight?: number;
  bytesPerGlyph: number;
  data: Uint8Array;
  bitOrder: BitOrder;
  xBits?: number[];
  invertBits?: boolean;
  sourcePath?: string;
}

export function getGlyphData(font: BitmapFont, charCode: number): Uint8Array {
  if (charCode < 0 || charCode >= font.glyphCount) {
    return new Uint8Array(font.bytesPerGlyph);
  }
  const idx = charCode * font.bytesPerGlyph;
  if (idx + font.bytesPerGlyph > font.data.length) {
    return new Uint8Array(font.bytesPerGlyph);
  }
  return font.data.subarray(idx, idx + font.bytesPerGlyph);
}

export function getGlyphBit(
  font: BitmapFont,
  charCode: number,
  x: number,
  y: number,
): number {
  const glyphData = getGlyphData(font, charCode);
  const byteIndex = y;
  if (byteIndex >= glyphData.length) return 0;

  const bits = font.invertBits ? glyphData[byteIndex] ^ 0xff : glyphData[byteIndex];
  const bit = font.xBits?.[x] ?? (font.bitOrder === 'msb-left' ? 7 - x : x);
  if (bit < 0 || bit > 7) return 0;
  return (bits >> bit) & 1;
}

export function loadFontFromBin(
  id: string,
  name: string,
  data: Uint8Array,
  glyphCount: number,
  charWidth: number,
  charHeight: number,
  bitOrder: BitOrder = 'msb-left',
  sourcePath?: string,
  xBits?: number[],
  invertBits?: boolean,
  cellWidth?: number,
  cellHeight?: number,
): BitmapFont {
  const bytesPerGlyph = charHeight * Math.ceil(charWidth / 8);
  return {
    id,
    name,
    glyphCount,
    charWidth,
    charHeight,
    cellWidth,
    cellHeight,
    bytesPerGlyph,
    data,
    bitOrder,
    sourcePath,
    xBits,
    invertBits,
  };
}

export function createDefaultFont(
  charWidth: number = 8,
  charHeight: number = 8,
): BitmapFont {
  const glyphCount = 256;
  const bytesPerGlyph = charHeight;
  const data = new Uint8Array(glyphCount * bytesPerGlyph);

  for (let c = 0x20; c < 0x7f; c++) {
    for (let row = 0; row < charHeight; row++) {
      let byteVal = 0;
      for (let col = 0; col < charWidth; col++) {
        const on = c === 0x20 ? 0 : 1;
        if (on) byteVal |= 1 << (charWidth - 1 - col);
      }
      data[c * bytesPerGlyph + row] = byteVal;
    }
  }

  return {
    id: 'default', name: 'Default', glyphCount, charWidth, charHeight,
    bytesPerGlyph, data, bitOrder: 'msb-left',
  };
}

export function renderGlyphToBuffer(
  font: BitmapFont,
  charCode: number,
  buffer: Uint8Array,
  bufferWidth: number,
  posX: number,
  posY: number,
  fgColor: number,
  bgColor: number,
): void {
  for (let row = 0; row < font.charHeight; row++) {
    for (let col = 0; col < font.charWidth; col++) {
      const bit = getGlyphBit(font, charCode, col, row);
      const px = posX + col;
      const py = posY + row;
      if (px >= 0 && px < bufferWidth && py >= 0) {
        buffer[py * bufferWidth + px] = bit ? fgColor : bgColor;
      }
    }
  }
}
