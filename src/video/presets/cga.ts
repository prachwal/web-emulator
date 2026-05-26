import { T, G, f8, m } from './types';

const cgaPalette = [
  '#000000','#0000aa','#00aa00','#00aaaa','#aa0000','#aa00aa','#aaaa00','#aaaaaa',
  '#000055','#0000ff','#00ff00','#00ffff','#ff0000','#ff00ff','#ffff00','#ffffff',
];

export const cgaPresets = [
  T('cga-text-40x25', 'cga', 'IBM CGA', 40, 25, 8, 8, 320, 200, 5 / 6,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880', cgaPalette),

  T('cga-text-80x25', 'cga', 'IBM CGA', 80, 25, 8, 8, 640, 200, 5 / 12,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(6, 5, 6, 5), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880', cgaPalette),

  G('cga-320x200', 'cga', 'IBM CGA', 'CGA 320×200 4c',
    40, 25, 320, 200, 5 / 6,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880',
    ['#000000','#00ffff','#ff00ff','#ffffff','#00ffff','#ff00ff','#ffffff','#ffffff',
     '#000000','#00ffff','#ff00ff','#ffffff','#00ffff','#ff00ff','#ffffff','#ffffff'],
    'cga:320×200 4c', 'tilemap'),

  G('cga-640x200', 'cga', 'IBM CGA', 'CGA 640×200 2c',
    80, 25, 640, 200, 5 / 12,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(6, 5, 6, 5), '#ffffff', '#000000', '#000000', '#e8e0d0', '#a09880',
    ['#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
     '#000000','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],
    'mono', 'bitmap-1bpp'),

  G('cga-160x100', 'cga', 'IBM CGA', 'CGA 160×100 16c',
    20, 25, 160, 100, 5 / 6,
    'cga-thick.bin', 'cga-thick', 256, f8(8, 7),
    m(10, 8, 10, 8), '#cccccc', '#000000', '#000000', '#e8e0d0', '#a09880', cgaPalette,
    'cga-160x100', 'cga-160x100'),
];
