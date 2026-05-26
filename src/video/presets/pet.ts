import { T, f8, m } from './types';

const petPalette = [
  '#000000','#ffffff','#880000','#00aa00','#0000aa','#aa00aa','#00aaaa','#aaaa00',
  '#555555','#5555ff','#55ff55','#ff5555','#00ffff','#ff00ff','#ffff55','#aaffaa',
];

export const petPresets = [
  T('pet-text-40x25', 'pet', 'Commodore PET', 40, 25, 8, 8, 320, 200, 5 / 6,
    'pet-2001.bin', 'pet-2001', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', petPalette),

  T('pet-text-80x25', 'pet', 'Commodore PET', 80, 25, 8, 8, 640, 200, 5 / 12,
    'pet-4032.bin', 'pet-4032', 256, f8(8, 7),
    m(6, 5, 6, 5), '#33ff33', '#000000', '#000000', '#303030', '#666', petPalette),
];
