export interface Sprite {
  width: number;
  height: number;
  data: Uint8Array;
  x: number;
  y: number;
  transparentIndex: number;
  paletteOffset: number;
  flipX: boolean;
  flipY: boolean;
  priority: number;
  scale: number;
}

export function renderSprite(
  sprite: Sprite,
  target: Uint8Array,
  targetWidth: number,
  targetHeight: number,
): void {
  const { data, width, height, x, y, transparentIndex, paletteOffset, flipX, flipY, scale } = sprite;
  const s = Math.max(1, Math.floor(scale));

  for (let sy = 0; sy < height * s; sy++) {
    const srcY = flipY ? (height * s - 1 - sy) : sy;
    const destY = y + sy;
    if (destY < 0 || destY >= targetHeight) continue;

    for (let sx = 0; sx < width * s; sx++) {
      const srcX = flipX ? (width * s - 1 - sx) : sx;
      const destX = x + sx;
      if (destX < 0 || destX >= targetWidth) continue;

      const srcPixel = data[Math.floor(srcY / s) * width + Math.floor(srcX / s)];
      if (srcPixel === transparentIndex) continue;

      const colorIndex = Math.min(srcPixel + paletteOffset, 255);
      target[destY * targetWidth + destX] = colorIndex;
    }
  }
}
