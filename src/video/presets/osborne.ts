import { T, G, f8, m } from './types';

const osbPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const osbornePresets = [
  T('osborne-text-52x24', 'osborne', 'Osborne 1', 52, 24, 8, 8, 416, 192, 1,
    'kaypro4.u9', 'osborne', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', osbPal),

  G('osborne-semi-104x48', 'osborne', 'Osborne 1', 'Semi 104×48',
    52, 24, 104, 48, 1,
    'kaypro4.u9', 'osborne', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', osbPal,
    'semi-graphics', 'semi-graphics'),
];
