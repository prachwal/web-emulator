import { T, G, f8, m } from './types';

// ZX Spectrum 128K has brighter colors than 48K (different resistor values in RGB circuit)
const zx128Colors = [
  '#000000', '#0000D7', '#D70000', '#D700D7',
  '#00D700', '#00D7D7', '#D7D700', '#D7D7D7',
  '#000000', '#0000FF', '#FF0000', '#FF00FF',
  '#00FF00', '#00FFFF', '#FFFF00', '#FFFFFF',
];

export const zx128Presets = [
  T('zx128-text-32x24', 'zx128', 'ZX Spectrum 128', 32, 24, 8, 8, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zx128Colors, undefined, '#0000aa'),

  G('zx128-attr-256x192', 'zx128', 'ZX Spectrum 128', 'Attr 256×192',
    32, 24, 256, 192, 1,
    'zx-spectrum.bin', 'zx-spectrum', 128, f8(8, 7),
    m(8, 6, 8, 6), '#ffffff', '#000000', '#000000', '#1a1a1a', '#444', zx128Colors,
    'spectrum-attr', 'attribute-bitmap'),
];
