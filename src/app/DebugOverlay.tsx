import { signal } from '@preact/signals';

export interface DiagInfo {
  fps: number;
  frameTime: number;
  rendererKind: string;
  sourceW: number;
  sourceH: number;
  viewportW: number;
  viewportH: number;
  par: number;
  zoom: number;
  dpr: number;
  fontId: string;
  machineName: string;
}

export const diagSignal = signal<DiagInfo>({
  fps: 0, frameTime: 0, rendererKind: '-',
  sourceW: 0, sourceH: 0,
  viewportW: 0, viewportH: 0,
  par: 1, zoom: 1, dpr: 1,
  fontId: '', machineName: '',
});

let rafCount = 0;
let rafLast = performance.now();

export function updateDiagFps(): void {
  rafCount++;
  const now = performance.now();
  if (now - rafLast >= 1000) {
    diagSignal.value = { ...diagSignal.value, fps: rafCount, frameTime: Math.round(1000 / rafCount) };
    rafCount = 0;
    rafLast = now;
  }
}

export function DebugOverlay() {
  const d = diagSignal.value;
  return (
    <div class="debug-overlay">
      <div>FPS: {d.fps}  ~{d.frameTime}ms</div>
      <div>Renderer: {d.rendererKind}</div>
      <div>Source: {d.sourceW}×{d.sourceH}</div>
      <div>Viewport: {d.viewportW}×{d.viewportH}</div>
      <div>PAR: {d.par.toFixed(3)}  Zoom: {d.zoom.toFixed(2)}</div>
      <div>DPR: {d.dpr.toFixed(1)}  Font: {d.fontId}</div>
      <div>{d.machineName}</div>
    </div>
  );
}
