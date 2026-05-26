import type { IVideoModeDecoder } from './IVideoModeDecoder';

export interface TilemapMemory {
  mapWidth: number;
  mapHeight: number;
  tileWidth: number;
  tileHeight: number;
  tileMap: Uint16Array;
  tileData: Uint8Array;
  paletteMap?: Uint8Array;
  scrollX: number;
  scrollY: number;
  bpp: 1 | 2 | 4;
}

export class TilemapDecoder implements IVideoModeDecoder<TilemapMemory> {
  readonly id = 'tilemap' as const;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  constructor(width: number = 256, height: number = 192) {
    this.sourceWidth = width;
    this.sourceHeight = height;
  }

  decode(memory: TilemapMemory, target: Uint8Array, _frameNumber: number): void {
    const {
      mapWidth, mapHeight,
      tileWidth, tileHeight,
      tileMap, tileData,
      paletteMap, bpp,
    } = memory;

    const scrollX = memory.scrollX % (mapWidth * tileWidth);
    const scrollY = memory.scrollY % (mapHeight * tileHeight);
    const tileSizeBytes = (tileWidth * tileHeight * bpp) / 8;

    target.fill(0);

    for (let py = 0; py < this.sourceHeight; py++) {
      for (let px = 0; px < this.sourceWidth; px++) {
        const worldX = (px + scrollX) % (mapWidth * tileWidth);
        const worldY = (py + scrollY) % (mapHeight * tileHeight);
        const tileCol = Math.floor(worldX / tileWidth);
        const tileRow = Math.floor(worldY / tileHeight);
        const tileIndex = tileRow * mapWidth + tileCol;
        const tileId = tileIndex < tileMap.length ? tileMap[tileIndex] : 0;

        const localX = worldX % tileWidth;
        const localY = worldY % tileHeight;

        let colorIndex = 0;
        if (bpp === 1) {
          const byteOff = tileId * tileSizeBytes + localY;
          const bitData = byteOff < tileData.length ? tileData[byteOff] : 0;
          colorIndex = (bitData >> (7 - localX)) & 1;
        } else if (bpp === 2) {
          const tileStart = tileId * tileSizeBytes;
          const rowStart = tileStart + localY * Math.ceil(tileWidth / 4);
          const nibble = localX >> 2;
          const byteOff = rowStart + nibble;
          const shift = 6 - ((localX % 4) * 2);
          colorIndex = byteOff < tileData.length
            ? (tileData[byteOff] >> shift) & 0x03
            : 0;
        } else {
          const tileStart = tileId * tileSizeBytes;
          const byteOff = tileStart + localY * tileWidth + localX;
          colorIndex = byteOff < tileData.length ? tileData[byteOff] : 0;
        }

        if (paletteMap && tileIndex < paletteMap.length) {
          const palOffset = paletteMap[tileIndex] * 16;
          colorIndex = Math.min(colorIndex + palOffset, 255);
        }

        target[py * this.sourceWidth + px] = colorIndex;
      }
    }
  }
}
