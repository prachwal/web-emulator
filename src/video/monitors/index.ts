import type { MonitorDef } from './types';

export const MONITORS: Record<string, MonitorDef> = {
  // === Commodore ===
  'c1701': { id: 'c1701', name: 'Commodore 1701', type: 'crt', color: 'color', phosphor: 'rgb', sizeInches: 13, aspectRatio: 4/3, notes: 'Composite video, 0.64mm dot pitch' },
  'c1702': { id: 'c1702', name: 'Commodore 1702', type: 'crt', color: 'color', phosphor: 'rgb', sizeInches: 13, aspectRatio: 4/3, notes: 'Luma/chroma S-video, 0.64mm dot pitch' },
  'c1084': { id: 'c1084', name: 'Commodore 1084', type: 'crt', color: 'color', phosphor: 'rgb', sizeInches: 14, aspectRatio: 4/3, notes: 'RGB+composite, used with Amiga' },

  // === Amstrad CPC ===
  'gt65': { id: 'gt65', name: 'Amstrad GT-65', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'Green monochrome, 50/60Hz, single-voltage' },
  'ctm644': { id: 'ctm644', name: 'Amstrad CTM-644', type: 'crt', color: 'color', phosphor: 'rgb', sizeInches: 14, aspectRatio: 4/3, notes: 'RGB color, 640×200 max' },
  'mp1': { id: 'mp1', name: 'Amstrad MP-1', type: 'crt', color: 'color', aspectRatio: 4/3, sizeInches: 14, notes: 'RF TV modulator (PAL)' },

  // === IBM ===
  'ibm5151': { id: 'ibm5151', name: 'IBM 5151', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'MDA monochrome, TTL input, 0.38mm dot pitch' },
  'ibm5153': { id: 'ibm5153', name: 'IBM 5153', type: 'crt', color: 'color', phosphor: 'rgb', sizeInches: 12, aspectRatio: 4/3, notes: 'CGA color, 0.43mm dot pitch' },
  'herc': { id: 'herc', name: 'Hercules HGC', type: 'crt', color: 'mono', phosphor: 'amber', sizeInches: 12, aspectRatio: 4/3, notes: '720×348 monochrome bitmap' },

  // === Sinclair / ZX ===
  'zx-tv': { id: 'zx-tv', name: 'PAL TV (RF)', type: 'crt', color: 'color', aspectRatio: 4/3, sizeInches: 14, notes: 'Standard PAL TV via RF modulator, 50Hz' },
  'zx-green': { id: 'zx-green', name: 'Green Monitor', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'Green monochrome monitor' },

  // === Apple 1 ===
  'apple-ntsc': { id: 'apple-ntsc', name: 'NTSC TV', type: 'crt', color: 'color', aspectRatio: 4/3, sizeInches: 14, notes: 'Standard NTSC TV via composite video' },

  // === Kaypro ===
  'kaypro-crt': { id: 'kaypro-crt', name: 'Kaypro 9" CRT', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 9, aspectRatio: 4/3, notes: 'Built-in green monitor' },

  // === TRS-80 ===
  'trs80-mono': { id: 'trs80-mono', name: 'Radio Shack TRS-80', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'Monochrome green monitor' },

  // === VIC-20 ===
  'vic-ntsc': { id: 'vic-ntsc', name: 'NTSC TV (RF)', type: 'crt', color: 'color', aspectRatio: 4/3, sizeInches: 14, notes: 'US TV via RF modulator, 60Hz' },
  'vic-pal': { id: 'vic-pal', name: 'PAL TV (RF)', type: 'crt', color: 'color', aspectRatio: 4/3, sizeInches: 14, notes: 'European TV via RF' },

  // === PET ===
  'pet-crt': { id: 'pet-crt', name: 'PET Built-in CRT', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 9, aspectRatio: 4/3, notes: '9" or 12" built-in monochrome CRT' },

  // === Osborne 1 ===
  'osborne-crt': { id: 'osborne-crt', name: 'Osborne 5" CRT', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 5, aspectRatio: 4/3, notes: 'Built-in 5" monochrome' },

  // === Otrona ===
  'otrona-crt': { id: 'otrona-crt', name: 'Otrona 7" CRT', type: 'crt', color: 'mono', phosphor: 'amber', sizeInches: 7, aspectRatio: 4/3, notes: 'Amber phosphor' },

  // === Xerox ===
  'xerox-crt': { id: 'xerox-crt', name: 'Xerox 12" CRT', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'Green monochrome' },

  // === Morrow ===
  'morrow-adm3': { id: 'morrow-adm3', name: 'ADM-3A Terminal', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'ADM-3A compatible terminal' },

  // === DEC Rainbow ===
  'vr201': { id: 'vr201', name: 'DEC VR201', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'Green monochrome, 80/132 col' },

  // === Epson PX-8 ===
  'px8-lcd': { id: 'px8-lcd', name: 'PX-8 LCD', type: 'lcd', color: 'mono', sizeInches: 8, aspectRatio: 10/1, notes: '80×8 text LCD, backlit' },

  // === Mega 65 / Generic ===
  'generic-color': { id: 'generic-color', name: 'Color CRT', type: 'crt', color: 'color', phosphor: 'rgb', sizeInches: 14, aspectRatio: 4/3, notes: 'Generic color CRT' },
  'generic-mono': { id: 'generic-mono', name: 'Mono CRT', type: 'crt', color: 'mono', phosphor: 'green', sizeInches: 12, aspectRatio: 4/3, notes: 'Generic monochrome CRT' },
};

export function getMonitor(id: string): MonitorDef | undefined {
  return MONITORS[id];
}

export function monitorsForMachine(machineId: string): string[] {
  const map: Record<string, string[]> = {
    zx: ['zx-tv', 'zx-green'],
    'cpc-464': ['gt65', 'ctm644', 'mp1'],
    'cpc-664': ['gt65', 'ctm644', 'mp1'],
    'cpc-6128': ['gt65', 'ctm644', 'mp1'],
    c64: ['c1701', 'c1702', 'vic-ntsc', 'vic-pal'],
    cga: ['ibm5153', 'ibm5151'],
    mda: ['ibm5151'],
    pet: ['pet-crt'],
    trs80: ['trs80-mono'],
    apple1: ['apple-ntsc'],
    vic20: ['vic-ntsc', 'vic-pal'],
    'kaypro-ii': ['kaypro-crt'],
    'kaypro-4': ['kaypro-crt'],
    osborne: ['osborne-crt'],
    otrona: ['otrona-crt'],
    xerox: ['xerox-crt'],
    morrow: ['morrow-adm3'],
    rainbow: ['vr201'],
    'epson-px8': ['px8-lcd'],
    c128: ['kaypro-crt', 'c1701'],
    zx128: ['zx-tv', 'zx-green'],
    'sinclair-ql': ['generic-color', 'generic-mono'],
  };
  return map[machineId] ?? ['generic-color'];
}
