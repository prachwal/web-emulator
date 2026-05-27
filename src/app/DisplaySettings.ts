import { signal, effect } from '@preact/signals';

export interface DisplaySettings {
  scaleMode: 'integer' | 'smooth';
  parMultiplier: number;
  zoom: number;
  showBorder: boolean;
}

const STORAGE_KEY = 'crt-display-settings';
const SETTINGS_VERSION = 2;

const DEFAULTS: DisplaySettings = {
  scaleMode: 'smooth',
  parMultiplier: 1,
  zoom: 0.85,
  showBorder: true,
};

function loadFromStorage(): DisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DisplaySettings & { _v?: number };
      if (parsed._v === SETTINGS_VERSION) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

const stored = loadFromStorage();

export const displaySettings = signal<DisplaySettings>(stored);

effect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...displaySettings.value, _v: SETTINGS_VERSION }));
  } catch { /* ignore */ }
});

export function updateDisplaySettings(update: Partial<DisplaySettings>): void {
  displaySettings.value = { ...displaySettings.value, ...update };
}

export function parseHexColor(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}
