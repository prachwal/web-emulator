import { T, f8, m } from './types';

const osbPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const osbornePresets = [
  T('osborne-text-52x24', 'osborne', 'Osborne 1', 52, 24, 8, 8, 416, 192, 1,
    'kaypro4.u9', 'osborne', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', osbPal),
];
