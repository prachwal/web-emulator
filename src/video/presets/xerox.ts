import { T, f8, m } from './types';

const xerPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const xeroxPresets = [
  T('xerox-text-80x24', 'xerox', 'Xerox 820-II', 80, 24, 8, 8, 640, 192, 2/5,
    'x2401u57-chargen.bin', 'xerox-820', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', xerPal),
];
