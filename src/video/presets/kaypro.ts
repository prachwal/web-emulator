import { T, f8, m } from './types';

const kayproPal = [
  '#000000', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
];

export const kayproPresets = [
  T('kaypro2-text-80x24', 'kaypro', 'Kaypro II', 80, 24, 7, 16, 560, 384, 1,
    'kaypro2.u43', 'kaypro-2', 128, {
      glyphWidth: 7, glyphHeight: 8, cellWidth: 7, cellHeight: 16,
      bytesPerGlyph: 8, leftBit: 4, xBits: [-1, 4, 3, 2, 1, 0, -1],
      invertBits: true,
    },
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproPal),

  T('kaypro4-text-80x25', 'kaypro', 'Kaypro 4/84', 80, 25, 8, 16, 640, 400, 1,
    'kaypro4.u9', 'kaypro-4', 256, f8(16, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproPal),
];
