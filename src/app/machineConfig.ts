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
  kaypro: ['80x25', '8x16 FONT', 'CP/M', 'ADM-3A'],
};

export function machineFeatures(machineId: string): string[] {
  const feat = MACHINE_FEATURES[machineId] ?? ['TEXT MODE', 'DEMO'];
  return feat.filter((_, i) => i < 4);
}
