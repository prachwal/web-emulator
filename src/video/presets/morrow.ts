import { T, f8hl, m } from './types';

const morPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const morrowPresets = [
  T('morrow-text-80x24', 'morrow', 'Morrow MD3', 80, 24, 8, 12, 640, 288, 3/5,
    'kaypro4.u9', 'morrow-md3', 256, f8hl(8, 7, 12),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', morPal),
];
