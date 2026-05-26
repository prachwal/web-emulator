import { displaySettings, updateDisplaySettings } from './DisplaySettings';

export function DisplaySettingsPanel() {
  const s = displaySettings.value;

  return (
    <div class="settings-panel">
      <div class="settings-section">
        <label class="crt-label">Scale mode</label>
        <select class="toolbar-select settings-select"
          value={s.scaleMode}
          onChange={e => updateDisplaySettings({ scaleMode: (e.target as HTMLSelectElement).value as 'integer' | 'smooth' })}>
          <option value="integer">Integer (pixel-perfect)</option>
          <option value="smooth">Smooth (fill screen)</option>
        </select>
      </div>

      <div class="settings-section">
        <label class="crt-label">PAR multiplier</label>
        <input class="settings-slider" type="range" min="50" max="200" value={Math.round(s.parMultiplier * 100)}
          onInput={e => updateDisplaySettings({ parMultiplier: Number((e.target as HTMLInputElement).value) / 100 })} />
        <span class="settings-value">{s.parMultiplier.toFixed(2)}x</span>
      </div>

      <div class="settings-section">
        <label class="crt-label">Zoom</label>
        <input class="settings-slider" type="range" min="25" max="200" value={Math.round(s.zoom * 100)}
          onInput={e => updateDisplaySettings({ zoom: Number((e.target as HTMLInputElement).value) / 100 })} />
        <span class="settings-value">{s.zoom.toFixed(2)}x</span>
      </div>

      <div class="settings-section">
        <label class="crt-label">Border</label>
        <input type="checkbox"
          checked={s.showBorder}
          onChange={e => updateDisplaySettings({ showBorder: (e.target as HTMLInputElement).checked })} />
      </div>
    </div>
  );
}
