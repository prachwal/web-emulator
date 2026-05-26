import { T, f8hl, m } from './types';

export const mdaPresets = [
  T('mda-text-80x25', 'mda', 'IBM MDA', 80, 25, 8, 14, 640, 350, 5 / 6,
    'cga-thick.bin', 'mda-cga', 256, f8hl(8, 7, 14),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e8e0d0', '#a09880', [
      '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ]),
];
