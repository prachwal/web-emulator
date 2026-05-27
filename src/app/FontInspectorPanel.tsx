import { signal } from '@preact/signals';
import type { FontDecodeParams, DecodedGlyph } from '../video/fonts/BinaryFontDecoder';
import { BinaryFontDecoder, defaultFontParams } from '../video/fonts/BinaryFontDecoder';
import { validateId, generateJsonExport, generateTsExport } from '../video/fonts/FontPresetExport';

interface InspectorState {
  fileName: string;
  fileSize: number;
  data: Uint8Array | null;
  params: FontDecodeParams;
  glyphs: DecodedGlyph[];
  selectedChar: number;
  error: string | null;
}

const state = signal<InspectorState>({
  fileName: '', fileSize: 0, data: null,
  params: defaultFontParams(), glyphs: [], selectedChar: 32, error: null,
});

interface ExportFormState {
  id: string; name: string; computer: string; sourcePath: string; mapperId: 'ascii' | 'petscii';
}

const exportForm = signal<ExportFormState>({ id: 'my-font', name: 'My Font', computer: 'Custom', sourcePath: '', mapperId: 'ascii' });

function reload(data: Uint8Array, params: FontDecodeParams): void {
  const decoder = new BinaryFontDecoder(data, params);
  state.value = {
    ...state.value,
    data, params,
    error: decoder.error,
    glyphs: decoder.isValid ? decoder.decodeAll() : [],
  };
}

function updateParam<K extends keyof FontDecodeParams>(key: K, value: FontDecodeParams[K]): void {
  const next = { ...state.value.params, [key]: value };
  if (state.value.data) reload(state.value.data, next);
}

