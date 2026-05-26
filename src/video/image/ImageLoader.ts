import { parseCssHexColor } from '../Palette';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function paletteToRgb(colors: string[]): number[][] {
  return colors.map(c => {
    const [r, g, b] = parseCssHexColor(c);
    return [r, g, b];
  });
}

function findNearestColorIndex(
  r: number, g: number, b: number,
  paletteRgb: number[][],
): number {
  let bestIdx = 0;
  let bestDist = Infinity;

  for (let i = 0; i < paletteRgb.length; i++) {
    const dr = r - paletteRgb[i][0];
    const dg = g - paletteRgb[i][1];
    const db = b - paletteRgb[i][2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  return bestIdx;
}

export function imageToIndexedFramebuffer(
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  palette: string[],
): Uint8Array {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixels = imageData.data;
  const paletteRgb = paletteToRgb(palette);
  const framebuffer = new Uint8Array(targetWidth * targetHeight);

  for (let i = 0; i < targetWidth * targetHeight; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];
    framebuffer[i] = findNearestColorIndex(r, g, b, paletteRgb);
  }

  return framebuffer;
}
