import { T, G, f8, m } from './types';

const qlPal = ['#000000','#0000ff','#ff0000','#ffff00','#000000','#0000ff','#ff0000','#ffff00',
  '#000000','#0000ff','#ff0000','#ffff00','#000000','#0000ff','#ff0000','#ffff00'];

export const sinclairQlPresets = [
  T('ql-mode4-64x24', 'sinclair-ql', 'Sinclair QL', 64, 24, 8, 8, 512, 192, 2/3,
    'kaypro4.u9', 'kaypro-4', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', qlPal),

  T('ql-mode8-32x24', 'sinclair-ql', 'Sinclair QL', 32, 24, 8, 8, 256, 192, 1,
    'kaypro4.u9', 'kaypro-4', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', qlPal),
];
