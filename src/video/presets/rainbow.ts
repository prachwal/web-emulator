import { T, f8, m } from './types';

const rnbPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const rainbowPresets = [
  T('rainbow-text-80x24', 'rainbow', 'DEC Rainbow 100', 80, 24, 8, 8, 640, 192, 5/12,
    'rainbow-chargen-8x8.bin', 'rainbow-100', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', rnbPal),

  T('rainbow-text-132x24', 'rainbow', 'DEC Rainbow 100', 132, 24, 8, 8, 1056, 192, 8/33,
    'rainbow-chargen-8x8.bin', 'rainbow-100', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', rnbPal),
];
