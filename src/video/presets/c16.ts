import { T, G, f8, m } from './types';

// Standard 16-color palette for text mode (compatible with VIC-II order)
const c16Pal = [
  '#000000','#FFFFFF','#880000','#AAFFEE',
  '#CC44CC','#00CC55','#0000AA','#EEEE77',
  '#FF8855','#FF00AA','#885500','#555555',
  '#888888','#00FF00','#0000FF','#BBBBBB',
];

// Full TED 7360 128-color palette for bitmap mode
// 8 hues × 8 luminance levels + alternate matrix
const tedPal128 = [
  '#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000',
  '#1f1f1f','#3f3f3f','#5f5f5f','#7f7f7f','#9f9f9f','#bfbfbf','#dfdfdf','#ffffff',
  '#110000','#220000','#330000','#440000','#550000','#660000','#770000','#880000',
  '#151f1d','#2a3f3b','#3f5f59','#557f77','#6a9f94','#7fbfb2','#94dfd0','#aaffee',
  '#190819','#331133','#4c194c','#662266','#7f2a7f','#993399','#b23bb2','#cc44cc',
  '#00190a','#003315','#004c1f','#00662a','#007f35','#00993f','#00b24a','#00cc55',
  '#000015','#00002a','#00003f','#000055','#00006a','#00007f','#000094','#0000aa',
  '#1d1d0e','#3b3b1d','#59592c','#77773b','#94944a','#b2b259','#d0d068','#eeee77',
  '#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000',
  '#1f1f1f','#3f3f3f','#5f5f5f','#7f7f7f','#9f9f9f','#bfbfbf','#dfdfdf','#ffffff',
  '#1f110a','#3f2215','#5f331f','#7f442a','#9f5535','#bf663f','#df774a','#ff8855',
  '#1f0015','#3f002a','#5f003f','#7f0055','#9f006a','#bf007f','#df0094','#ff00aa',
  '#110a00','#221500','#331f00','#442a00','#553500','#663f00','#774a00','#885500',
  '#0a0a0a','#151515','#1f1f1f','#2a2a2a','#353535','#3f3f3f','#4a4a4a','#555555',
  '#111111','#222222','#333333','#444444','#555555','#666666','#777777','#888888',
  '#171717','#2e2e2e','#464646','#5d5d5d','#747474','#8c8c8c','#a3a3a3','#bbbbbb',
];

export const c16Presets = [
  T('c16-text-40x25', 'c16', 'Commodore 16', 40, 25, 8, 8, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#6010a0', '#7020b0', '#c4b89a', '#8a7d60', c16Pal, undefined, '#4040c0'),

  G('c16-bmp-320x200', 'c16', 'Commodore 16', 'Bitmap 320×200',
    40, 25, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#6010a0', '#7020b0', '#c4b89a', '#8a7d60', tedPal128,
    'c16-bm', 'bitmap-1bpp'),

  G('c16-multi-160x200', 'c16', 'Commodore 16', 'Multi 160×200',
    40, 25, 160, 200, 5/3,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#6010a0', '#7020b0', '#c4b89a', '#8a7d60', tedPal128,
    'c16-mc', 'c64-multicolor'),
];

export const plus4Presets = [
  T('plus4-text-40x25', 'plus4', 'Commodore Plus/4', 40, 25, 8, 8, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#4030c0', '#5040d0', '#c4b89a', '#8a7d60', c16Pal, undefined, '#4040c0'),

  G('plus4-bmp-320x200', 'plus4', 'Commodore Plus/4', 'Bitmap 320×200',
    40, 25, 320, 200, 5/6,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#4030c0', '#5040d0', '#c4b89a', '#8a7d60', tedPal128,
    'plus4-bm', 'bitmap-1bpp'),

  G('plus4-multi-160x200', 'plus4', 'Commodore Plus/4', 'Multi 160×200',
    40, 25, 160, 200, 5/3,
    'c16-chargen.bin', 'c16-chargen', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#4030c0', '#5040d0', '#c4b89a', '#8a7d60', tedPal128,
    'plus4-mc', 'c64-multicolor'),
];
