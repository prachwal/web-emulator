import { signal } from '@preact/signals';
import type { ReferenceImageState } from '../video/comparison/ReferenceImage';
import { defaultRefState, loadReferenceImage } from '../video/comparison/ReferenceImage';

export const refState = signal<ReferenceImageState>(defaultRefState());

export function ReferenceComparisonPanel() {
  const s = refState.value;
  return (
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
          <div>{s.filename} ({s.width}×{s.height})</div>

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

          <button onClick={() => refState.value = defaultRefState()}>Clear</button>
        </>
      )}
    </div>
  );
}
