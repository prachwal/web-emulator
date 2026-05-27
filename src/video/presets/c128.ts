import { T, G, f8, m } from './types';

const c128Pal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

const c64Pal = [
  '#000000', '#FFFFFF', '#880000', '#A8F8F8',
  '#F8A800', '#F8F8A8', '#00A800', '#00F800',
  '#A800A8', '#F8A8F8', '#A80000', '#F8A8A8',
  '#000088', '#0000A8', '#008888', '#00A8A8',
];

export const c128Presets = [
  T('c128-vdc-80x25', 'c128', 'Commodore 128', 80, 25, 8, 8, 640, 200, 5/12,
    'c128-vdc-chargen.bin', 'c128-vdc', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#c4b89a', '#8a7d60', c128Pal),

  T('c128-vdc-80x25-interlace', 'c128', 'Commodore 128', 80, 25, 8, 16, 640, 400, 5/6,
    'c128-vdc-chargen.bin', 'c128-vdc-interlace', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#c4b89a', '#8a7d60', c128Pal),

  T('c128-vicii-40x25', 'c128', 'Commodore 128', 40, 25, 8, 8, 320, 200, 5/6,
    'kaypro4.u9', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal, undefined, '#1620a0'),

  G('c128-vicii-320x200', 'c128', 'Commodore 128', 'VIC-II 320×200',
    40, 25, 320, 200, 5/6,
    'kaypro4.u9', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal,
    'c64', 'bitmap-2bpp'),

  G('c128-vicii-160x200', 'c128', 'Commodore 128', 'VIC-II 160×200',
    40, 25, 160, 200, 5/3,
    'kaypro4.u9', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal,
    'c64-mc', 'c64-multicolor'),
];
