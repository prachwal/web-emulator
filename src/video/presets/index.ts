import { zxPresets } from './zx';
import { c64Presets } from './c64';
import { cgaPresets } from './cga';
import { petPresets } from './pet';
import { mdaPresets } from './mda';
import { trs80Presets } from './trs80';
import { apple1Presets } from './apple1';
import { vic20Presets } from './vic20';
import { kaypro2Presets, kaypro4Presets } from './kaypro';
import { cpc464Presets, cpc664Presets, cpc6128Presets } from './cpc';
import { osbornePresets } from './osborne';
import { otronaPresets } from './otrona';
import { xeroxPresets } from './xerox';
import { morrowPresets } from './morrow';
import { rainbowPresets } from './rainbow';
import { epsonPx8Presets } from './epson-px8';
import { c128Presets } from './c128';
import { zx128Presets } from './zx128';
import { sinclairQlPresets } from './sinclair-ql';
import { c16Presets, plus4Presets } from './c16';
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
export { kaypro2Presets } from './kaypro';
export { kaypro4Presets } from './kaypro';
export { cpc464Presets } from './cpc';
export { cpc664Presets } from './cpc';
export { cpc6128Presets } from './cpc';
export { osbornePresets } from './osborne';
export { otronaPresets } from './otrona';
export { xeroxPresets } from './xerox';
export { morrowPresets } from './morrow';
export { rainbowPresets } from './rainbow';
export { epsonPx8Presets } from './epson-px8';
export { c128Presets } from './c128';
export { zx128Presets } from './zx128';
export { sinclairQlPresets } from './sinclair-ql';
export { c16Presets, plus4Presets } from './c16';

export const PRESETS: Preset[] = [
  ...zxPresets,
  ...c64Presets,
  ...cgaPresets,
  ...petPresets,
  ...mdaPresets,
  ...trs80Presets,
  ...apple1Presets,
  ...vic20Presets,
  ...kaypro2Presets,
  ...kaypro4Presets,
  ...cpc464Presets,
  ...cpc664Presets,
  ...cpc6128Presets,
  ...osbornePresets,
  ...otronaPresets,
  ...xeroxPresets,
  ...morrowPresets,
  ...rainbowPresets,
  ...epsonPx8Presets,
  ...c128Presets,
  ...zx128Presets,
  ...sinclairQlPresets,
  ...c16Presets,
  ...plus4Presets,
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

export function computerIds(): string[] {
  return [...new Set(PRESETS.map(p => p.computer))].sort();
}

export function machinesForComputer(computer: string): string[] {
  return [...new Set(
    PRESETS.filter(p => p.computer === computer).map(p => p.machineId)
  )].sort();
}
