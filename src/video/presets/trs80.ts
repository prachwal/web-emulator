import { T, G, f8hl, m } from './types';

export const trs80Presets = [
  T('trs80-text-64x16', 'trs80', 'TRS-80 Model III', 64, 16, 8, 12, 512, 192, 1 / 2,
    'trs80-m3-chargen.bin', 'trs80-m3', 256, f8hl(8, 7, 12),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#707070', '#555', [
      '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ]),

  T('trs80-text-32x16', 'trs80', 'TRS-80 Model III', 32, 16, 16, 12, 512, 192, 1 / 2,
    'trs80-m3-chargen.bin', 'trs80-m3-double', 256, f8hl(8, 7, 12),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#707070', '#555', [
      '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ]),

  G('trs80-semi-128x48', 'trs80', 'TRS-80 Model III', 'Semi 128×48',
    64, 16, 128, 48, 1 / 2,
    'trs80-m3-chargen.bin', 'trs80-m3', 256, f8hl(8, 7, 12),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#707070', '#555', [
      '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
      '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    ],
    'semi', 'semi-graphics'),
];
