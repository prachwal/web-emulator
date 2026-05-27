export type DiffMode = 'current' | 'reference' | 'overlay' | 'side-by-side' | 'difference';

export interface ReferenceImageState {
  imageData: ImageData | null;
  filename: string;
  width: number;
  height: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  diffMode: DiffMode;
}

export function defaultRefState(): ReferenceImageState {
  return {
    imageData: null, filename: '', width: 0, height: 0,
    opacity: 0.5, offsetX: 0, offsetY: 0, scale: 1,
    diffMode: 'overlay',
  };
}

export function loadReferenceImage(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export interface DiffMetrics {
  avgDiff: number;
  maxDiff: number;
  matchPercent: number;
}

export function computeDiff(
  a: ImageData,
  b: ImageData,
  offsetX: number,
  offsetY: number,
  scale: number,
): DiffMetrics {
  const ow = Math.min(a.width, Math.floor((b.width - offsetX) / scale));
  const oh = Math.min(a.height, Math.floor((b.height - offsetY) / scale));
  if (ow <= 0 || oh <= 0) return { avgDiff: 1, maxDiff: 1, matchPercent: 0 };

  let totalDiff = 0;
  let maxDiff = 0;
  let count = 0;

  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const ax = x, ay = y;
      const bx = Math.round(x * scale + offsetX);
      const by = Math.round(y * scale + offsetY);
      if (bx < 0 || bx >= b.width || by < 0 || by >= b.height) continue;

      const ai = (ay * a.width + ax) * 4;
      const bi = (by * b.width + bx) * 4;
      const dr = Math.abs(a.data[ai] - b.data[bi]);
      const dg = Math.abs(a.data[ai + 1] - b.data[bi + 1]);
      const db = Math.abs(a.data[ai + 2] - b.data[bi + 2]);
      const diff = (dr + dg + db) / 3;
      totalDiff += diff;
      maxDiff = Math.max(maxDiff, diff);
      count++;
    }
  }

  const avgDiff = count > 0 ? totalDiff / count / 255 : 1;
  const matchPercent = count > 0 ? (1 - avgDiff) * 100 : 0;
  return { avgDiff, maxDiff: maxDiff / 255, matchPercent };
}
