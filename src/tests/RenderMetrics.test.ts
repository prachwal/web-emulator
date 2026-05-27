import { describe, it, expect } from 'vitest';
import { createMetricsCollector } from '../core/RenderMetrics';

describe('createMetricsCollector', () => {
  it('snapshot returns zero values initially', () => {
    const m = createMetricsCollector();
    const s = m.snapshot(0, 'webgl2', 16);
    expect(s.dirtyCellsCount).toBe(0);
    expect(s.frameNumber).toBe(0);
    expect(s.rendererKind).toBe('webgl2');
  });

  it('records dirty cell count', () => {
    const m = createMetricsCollector();
    m.beginTextRender();
    m.endTextRender(42, false);
    const s = m.snapshot(1, 'canvas2d', 16);
    expect(s.dirtyCellsCount).toBe(42);
  });

  it('increments full rerender count', () => {
    const m = createMetricsCollector();
    m.beginTextRender();
    m.endTextRender(100, true);
    m.beginTextRender();
    m.endTextRender(50, true);
    const s = m.snapshot(2, 'test', 16);
    expect(s.fullRerenderCount).toBe(2);
  });

  it('reset clears counters', () => {
    const m = createMetricsCollector();
    m.beginTextRender();
    m.endTextRender(10, true);
    m.reset();
    const s = m.snapshot(0, 'test', 0);
    expect(s.dirtyCellsCount).toBe(0);
    expect(s.fullRerenderCount).toBe(0);
  });
});
