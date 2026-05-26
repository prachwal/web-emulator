import { describe, it, expect } from 'vitest';
import { computeViewport, videoModeToGeometry, getDefinitionForMode } from '../video/DisplayGeometry';

describe('computeViewport', () => {
  it('handles square pixels', () => {
    const vp = computeViewport(
      { sourceWidth: 256, sourceHeight: 192, pixelAspectRatio: 1, integerScale: true, overscanX: 0, overscanY: 0 },
      800, 600,
    );
    expect(vp.scale).toBe(3);
    expect(vp.viewportWidth).toBe(768);
    expect(vp.viewportHeight).toBe(576);
    expect(vp.offsetX).toBe(16);
    expect(vp.offsetY).toBe(12);
  });

  it('applies pixelAspectRatio < 1', () => {
    const vp = computeViewport(
      { sourceWidth: 320, sourceHeight: 200, pixelAspectRatio: 5 / 6, integerScale: true, overscanX: 0, overscanY: 0 },
      800, 600,
    );
    expect(vp.logicalWidth).toBeCloseTo(266.667);
    expect(vp.logicalHeight).toBe(200);
    expect(vp.scale).toBe(3);
    expect(vp.viewportWidth).toBe(800);
    expect(vp.viewportHeight).toBe(600);
  });

  it('applies pixelAspectRatio at scale 1', () => {
    const vp = computeViewport(
      { sourceWidth: 320, sourceHeight: 200, pixelAspectRatio: 5 / 6, integerScale: true, overscanX: 0, overscanY: 0 },
      267, 200,
    );
    expect(vp.scale).toBe(1);
    expect(vp.viewportWidth).toBe(267);
    expect(vp.viewportHeight).toBe(200);
  });

  it('centers viewport with letterboxing', () => {
    const vp = computeViewport(
      { sourceWidth: 100, sourceHeight: 100, pixelAspectRatio: 1, integerScale: true, overscanX: 0, overscanY: 0 },
      500, 300,
    );
    expect(vp.scale).toBe(3);
    expect(vp.viewportWidth).toBe(300);
    expect(vp.viewportHeight).toBe(300);
    expect(vp.offsetX).toBe(100);
    expect(vp.offsetY).toBe(0);
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
