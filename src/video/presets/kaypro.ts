import { T, G, f8, m } from './types';

const kayproPal = [
  '#000000', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
];

const kayproGraphicsPal = ['#000000', '#33ff33'];

export const kaypro2Presets = [
  T('kaypro2-text-80x24', 'kaypro-ii', 'Kaypro II', 80, 24, 7, 8, 560, 192, 1/2,
    'kaypro2.u43', 'kaypro-2', 128, {
      glyphWidth: 7, glyphHeight: 8, cellWidth: 7, cellHeight: 8,
      bytesPerGlyph: 8, leftBit: 4, xBits: [-1, 4, 3, 2, 1, 0, -1],
      invertBits: true,
    },
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproPal),
];

export const kaypro4Presets = [
  T('kaypro4-text-80x25', 'kaypro-4', 'Kaypro 4/84', 80, 25, 8, 16, 640, 400, 1,
    'kaypro4.u9', 'kaypro-4', 256, f8(16, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproPal),

  G('kaypro-160x100', 'kaypro-4', 'Kaypro 4/84', 'Graphics 160×100',
    80, 25, 160, 100, 5 / 6,
    'kaypro4.u9', 'kaypro-4', 256, f8(16, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproGraphicsPal,
    'kaypro-gfx'),
];