export function FontInspectorPanel() {
  const s = state.value;
  const sel = s.glyphs[s.selectedChar];
  const gridSize = 16;
  const rows = Math.ceil(s.params.glyphCount / gridSize);

  return (
    <div class="settings-panel" style="position:fixed;top:40px;right:0;background:#222;padding:8px;z-index:100;border:1px solid #444;width:340px;font-size:11px;color:#ccc;overflow-y:auto;max-height:90vh">
      <div style="font-weight:bold;margin-bottom:6px">Font Inspector</div>

      <input type="file" accept=".bin,.rom,.vid,.u43,.u9"
        onChange={async e => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const buf = await file.arrayBuffer();
          const data = new Uint8Array(buf);
          const params = defaultFontParams(data);
          state.value = { ...state.value, fileName: file.name, fileSize: data.length, data, params, glyphs: [], selectedChar: 32, error: null };
          reload(data, params);
        }} />
      <div>{s.fileName} ({s.fileSize}B)</div>

      {s.error && <div style="color:#f44;margin:4px 0">{s.error}</div>}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin:6px 0">
        <label>Width<input type="number" min="1" max="16" value={s.params.charWidth} onChange={e => updateParam('charWidth', +e.currentTarget.value)} /></label>
        <label>Height<input type="number" min="1" max="32" value={s.params.charHeight} onChange={e => updateParam('charHeight', +e.currentTarget.value)} /></label>
        <label>Cell W<input type="number" min="1" max="16" value={s.params.cellWidth} onChange={e => updateParam('cellWidth', +e.currentTarget.value)} /></label>
        <label>Cell H<input type="number" min="1" max="32" value={s.params.cellHeight} onChange={e => updateParam('cellHeight', +e.currentTarget.value)} /></label>
        <label>Glyphs<input type="number" min="1" max="1024" value={s.params.glyphCount} onChange={e => updateParam('glyphCount', +e.currentTarget.value)} /></label>
        <label>Offset<input type="number" min="0" step="1" value={s.params.offset} onChange={e => updateParam('offset', +e.currentTarget.value)} /></label>
        <label>B/Glyph<input type="number" min="1" max="32" value={s.params.bytesPerGlyph} onChange={e => updateParam('bytesPerGlyph', +e.currentTarget.value)} /></label>
        <label>B/Row<input type="number" min="0" max="8" value={s.params.bytesPerRow} onChange={e => updateParam('bytesPerRow', +e.currentTarget.value)} /></label>
        <label>Bit order<select value={s.params.bitOrder} onChange={e => updateParam('bitOrder', e.currentTarget.value as any)}>
          <option value="msb-first">MSB</option><option value="lsb-first">LSB</option>
        </select></label>
        <label>Invert<input type="checkbox" checked={s.params.invert} onChange={e => updateParam('invert', e.currentTarget.checked)} /></label>
      </div>

      {/* glyph grid */}
      {s.glyphs.length > 0 && <>
        <div style="margin:6px 0;display:grid;grid-template-columns:repeat(16,1fr);gap:1px;background:#444;padding:1px">
          {s.glyphs.map((g, i) =>
            <div key={i}
              onClick={() => state.value = { ...state.value, selectedChar: i }}
              style={`cursor:pointer;background:${i === s.selectedChar ? '#448' : '#222'};padding:1px;text-align:center;font-size:9px`}
              title={`$${i.toString(16).toUpperCase()} (${i})`}>
              <GlyphPreview glyph={g} scale={1} />
              <div style="font-size:7px;color:#888">{i.toString(16).padStart(2,'0')}</div>
            </div>
          )}
        </div>

        {/* selected glyph detail */}
        {sel && <div style="margin:6px 0;text-align:center">
          <div style="font-weight:bold">Char ${s.selectedChar.toString(16).toUpperCase()} ({s.selectedChar})</div>
          <GlyphPreview glyph={sel} scale={8} />
          <div style="font-size:9px;color:#888;margin-top:2px">
            {sel.pixels.slice(0, sel.width * Math.min(4, sel.height)).join('').replace(/0/g,'.').replace(/1/g,'#').substring(0, sel.width * 2)}
          </div>
        </div>}

        {/* export section */}
        {s.fileName && <div style="margin:8px 0;padding:6px;background:#1a1a1a;border-radius:4px">
          <div style="font-weight:bold;margin-bottom:4px">Export FontPreset</div>
          <label>ID<input type="text" value={exportForm.value.id}
            onChange={e => { const v = e.currentTarget.value; const base = s.fileName.replace(/\.\w+$/,'').toLowerCase().replace(/[^a-z0-9_-]/g,'-'); exportForm.value = { ...exportForm.value, id: v || base }; }} style="width:100%;box-sizing:border-box" /></label>
          <label>Name<input type="text" value={exportForm.value.name}
            onChange={e => exportForm.value = { ...exportForm.value, name: e.currentTarget.value || s.fileName.replace(/\.\w+$/,'') }} style="width:100%;box-sizing:border-box" /></label>
          <label>Computer<input type="text" value={exportForm.value.computer}
            onChange={e => exportForm.value = { ...exportForm.value, computer: e.currentTarget.value }} style="width:100%;box-sizing:border-box" /></label>
          <label>Source path<input type="text" value={exportForm.value.sourcePath || s.fileName}
            onChange={e => exportForm.value = { ...exportForm.value, sourcePath: e.currentTarget.value }} style="width:100%;box-sizing:border-box" /></label>
          <label>Mapper<select value={exportForm.value.mapperId}
            onChange={e => exportForm.value = { ...exportForm.value, mapperId: e.currentTarget.value as any }}>
            <option value="ascii">ASCII</option><option value="petscii">PETSCII</option>
          </select></label>
          <div style="display:flex;gap:4px;margin-top:6px">
            <button onClick={() => {
              const f = exportForm.value;
              const err = validateId(f.id);
              if (err) { alert(err); return; }
              const json = generateJsonExport(s.params, { id: f.id, name: f.name, computer: f.computer, sourcePath: f.sourcePath || s.fileName, mapperId: f.mapperId });
              navigator.clipboard.writeText(json).then(() => alert('JSON copied!'));
            }}>Copy JSON</button>
            <button onClick={() => {
              const f = exportForm.value;
              try {
                const ts = generateTsExport(s.params, { id: f.id, name: f.name, computer: f.computer, sourcePath: f.sourcePath || s.fileName, mapperId: f.mapperId });
                navigator.clipboard.writeText(ts).then(() => alert('TS config copied!'));
              } catch (e: any) { alert(e.message); }
            }}>Copy TS</button>
          </div>
          <div style="font-size:9px;color:#666;margin-top:4px">Paste into <code>fontPresets.ts</code></div>
        </div>}
      </>}
    </div>
  );
}

function GlyphPreview({ glyph, scale }: { glyph: DecodedGlyph; scale: number }) {
  const w = glyph.width * scale;
  const h = glyph.height * scale;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < glyph.height; y++) {
    for (let x = 0; x < glyph.width; x++) {
      const on = glyph.pixels[y * glyph.width + x];
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const pi = ((y * scale + sy) * w + (x * scale + sx)) * 4;
          img.data[pi] = on ? 200 : 20;
          img.data[pi + 1] = on ? 200 : 20;
          img.data[pi + 2] = on ? 200 : 20;
          img.data[pi + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  const src = canvas.toDataURL();
  return <img src={src} width={w} height={h} style="image-rendering:pixelated;vertical-align:middle" />;
}
