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

const crt = signal<CrtSettings>(defaultCrtSettings());
const showDebug = signal(false);
const paused = signal(false);

// Three-level selection state
const selectedMachineId = signal(machineIds()[0] ?? 'zx');
const selectedType = signal<'text' | 'bitmap'>('text');
const selectedVariantIdx = signal(0);

const currentVariants = computed(() =>
  presetsForMachine(selectedMachineId.value, selectedType.value),
);

const currentPreset = computed<Preset>(() => {
  const variants = currentVariants.value;
  const idx = Math.min(selectedVariantIdx.value, variants.length - 1);
  return variants[idx] ?? PRESETS[0];
});

export function AppShell() {
  return (
    <div class="app-layout">
      <Toolbar />
      <div class="viewport-stage">
        <div class="crt-bezel">
          <div class="crt-power-led" />
          <div class="crt-screen">
            <div class="crt-screen-glow" />
            <div class="crt-tube">
              <EmulatorViewport
                crt={crt.value}
                preset={currentPreset.value}
                paused={paused.value}
                activeFontId={currentPreset.value.fontId}
              />
            </div>
          </div>
          <div class="crt-nameplate">{currentPreset.value.machineName} {currentPreset.value.label}</div>
        </div>
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
  const variants = currentVariants.value;
  const mIds = machineIds();

  return (
    <header class="toolbar">
      <h1 class="toolbar-title">CRT</h1>
      <div class="toolbar-divider" />

      {/* Level 1: Machine */}
      <select class="toolbar-select"
        value={selectedMachineId.value}
        onChange={e => {
          const nextMachineId = (e.target as HTMLSelectElement).value;
          selectedMachineId.value = nextMachineId;
          if (presetsForMachine(nextMachineId, selectedType.value).length === 0) {
            selectedType.value = presetsForMachine(nextMachineId, 'text').length > 0 ? 'text' : 'bitmap';
          }
          selectedVariantIdx.value = 0;
        }}>
        {mIds.map(mid => (
          <option key={mid} value={mid}>{machineName(mid)}</option>
        ))}
      </select>

      <div class="toolbar-divider" />

      {/* Level 2: Text / Bitmap toggle */}
      <button class="toolbar-btn"
        disabled={presetsForMachine(selectedMachineId.value, 'text').length === 0}
        style={selectedType.value !== 'text' ? undefined : { background: '#2a4', color: '#000', borderColor: '#2a4' }}
        onClick={() => {
          if (presetsForMachine(selectedMachineId.value, 'text').length === 0) return;
          selectedType.value = 'text';
          selectedVariantIdx.value = 0;
        }}>
        Text
      </button>
      <button class="toolbar-btn"
        disabled={presetsForMachine(selectedMachineId.value, 'bitmap').length === 0}
        style={selectedType.value !== 'bitmap' ? undefined : { background: '#2a4', color: '#000', borderColor: '#2a4' }}
        onClick={() => {
          if (presetsForMachine(selectedMachineId.value, 'bitmap').length === 0) return;
          selectedType.value = 'bitmap';
          selectedVariantIdx.value = 0;
        }}>
        Bitmap
      </button>

      <div class="toolbar-divider" />

      {/* Level 3: Variant / Resolution */}
      <select class="toolbar-select"
        value={selectedVariantIdx.value}
        onChange={e => {
          selectedVariantIdx.value = Number((e.target as HTMLSelectElement).value);
        }}>
        {variants.map((v, i) => (
          <option key={v.id} value={i}>{v.label}</option>
        ))}
      </select>

      <button class="toolbar-btn" onClick={() => paused.value = !paused.value}>
        {paused.value ? '>' : '||'}
      </button>
      <button class="toolbar-btn" onClick={() => showDebug.value = !showDebug.value}>
        {showDebug.value ? 'Dbg' : 'Debug'}
      </button>
    </header>
  );
}
