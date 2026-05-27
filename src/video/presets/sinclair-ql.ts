import { T, G, f8, m } from './types';

const qlPal = ['#000000','#0000ff','#ff0000','#ffff00','#000000','#0000ff','#ff0000','#ffff00',
  '#000000','#0000ff','#ff0000','#ffff00','#000000','#0000ff','#ff0000','#ffff00'];

export const sinclairQlPresets = [
  T('ql-mode4-64x24', 'sinclair-ql', 'Sinclair QL', 64, 24, 8, 8, 512, 192, 2/3,
    'ql_font.bin', 'sinclair-ql', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', qlPal),

  T('ql-mode8-32x24', 'sinclair-ql', 'Sinclair QL', 32, 24, 8, 8, 256, 192, 1,
    'ql_font.bin', 'sinclair-ql', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', qlPal),

  G('ql-mode4-512x256', 'sinclair-ql', 'Sinclair QL', 'Mode 4 512×256',
    64, 32, 512, 256, 2/3,
    'ql_font.bin', 'sinclair-ql', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', qlPal,
    'ql', 'bitmap-2bpp'),

  G('ql-mode8-256x256', 'sinclair-ql', 'Sinclair QL', 'Mode 8 256×256',
    32, 32, 256, 256, 1,
    'ql_font.bin', 'sinclair-ql', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', qlPal,
    'ql', 'bitmap-2bpp'),
];
