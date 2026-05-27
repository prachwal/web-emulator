import { T, G, f8, m } from './types';

const c16Pal = [
  '#000000','#FFFFFF','#880000','#AAFFEE',
  '#CC44CC','#00CC55','#0000AA','#EEEE77',
  '#FF8855','#FF00AA','#885500','#555555',
  '#888888','#00FF00','#0000FF','#BBBBBB',
];

export const c16Presets = [
  T('c16-text-40x25', 'c16', 'Commodore 16', 40, 25, 8, 8, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#6010a0', '#7020b0', '#c4b89a', '#8a7d60', c16Pal, undefined, '#4040c0'),

  G('c16-bmp-320x200', 'c16', 'Commodore 16', 'Bitmap 320×200',
    40, 25, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#6010a0', '#7020b0', '#c4b89a', '#8a7d60', c16Pal,
    'c16-bm', 'bitmap-1bpp'),

  G('c16-multi-160x200', 'c16', 'Commodore 16', 'Multi 160×200',
    40, 25, 160, 200, 5/3,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#6010a0', '#7020b0', '#c4b89a', '#8a7d60', c16Pal,
    'c16-mc', 'c64-multicolor'),
];

export const plus4Presets = [
  T('plus4-text-40x25', 'plus4', 'Commodore Plus/4', 40, 25, 8, 8, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#4030c0', '#5040d0', '#c4b89a', '#8a7d60', c16Pal, undefined, '#4040c0'),

  G('plus4-bmp-320x200', 'plus4', 'Commodore Plus/4', 'Bitmap 320×200',
    40, 25, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#4030c0', '#5040d0', '#c4b89a', '#8a7d60', c16Pal,
    'plus4-bm', 'bitmap-1bpp'),

  G('plus4-multi-160x200', 'plus4', 'Commodore Plus/4', 'Multi 160×200',
    40, 25, 160, 200, 5/3,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#4030c0', '#5040d0', '#c4b89a', '#8a7d60', c16Pal,
    'plus4-mc', 'c64-multicolor'),
];
