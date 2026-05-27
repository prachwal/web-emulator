import { describe, it, expect } from 'vitest';
import { computeDiff } from '../video/comparison/ReferenceImage';

function makeImageData(w: number, h: number, fill: (x: number, y: number) => [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = fill(x, y);
      const i = (y * w + x) * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
    }
  }
  return { width: w, height: h, data } as ImageData;
}

describe('computeDiff', () => {
  it('returns 0 difference for identical images', () => {
    const a = makeImageData(16, 16, () => [128, 64, 32]);
    const b = makeImageData(16, 16, () => [128, 64, 32]);
    const m = computeDiff(a, b, 0, 0, 1);
    expect(m.avgDiff).toBe(0);
    expect(m.maxDiff).toBe(0);
    expect(m.matchPercent).toBe(100);
  });

  it('detects different images', () => {
    const a = makeImageData(8, 8, () => [0, 0, 0]);
    const b = makeImageData(8, 8, () => [255, 255, 255]);
    const m = computeDiff(a, b, 0, 0, 1);
    expect(m.avgDiff).toBeGreaterThan(0.5);
    expect(m.matchPercent).toBeLessThan(50);
  });

  it('handles offset', () => {
    const a = makeImageData(4, 4, (x, y) => [x * 60, y * 60, 0]);
    const b = makeImageData(8, 8, (x, y) => [x * 30, y * 30, 0]);
    const m = computeDiff(a, b, 2, 2, 1);
    expect(m.avgDiff).toBeGreaterThan(0);
  });
});
