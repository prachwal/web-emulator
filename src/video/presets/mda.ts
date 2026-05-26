import { T, G, f8hl, m } from './types';

const mdaPal = [
  '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
  '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
];

const hercPal = [
  '#000000', '#33ff33',
];

export const mdaPresets = [
  T('mda-text-80x25', 'mda', 'IBM MDA', 80, 25, 8, 14, 640, 350, 35 / 48,
    'cga-thick.bin', 'mda-cga', 256, f8hl(8, 7, 14),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e8e0d0', '#a09880', mdaPal),

  G('mda-herc-720x348', 'mda', 'IBM MDA', 'HGC 720×348',
    80, 25, 720, 348, 1,
    'cga-thick.bin', 'mda-cga', 256, f8hl(8, 7, 14),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e8e0d0', '#a09880', hercPal,
    'herc-bitmap'),
];
