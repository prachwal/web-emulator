import type { IVideoModeDecoder } from './IVideoModeDecoder';
import type { BitmapFont } from '../BitmapFont';
import { getGlyphBitLsb } from '../BitmapFont';

export interface TextModeMemory {
  columns: number;
  rows: number;
  charWidth: number;
  charHeight: number;
  screenRam: Uint8Array;
  colorRam: Uint8Array;
  font: BitmapFont;
  backgroundColorIndex: number;
}

export class TextModeDecoder implements IVideoModeDecoder<TextModeMemory> {
  readonly id = 'text' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(columns: number = 40, rows: number = 25, charWidth: number = 8, charHeight: number = 8) {
    this.sourceWidth = columns * charWidth;
    this.sourceHeight = rows * charHeight;
  }

  decode(memory: TextModeMemory, target: Uint8Array, _frameNumber: number): void {
    const { columns, rows, charWidth, charHeight, screenRam, colorRam, font, backgroundColorIndex } = memory;
    const rowStride = columns * charWidth;
    target.fill(backgroundColorIndex);

    for (let cellRow = 0; cellRow < rows; cellRow++) {
      for (let cellCol = 0; cellCol < columns; cellCol++) {
        const cellIndex = cellRow * columns + cellCol;
        const charCode = cellIndex < screenRam.length ? screenRam[cellIndex] : 0x20;
        const color = cellIndex < colorRam.length ? colorRam[cellIndex] : 7;
        const bgColor = cellIndex < colorRam.length ? (colorRam[cellIndex] >> 4) & 0x0f : 0;

        for (let row = 0; row < charHeight; row++) {
          for (let col = 0; col < charWidth; col++) {
            const bit = getGlyphBitLsb(font, charCode, col, row);
            const px = cellCol * charWidth + col;
            const py = cellRow * charHeight + row;
            target[py * rowStride + px] = bit ? color : bgColor;
          }
        }
      }
    }
  }
}
