import { zxSpectrumColors } from '../Palette';
import { T, G, f8, m } from './types';

const zxPal = zxSpectrumColors;

export const zxPresets = [
  T('zx-text-32x24', 'zx', 'ZX Spectrum', 32, 24, 8, 8, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zxPal, undefined, '#222200'),

  G('zx-attr-256x192', 'zx', 'ZX Spectrum', 'Attr 256×192',
    32, 24, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zxPal,
    'spectrum-attr', 'attribute-bitmap'),
];
