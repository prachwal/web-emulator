import { T, G, f8, m } from './types';

const c64Pal = [
  '#000000', '#FFFFFF', '#880000', '#A8F8F8',
  '#F8A800', '#F8F8A8', '#00A800', '#00F800',
  '#A800A8', '#F8A8F8', '#A80000', '#F8A8A8',
  '#000088', '#0000A8', '#008888', '#00A8A8',
];

export const c64Presets = [
  T('c64-text-40x25', 'c64', 'Commodore 64', 40, 25, 8, 8, 320, 200, 5 / 6,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal, undefined, '#1620a0'),

  G('c64-320x200', 'c64', 'Commodore 64', 'Bitmap 320×200',
    40, 25, 320, 200, 5 / 6,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal,
    'c64', 'bitmap-2bpp'),

  G('c64-160x200', 'c64', 'Commodore 64', 'Multi 160×200',
    40, 25, 160, 200, 5 / 3,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal,
    'c64-mc', 'c64-multicolor'),
];
