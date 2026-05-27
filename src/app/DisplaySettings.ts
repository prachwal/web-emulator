import { signal, effect } from '@preact/signals';

export interface DisplaySettings {
  scaleMode: 'integer' | 'smooth';
  parMultiplier: number;
  zoom: number;
  showBorder: boolean;
}

const STORAGE_KEY = 'crt-display-settings';

function loadFromStorage(): DisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DisplaySettings;
  } catch { /* ignore */ }
  return {
    scaleMode: 'smooth',
    parMultiplier: 1,
    zoom: 0.85,
    showBorder: true,
  };
}

const stored = loadFromStorage();

export const displaySettings = signal<DisplaySettings>(stored);

effect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(displaySettings.value));
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
