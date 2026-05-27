export interface RenderMetrics {
  cpuTextRenderMs: number;
  dirtyCellsCount: number;
  fullRerenderCount: number;
  frameUploadMs: number;
  renderMs: number;
  rafDeltaMs: number;
  frameNumber: number;
  rendererKind: string;
}

export interface MetricsCollector {
  /** Called before text rendering */
  beginTextRender(): void;
  /** Called after text rendering, with dirty/full info */
  endTextRender(dirtyCells: number, isFull: boolean): void;
  /** Called before framebuffer upload */
  beginUpload(): void;
  /** Called after framebuffer upload */
  endUpload(): void;
  /** Called after full render (including CRT pass) */
  endRender(): void;
  /** Get current metrics snapshot */
  snapshot(frameNumber: number, rendererKind: string, rafDelta: number): RenderMetrics;
  /** Reset all counters */
  reset(): void;
}

const SMOOTHING = 0.3;

export function createMetricsCollector(): MetricsCollector {
  let textRenderAccum = 0;
  let uploadAccum = 0;
  let renderAccum = 0;
  let dirtyCount = 0;
  let fullCount = 0;
  let textStart = 0;
  let uploadStart = 0;

  return {
    beginTextRender() { textStart = performance.now(); },
    endTextRender(dirtyCells: number, isFull: boolean) {
      const dt = performance.now() - textStart;
      textRenderAccum = textRenderAccum * (1 - SMOOTHING) + dt * SMOOTHING;
      dirtyCount = dirtyCells;
      if (isFull) fullCount++;
    },
    beginUpload() { uploadStart = performance.now(); },
    endUpload() {
      const dt = performance.now() - uploadStart;
      uploadAccum = uploadAccum * (1 - SMOOTHING) + dt * SMOOTHING;
    },
    endRender() {
      renderAccum = renderAccum * (1 - SMOOTHING) + performance.now() * SMOOTHING;
    },
    snapshot(frameNumber: number, rendererKind: string, rafDelta: number) {
      const now = performance.now();
      return {
        cpuTextRenderMs: Math.round(textRenderAccum * 100) / 100,
        dirtyCellsCount: dirtyCount,
        fullRerenderCount: fullCount,
        frameUploadMs: Math.round(uploadAccum * 100) / 100,
        renderMs: Math.round(renderAccum * 100) / 100,
        rafDeltaMs: Math.round(rafDelta * 100) / 100,
        frameNumber, rendererKind,
      };
    },
    reset() {
      textRenderAccum = 0; uploadAccum = 0; renderAccum = 0;
      dirtyCount = 0; fullCount = 0;
    },
  };
}
