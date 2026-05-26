import { signal, computed } from '@preact/signals';
import { EmulatorViewport } from './EmulatorViewport';
import { SettingsPanel } from './SettingsPanel';
import { DebugOverlay } from './DebugOverlay';
import type { CrtSettings } from '../core/types';
import { defaultCrtSettings } from '../core/types';
import {
  PRESETS, machineIds, machineName, presetsForMachine,
  type Preset,
} from '../video/presets';
import { fontPresets } from '../video/fonts/fontPresets';
import { textVideoModes } from '../video/text/textModes';

// ── Signal-based state ──────────────────────────────
const crt = signal<CrtSettings>(defaultCrtSettings());
const showDebug = signal(false);
const paused = signal(false);

const presetIndex = signal(0);
const currentPreset = computed(() => PRESETS[presetIndex.value]);

const isTextMode = computed(() => currentPreset.value.type === 'text');

const activeFontId = signal(fontPresets[0]?.id ?? '');
const currentMode = computed(() => currentPreset.value.id);
const modeLabel = computed(() => currentPreset.value.label);
const machineLabel = computed(() => currentPreset.value.machineName);

export function AppShell() {
  return (
    <div class="app-layout">
      <Toolbar />
      <div class="viewport">
        <EmulatorViewport
          crt={crt.value}
          preset={currentPreset.value}
          paused={paused.value}
          activeFontId={isTextMode.value ? activeFontId.value : undefined}
        />
      </div>
      <SettingsPanel
        crt={crt.value}
        onCrtChange={u => crt.value = { ...crt.value, ...u }}
      />
      {showDebug.value && <DebugOverlay />}
    </div>
  );
}

function Toolbar() {
  const p = currentPreset.value;
  const mIds = machineIds();
  const variants = presetsForMachine(p.machineId, p.type);

  return (
    <header class="toolbar">
      <h1 class="toolbar-title">CRT</h1>

      <div class="toolbar-divider" />

      <select class="toolbar-select"
        value={`${p.machineId}:${p.type}`}
        onChange={e => {
          const val = (e.target as HTMLSelectElement).value;
          const [mid, type] = val.split(':');
          const variants = presetsForMachine(mid, type as 'text' | 'bitmap');
          if (variants.length > 0) {
            const idx = PRESETS.indexOf(variants[0]);
            if (idx >= 0) presetIndex.value = idx;
          }
        }}>
        {mIds.map(mid => (
          <option key={mid} value={`${mid}:text`}>
            {machineName(mid)}
          </option>
        ))}
      </select>

      <select class="toolbar-select"
        value={currentMode.value}
        onChange={e => {
          const id = (e.target as HTMLSelectElement).value;
          const idx = PRESETS.findIndex(pr => pr.id === id);
          if (idx >= 0) presetIndex.value = idx;
        }}>
        {variants.map(v => (
          <option key={v.id} value={v.id}>{v.label}</option>
        ))}
      </select>

      <div class="toolbar-divider" />

      {isTextMode.value && (
        <>
          <select class="toolbar-select"
            value={currentMode.value}
            onChange={e => {
              const id = (e.target as HTMLSelectElement).value;
              const idx = PRESETS.findIndex(pr => pr.id === id);
              if (idx >= 0) presetIndex.value = idx;
            }}>
            {PRESETS.filter(pr => pr.type === 'text').map(v => (
              <option key={v.id} value={v.id}>{v.machineName} {v.label}</option>
            ))}
          </select>

          <select class="toolbar-select"
            value={activeFontId.value}
            onChange={e => activeFontId.value = (e.target as HTMLSelectElement).value}>
            {fontPresets.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </>
      )}

      <button class="toolbar-btn"
        onClick={() => {
          const cur = isTextMode.value ? 'text' : 'bitmap';
          const target = cur === 'text' ? 'bitmap' : 'text';
          const variants = presetsForMachine(p.machineId, target);
          if (variants.length > 0) {
            const idx = PRESETS.indexOf(variants[0]);
            if (idx >= 0) presetIndex.value = idx;
          }
        }}>
        {isTextMode.value ? 'Bitmap' : 'Text'}
      </button>

      <div class="toolbar-divider" />

      <button class="toolbar-btn" onClick={() => paused.value = !paused.value}>
        {paused.value ? '▶' : '⏸'}
      </button>
      <button class="toolbar-btn" onClick={() => showDebug.value = !showDebug.value}>
        {showDebug.value ? 'Dbg' : 'Debug'}
      </button>
    </header>
  );
}
