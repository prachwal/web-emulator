export interface FontDecodeParams {
  charWidth: number;
  charHeight: number;
  cellWidth: number;
  cellHeight: number;
  glyphCount: number;
  offset: number;
  bytesPerGlyph: number;
  bytesPerRow: number;
  bitOrder: 'msb-first' | 'lsb-first';
  invert: boolean;
}

export interface DecodedGlyph {
  charCode: number;
  pixels: Uint8Array; // charWidth * charHeight, 1 = ink, 0 = paper
  width: number;
  height: number;
}

export class BinaryFontDecoder {
  constructor(
    public readonly data: Uint8Array,
    public readonly params: FontDecodeParams,
  ) {}

  get expectedSize(): number {
    return this.params.offset + this.params.glyphCount * this.params.bytesPerGlyph;
  }

  get isValid(): boolean {
    return this.data.length >= this.expectedSize;
  }

  get error(): string | null {
    if (this.data.length < this.expectedSize) {
      return `File too small: ${this.data.length}B < ${this.expectedSize}B needed (offset ${this.params.offset} + ${this.params.glyphCount}×${this.params.bytesPerGlyph})`;
    }
    return null;
  }

  decodeGlyph(charCode: number): DecodedGlyph {
    const { charWidth, charHeight, bytesPerGlyph, bytesPerRow, offset, bitOrder, invert } = this.params;
    const start = offset + charCode * bytesPerGlyph;
    const rowBytes = Math.ceil(charWidth / 8);
    const stride = bytesPerRow > 0 ? bytesPerRow : rowBytes;
    const pixels = new Uint8Array(charWidth * charHeight);

    for (let y = 0; y < charHeight; y++) {
      for (let rb = 0; rb < rowBytes; rb++) {
        const byteOffset = start + y * stride + rb;
        if (byteOffset >= this.data.length) continue;
        let byteVal = this.data[byteOffset];
        if (invert) byteVal = ~byteVal & 0xff;
        for (let b = 0; b < 8 && rb * 8 + b < charWidth; b++) {
          const x = rb * 8 + b;
          const bitIdx = bitOrder === 'msb-first' ? 7 - b : b;
          pixels[y * charWidth + x] = (byteVal >> bitIdx) & 1;
        }
      }
    }
    return { charCode, pixels, width: charWidth, height: charHeight };
  }

  decodeAll(): DecodedGlyph[] {
    const result: DecodedGlyph[] = [];
    for (let i = 0; i < this.params.glyphCount; i++) {
      result.push(this.decodeGlyph(i));
    }
    return result;
  }
}

export function defaultFontParams(data?: Uint8Array): FontDecodeParams {
  const len = data?.length ?? 0;
  const guessCount = len > 0 ? Math.floor(len / 8) : 256;
  return {
    charWidth: 8, charHeight: 8, cellWidth: 8, cellHeight: 8,
    glyphCount: Math.min(guessCount, 512),
    offset: 0, bytesPerGlyph: 8, bytesPerRow: 0,
    bitOrder: 'msb-first', invert: false,
  };
}
