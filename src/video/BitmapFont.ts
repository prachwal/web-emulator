export type BitOrder = 'msb-left' | 'lsb-left';

export interface BitmapFont {
  id: string;
  name: string;
  glyphCount: number;
  charWidth: number;
  charHeight: number;
  bytesPerGlyph: number;
  data: Uint8Array;
  bitOrder: BitOrder;
  sourcePath?: string;
}

export function getGlyphData(font: BitmapFont, charCode: number): Uint8Array {
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

  const bits = glyphData[byteIndex];
  if (font.bitOrder === 'msb-left') {
    return (bits >> (7 - x)) & 1;
  } else {
    return (bits >> x) & 1;
  }
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
): BitmapFont {
  const bytesPerGlyph = charHeight * Math.ceil(charWidth / 8);
  return {
    id,
    name,
    glyphCount,
    charWidth,
    charHeight,
    bytesPerGlyph,
    data,
    bitOrder,
    sourcePath,
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
