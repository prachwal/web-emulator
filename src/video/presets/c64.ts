import { c64Colors } from '../Palette';
import { T, G, f8, m } from './types';

const c64Pal = c64Colors;

export const c64Presets = [
  T('c64-text-40x25', 'c64', 'Commodore 64', 40, 25, 8, 8, 320, 200, 5 / 6,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal),

  G('c64-320x200', 'c64', 'Commodore 64', 'Bitmap 320×200',
    40, 25, 320, 200, 5 / 6,
    'c64-chargen', 'c64-chargen-first', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#1010a0', '#2020d0', '#c4b89a', '#8a7d60', c64Pal,
    'c64', 'bitmap-2bpp'),
];
