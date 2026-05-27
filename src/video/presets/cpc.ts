import { T, G, f8, m } from './types';

const cpcPalette = [
  '#000000','#0000aa','#00aa00','#00aaaa','#aa0000','#aa00aa','#aaaa00','#aaaaaa',
  '#000055','#0000ff','#00ff00','#00ffff','#ff0000','#ff00ff','#ffff00','#ffffff',
];

export const cpcPresets = [
  T('cpc464-mode0-20x25', 'cpc', 'Amstrad CPC 464', 20, 25, 8, 8, 160, 200, 5 / 3,
    'cpc464-chargen.bin', 'cpc-464', 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', cpcPalette, undefined, '#000011'),

  T('cpc464-mode1-40x25', 'cpc', 'Amstrad CPC 464', 40, 25, 8, 8, 320, 200, 5 / 6,
    'cpc464-chargen.bin', 'cpc-464', 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', cpcPalette, undefined, '#000011'),

  T('cpc464-mode2-80x25', 'cpc', 'Amstrad CPC 464', 80, 25, 8, 8, 640, 200, 5 / 12,
    'cpc464-chargen.bin', 'cpc-464', 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', cpcPalette, undefined, '#000011'),

  T('cpc664-mode2-80x25', 'cpc', 'Amstrad CPC 664', 80, 25, 8, 8, 640, 200, 5 / 12,
    'cpc464-chargen.bin', 'cpc-464', 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', cpcPalette, undefined, '#000011'),

  T('cpc6128-mode2-80x25', 'cpc', 'Amstrad CPC 6128', 80, 25, 8, 8, 640, 200, 5 / 12,
    'cpc464-chargen.bin', 'cpc-464', 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', cpcPalette, undefined, '#000011'),
];
