import { zxPresets } from './zx';
import { c64Presets } from './c64';
import { cgaPresets } from './cga';
import { petPresets } from './pet';
import { mdaPresets } from './mda';
import { trs80Presets } from './trs80';
import { apple1Presets } from './apple1';
import { vic20Presets } from './vic20';
import { kayproPresets } from './kaypro';
import type { Preset } from './types';

export type { Preset, FontGeometry, Margins } from './types';
export { f8, f6m1, f8hl, T, G, m } from './types';
export { zxPresets } from './zx';
export { c64Presets } from './c64';
export { cgaPresets } from './cga';
export { petPresets } from './pet';
export { mdaPresets } from './mda';
export { trs80Presets } from './trs80';
export { apple1Presets } from './apple1';
export { vic20Presets } from './vic20';
export { kayproPresets } from './kaypro';

export const PRESETS: Preset[] = [
  ...zxPresets,
  ...c64Presets,
  ...cgaPresets,
  ...petPresets,
  ...mdaPresets,
  ...trs80Presets,
  ...apple1Presets,
  ...vic20Presets,
  ...kayproPresets,
];

export function presetKey(p: Preset): string {
  return `${p.machineId}:${p.id}`;
}

export function presetsByMachine(machineId: string): Preset[] {
  return PRESETS.filter(p => p.machineId === machineId);
}

export function presetsByType(type: 'text' | 'bitmap'): Preset[] {
  return PRESETS.filter(p => p.type === type);
}

export function machineIds(): string[] {
  return [...new Set(PRESETS.map(p => p.machineId))];
}

export function machineName(id: string): string {
  return PRESETS.find(p => p.machineId === id)?.machineName ?? id;
}

export function presetsForMachine(machineId: string, type: 'text' | 'bitmap'): Preset[] {
  return PRESETS.filter(p => p.machineId === machineId && p.type === type);
}
