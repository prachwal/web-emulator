import { T, f8hl, m } from './types';

const rnbPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const rainbowPresets = [
  T('rainbow-text-80x24', 'rainbow', 'DEC Rainbow 100', 80, 24, 8, 10, 640, 240, 2/3,
    'kaypro4.u9', 'rainbow-100', 256, f8hl(8, 7, 10),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', rnbPal),
];
