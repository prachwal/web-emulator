import type { CrtSettings } from '../core/types';

export interface SettingsPanelProps {
  crt: CrtSettings;
  onCrtChange: (update: Partial<CrtSettings>) => void;
}

export function SettingsPanel({ crt, onCrtChange }: SettingsPanelProps) {
  return (
    <div class="crt-controls">
      <label class="crt-label">
        <input class="crt-toggle" type="checkbox" checked={crt.enabled}
          onChange={e => onCrtChange({ enabled: (e.target as HTMLInputElement).checked })} />
        {' CRT'}
      </label>

      <Slider label="Scanline" value={crt.scanlineStrength} min={0} max={1} step={0.01}
        onChange={v => onCrtChange({ scanlineStrength: v })} />
      <Slider label="Mask" value={crt.maskStrength} min={0} max={1} step={0.01}
        onChange={v => onCrtChange({ maskStrength: v })} />
      <Slider label="Curve" value={crt.curvature} min={0} max={0.3} step={0.01}
        onChange={v => onCrtChange({ curvature: v })} />
      <Slider label="Bright" value={crt.brightness} min={0} max={2} step={0.05}
        onChange={v => onCrtChange({ brightness: v })} />
      <Slider label="Contrast" value={crt.contrast} min={0} max={2} step={0.05}
        onChange={v => onCrtChange({ contrast: v })} />
      <Slider label="Vignette" value={crt.vignette} min={0} max={1} step={0.01}
        onChange={v => onCrtChange({ vignette: v })} />
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label class="crt-label">
      {label}
      <input class="crt-slider" type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat((e.target as HTMLInputElement).value))} />
      <span class="crt-value">{value.toFixed(2)}</span>
    </label>
  );
}
