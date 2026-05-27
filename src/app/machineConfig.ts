export const MACHINE_FEATURES: Record<string, string[]> = {
  zx: ['ATTR INK/PAPER', 'BRIGHT +8', 'FLASH', 'BORDER'],
  'cpc-464': ['160×200 16c', '320×200 4c', '640×200 2c', 'CP/M'],
  'cpc-664': ['640×200', '3" FLOPPY', 'CP/M 2.2', '64K'],
  'cpc-6128': ['640×200', '128K RAM', 'CP/M 3.1', '3" FLOPPY'],
  c64: ['COLOR RAM 4-bit', 'PETSCII', 'VIC-II BM', 'SPRITES 8'],
  cga: ['RGBI 16c', '320x200 4c', '640x200 2c', '160x100 16c'],
  pet: ['PETSCII', 'REV MSB=1', 'IEEE-488', '40/80 COL'],
  mda: ['720x350', '9x14 FONT', 'UNDERLINE', 'BLINK'],
  trs80: ['64x16', '8x12 CELL', 'DESCENDER', '512x192'],
  apple1: ['40x24', 'LSB-FIRST', 'INVERT MSB=1', 'WOZ MON'],
  vic20: ['22x23', '176x184 BM', '4-bit COL RAM', 'PETSCII'],
  'kaypro-ii': ['80×24', '7×16 FONT', 'CP/M', 'SY6545'],
  'kaypro-4': ['80×25', '8×16 FONT', '160×100 GFX', 'CP/M'],
  osborne: ['52×24', '5" CRT', 'CP/M 2.2', '64K Z80'],
  otrona: ['80×24', 'AMBER CRT', 'CP/M 2.2', 'GSX GRAFIKA'],
  xerox: ['80×24', '8" FLOPPY', 'CP/M 2.2', '64K Z80'],
  morrow: ['80×24', '8×12 CELL', 'CP/M 2.2', '256KB RAM'],
  rainbow: ['80×24', 'DUAL CPU', 'CP/M+MSDOS', '12" CRT'],
  'epson-px8': ['80×8 LCD', 'CP/M', 'ROM-BASED', 'LAPTOP'],
};

export function machineFeatures(machineId: string): string[] {
  const feat = MACHINE_FEATURES[machineId] ?? ['TEXT MODE', 'DEMO'];
  return feat.filter((_, i) => i < 4);
}
