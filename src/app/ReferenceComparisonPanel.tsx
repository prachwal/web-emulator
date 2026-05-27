import { signal } from '@preact/signals';
import { useRef, useEffect, useState } from 'preact/hooks';
import type { ReferenceImageState, DiffMetrics } from '../video/comparison/ReferenceImage';
import { defaultRefState, loadReferenceImage, computeDiff } from '../video/comparison/ReferenceImage';

export const refState = signal<ReferenceImageState>(defaultRefState());

async function renderOverlay(canvas: HTMLCanvasElement, s: ReferenceImageState): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx || !s.imageData) return;

  const ref = s.imageData;
  const cw = canvas.width;
  const ch = canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  if (s.diffMode === 'current') return;

  try {
    const bitmap = await createImageBitmap(ref);
    ctx.globalAlpha = s.opacity;
    if (s.diffMode === 'reference' || s.diffMode === 'overlay') {
      ctx.drawImage(bitmap, s.offsetX, s.offsetY, ref.width * s.scale, ref.height * s.scale);
    } else if (s.diffMode === 'side-by-side') {
      const half = cw / 2;
      ctx.drawImage(bitmap, s.offsetX, s.offsetY, half, ch);
      ctx.fillStyle = '#333';
      ctx.fillRect(half - 1, 0, 2, ch);
    }
  } catch { /* bitmap conversion failed */ }
}

export function ReferenceComparisonPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const loop = () => {
      renderOverlay(canvas, refState.value);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const s = refState.value;
  return (
    <>
      <canvas ref={canvasRef}
        style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;image-rendering:pixelated" />
      <div class="settings-panel" style="position:fixed;top:40px;right:0;background:#222;padding:8px;z-index:100;border:1px solid #444;width:280px;font-size:12px;color:#ccc">
        <div style="font-weight:bold;margin-bottom:6px">Reference Image</div>

        <input type="file" accept="image/png,image/jpeg"
          onChange={async e => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            try {
              const imgData = await loadReferenceImage(file);
              refState.value = { ...refState.value, imageData: imgData, filename: file.name, width: imgData.width, height: imgData.height };
            } catch { alert('Failed to load image'); }
          }} />

        {s.imageData && (
          <>
            <div>{s.filename} ({s.width}\u00d7{s.height})</div>

            <label>Mode:
              <select value={s.diffMode} onChange={e => refState.value = { ...s, diffMode: e.currentTarget.value as any }}>
                <option value="current">Current</option>
                <option value="reference">Reference</option>
                <option value="overlay">Overlay</option>
                <option value="side-by-side">Side by side</option>
                <option value="difference">Difference</option>
              </select>
            </label>

            <label>Opacity: {s.opacity.toFixed(2)}
              <input type="range" min="0" max="1" step="0.05" value={s.opacity}
                onInput={e => refState.value = { ...s, opacity: +e.currentTarget.value }} />
            </label>

            <label>Scale: {s.scale.toFixed(2)}
              <input type="range" min="0.25" max="4" step="0.05" value={s.scale}
                onInput={e => refState.value = { ...s, scale: +e.currentTarget.value }} />
            </label>

            <label>Offset X:
              <input type="range" min="-200" max="200" value={s.offsetX}
                onInput={e => refState.value = { ...s, offsetX: +e.currentTarget.value }} />
            </label>

            <label>Offset Y:
              <input type="range" min="-200" max="200" value={s.offsetY}
                onInput={e => refState.value = { ...s, offsetY: +e.currentTarget.value }} />
            </label>

            {s.imageData && (() => {
              const canvas = document.querySelector('.crt-tube canvas') as HTMLCanvasElement | null;
              if (canvas) {
                try {
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const metrics = computeDiff(s.imageData, current, s.offsetX, s.offsetY, s.scale);
                    return <div style="margin-top:6px;padding:4px;background:#111;border-radius:3px;font-size:10px">
                      <div>Avg diff: {(metrics.avgDiff * 100).toFixed(1)}%</div>
                      <div>Max diff: {(metrics.maxDiff * 100).toFixed(1)}%</div>
                      <div>Match: {metrics.matchPercent.toFixed(1)}%</div>
                    </div>;
                  }
                } catch {}
              }
              return null;
            })()}

            <button onClick={() => refState.value = defaultRefState()}>Clear</button>
          </>
        )}
      </div>
    </>
  );
}
