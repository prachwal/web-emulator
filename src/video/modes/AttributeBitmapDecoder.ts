import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface AttributeBitmapMemory {
  bitmap: Uint8Array;
  attributes: Uint8Array;
  width: number;
  height: number;
  attrCols: number;
  attrRows: number;
  borderColorIndex: number;
  frameNumber: number;
}

export class AttributeBitmapDecoder implements IVideoModeDecoder<AttributeBitmapMemory> {
  readonly id = 'attribute-bitmap' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(width: number = 256, height: number = 192) {
    this.sourceWidth = width;
    this.sourceHeight = height;
  }

  decode(memory: AttributeBitmapMemory, target: Uint8Array, frameNumber: number): void {
    const { bitmap, attributes, width, height, attrCols, attrRows } = memory;
    const attrWidth = Math.ceil(width / attrCols);
    const attrHeight = Math.ceil(height / attrRows);
    const bitmapBytesPerRow = Math.ceil(width / 8);

    target.fill(memory.borderColorIndex);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const byteIndex = y * bitmapBytesPerRow + Math.floor(x / 8);
        const bit = byteIndex < bitmap.length
          ? (bitmap[byteIndex] >> (7 - (x % 8))) & 1
          : 0;

        const attrCol = Math.floor(x / attrWidth);
        const attrRow = Math.floor(y / attrHeight);
        const attrIndex = attrRow * attrCols + attrCol;
        const attr = attrIndex < attributes.length ? attributes[attrIndex] : 0;

        const ink = attr & 0x07;
        const paper = (attr >> 3) & 0x07;
        const bright = (attr >> 6) & 0x01;
        const flash = (attr >> 7) & 0x01;

        let useInk = bit !== 0;
        if (flash) {
          const flashPhase = Math.floor(frameNumber / 16) % 2;
          useInk = flashPhase === 0 ? bit !== 0 : bit === 0;
        }

        let colorIndex = useInk ? ink : paper;
        if (bright && colorIndex < 8) {
          colorIndex += 8;
        }
        target[y * width + x] = colorIndex;
      }
    }
  }
}
