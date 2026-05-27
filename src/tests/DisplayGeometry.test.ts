import { describe, it, expect } from 'vitest';
import { computeViewport, videoModeToGeometry, getDefinitionForMode } from '../video/DisplayGeometry';

describe('computeViewport', () => {
  it('handles square pixels', () => {
    const vp = computeViewport(
      { sourceWidth: 256, sourceHeight: 192, pixelAspectRatio: 1, integerScale: true, overscanX: 0, overscanY: 0, zoom: 1 },
      800, 600,
    );
    expect(vp.scale).toBe(2);
    expect(vp.viewportWidth).toBe(512);
    expect(vp.viewportHeight).toBe(384);
    expect(vp.offsetX).toBeGreaterThan(0);
    expect(vp.offsetY).toBeGreaterThan(0);
  });

  it('applies pixelAspectRatio < 1', () => {
    const vp = computeViewport(
      { sourceWidth: 320, sourceHeight: 200, pixelAspectRatio: 5 / 6, integerScale: true, overscanX: 0, overscanY: 0, zoom: 1 },
      800, 600,
    );
    expect(vp.logicalWidth).toBeCloseTo(266.667);
    expect(vp.logicalHeight).toBe(200);
    expect(vp.scale).toBe(2);
    expect(vp.viewportWidth).toBeGreaterThan(0);
    expect(vp.viewportHeight).toBeGreaterThan(0);
  });

  it('applies pixelAspectRatio at scale 1 with small canvas', () => {
    const vp = computeViewport(
      { sourceWidth: 320, sourceHeight: 200, pixelAspectRatio: 5 / 6, integerScale: true, overscanX: 0, overscanY: 0, zoom: 1 },
       267, 200,
    );
    expect(vp.scale).toBeGreaterThanOrEqual(1);
    expect(vp.offsetX).toBeGreaterThanOrEqual(0);
    expect(vp.offsetY).toBeGreaterThanOrEqual(0);
  });

  it('handles maxFill = 0.92 (not integer)', () => {
    const geo = { sourceWidth: 640, sourceHeight: 200, pixelAspectRatio: 5 / 12, integerScale: false, overscanX: 0, overscanY: 0, zoom: 1 };
    const vp = computeViewport(geo, 800, 600);
    expect(vp.viewportWidth).toBeLessThanOrEqual(800);
    expect(vp.viewportHeight).toBeLessThanOrEqual(600);
    expect(vp.offsetX).toBeGreaterThan(0);
    expect(vp.offsetY).toBeGreaterThan(0);
  });

  it('applies zoom < 1 reduces viewport', () => {
    const base = computeViewport(
      { sourceWidth: 256, sourceHeight: 192, pixelAspectRatio: 1, integerScale: false, overscanX: 0, overscanY: 0, zoom: 1 },
      800, 600,
    );
    const zoomed = computeViewport(
      { sourceWidth: 256, sourceHeight: 192, pixelAspectRatio: 1, integerScale: false, overscanX: 0, overscanY: 0, zoom: 0.9 },
      800, 600,
    );
    expect(zoomed.viewportWidth).toBeLessThan(base.viewportWidth);
    expect(zoomed.viewportHeight).toBeLessThan(base.viewportHeight);
  });

  it('centers viewport with letterboxing', () => {
    const vp = computeViewport(
      { sourceWidth: 100, sourceHeight: 100, pixelAspectRatio: 1, integerScale: true, overscanX: 0, overscanY: 0, zoom: 1 },
       500, 300,
    );
    expect(vp.scale).toBe(2);
    expect(vp.viewportWidth).toBe(200);
    expect(vp.viewportHeight).toBe(200);
    expect(vp.offsetX).toBeGreaterThan(0);
    expect(vp.offsetY).toBeGreaterThan(0);
  });
});

describe('videoModeToGeometry', () => {
  it('converts VideoModeDefinition to DisplayGeometry', () => {
    const geo = videoModeToGeometry(
      { id: 'test', width: 320, height: 200, refreshRate: 50, pixelAspectRatio: 5 / 6, recommendedDisplayAspectRatio: 4 / 3 },
    );
    expect(geo.sourceWidth).toBe(320);
    expect(geo.pixelAspectRatio).toBeCloseTo(0.83333);
    expect(geo.integerScale).toBe(true);
  });
});

describe('getDefinitionForMode', () => {
  it('returns known definition', () => {
    const def = getDefinitionForMode('bitmap', 320, 200);
    expect(def.pixelAspectRatio).toBeCloseTo(5 / 6);
  });

  it('returns default for unknown mode', () => {
    const def = getDefinitionForMode('custom', 200, 100);
    expect(def.pixelAspectRatio).toBe(1);
  });
});
