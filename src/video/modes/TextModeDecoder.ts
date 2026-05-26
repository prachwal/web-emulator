import type { IVideoModeDecoder } from './IVideoModeDecoder';
import type { BitmapFont } from '../BitmapFont';
import { getGlyphBit } from '../BitmapFont';

export interface TextModeMemory {
  columns: number;
  rows: number;
  charWidth: number;
  charHeight: number;
  screenRam: Uint8Array;
  colorRam: Uint8Array;
  font: BitmapFont;
  backgroundColorIndex: number;
  colorModel?: 'mda' | 'c64' | 'zx' | 'cga' | 'vic20';
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
    const { columns, rows, charWidth, charHeight, screenRam, colorRam, font, backgroundColorIndex, colorModel } = memory;
    const rowStride = columns * charWidth;
    target.fill(backgroundColorIndex);

    for (let cellRow = 0; cellRow < rows; cellRow++) {
      for (let cellCol = 0; cellCol < columns; cellCol++) {
        const cellIndex = cellRow * columns + cellCol;
        const charCode = cellIndex < screenRam.length ? screenRam[cellIndex] : 0x20;

        let fgIdx = 7;
        let bgIdx = backgroundColorIndex;

        if (cellIndex < colorRam.length) {
          const cr = colorRam[cellIndex];
          if (colorModel === 'c64' || colorModel === 'vic20') {
            fgIdx = cr & 0x0f;
            bgIdx = backgroundColorIndex;
          } else if (colorModel === 'zx') {
            const flash = (cr >> 7) & 1;
            const flashPhase = Math.floor(_frameNumber / 16) % 2;
            fgIdx = cr & 0x07;
            bgIdx = (cr >> 3) & 0x07;
            if (cr & 0x40) { fgIdx += 8; bgIdx += 8; }
            if (flash && flashPhase) { const tmp = fgIdx; fgIdx = bgIdx; bgIdx = tmp; }
          } else if (colorModel === 'cga' || colorModel === 'mda') {
            const blink = (cr >> 7) & 1;
            const blinkPhase = Math.floor(_frameNumber / 16) % 2;
            fgIdx = cr & 0x0f;
            bgIdx = (cr >> 4) & 0x07;
            if (blink && blinkPhase) { const tmp = fgIdx; fgIdx = bgIdx; bgIdx = tmp; }
          } else {
            fgIdx = cr & 0x0f;
            bgIdx = (cr >> 4) & 0x0f;
          }
        }

        for (let row = 0; row < charHeight; row++) {
          for (let col = 0; col < charWidth; col++) {
            const px = cellCol * charWidth + col;
            const py = cellRow * charHeight + row;
            const isUnderline = colorModel === 'mda' && fgIdx === 1 && row >= charHeight - 2;
            const bit = isUnderline ? 1 : getGlyphBit(font, charCode, col, row);
            target[py * rowStride + px] = bit ? fgIdx : bgIdx;
          }
        }
      }
    }
  }
}
