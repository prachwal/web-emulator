import { zxSpectrumColors } from '../Palette';
import { T, f8, m } from './types';

const zxPal = zxSpectrumColors;

export const zx128Presets = [
  T('zx128-text-32x24', 'zx128', 'ZX Spectrum 128', 32, 24, 8, 8, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zxPal, undefined, '#0000aa'),
];
