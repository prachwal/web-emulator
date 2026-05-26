export interface BitmapFont {
  name: string;
  glyphCount: number;
  charWidth: number;
  charHeight: number;
  bytesPerGlyph: number;
  data: Uint8Array;
}

export function getGlyphData(
  font: BitmapFont,
  charCode: number,
): Uint8Array {
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
  const byteIndex = y * font.bytesPerGlyph;
  if (byteIndex >= glyphData.length) return 0;
  const bit = (font.charWidth - 1 - x);
  return (glyphData[byteIndex] >> bit) & 1;
}

export function getGlyphBitLsb(
  font: BitmapFont,
  charCode: number,
  x: number,
  y: number,
): number {
  const glyphData = getGlyphData(font, charCode);
  const byteIndex = y;
  if (byteIndex >= glyphData.length) return 0;
  const bit = x % 8;
  return (glyphData[byteIndex] >> (7 - bit)) & 1;
}

export function loadFontFromBin(
  name: string,
  data: Uint8Array,
  glyphCount: number,
  charWidth: number,
  charHeight: number,
): BitmapFont {
  const bytesPerGlyph = charHeight * Math.ceil(charWidth / 8);
  return {
    name,
    glyphCount,
    charWidth,
    charHeight,
    bytesPerGlyph,
    data,
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

  return { name: 'default', glyphCount, charWidth, charHeight, bytesPerGlyph, data };
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
      const bit = getGlyphBitLsb(font, charCode, col, row);
      const px = posX + col;
      const py = posY + row;
      if (px >= 0 && px < bufferWidth && py >= 0) {
        buffer[py * bufferWidth + px] = bit ? fgColor : bgColor;
      }
    }
  }
}
