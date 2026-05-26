import { T, f8, m } from './types';

const kayproPal = [
  '#000000', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
  '#33ff33', '#33ff33', '#33ff33', '#33ff33',
];

export const kayproPresets = [
  T('kaypro2-text-80x25', 'kaypro', 'Kaypro II', 80, 25, 8, 16, 640, 400, 1,
    'kaypro4.u9', 'kaypro-4', 256, f8(16, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproPal),

  T('kaypro4-text-80x25', 'kaypro', 'Kaypro 4/84', 80, 25, 8, 16, 640, 400, 1,
    'kaypro4.u9', 'kaypro-4', 256, f8(16, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#e0d8c8', '#b0a890', kayproPal),
];
