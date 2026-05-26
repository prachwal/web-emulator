import { T, G, f8, m } from './types';

const vic20Palette = [
  '#000000','#ffffff','#ff0000','#00ffff','#ff00ff','#00ff00','#0000ff','#ffff00',
  '#ff8800','#88ff00','#00ff88','#0088ff','#8800ff','#ff0088','#888888','#cccccc',
];

export const vic20Presets = [
  T('vic20-text-22x23', 'vic20', 'VIC-20', 22, 23, 8, 8, 176, 184, 1,
    'vic20.bin', 'vic20-chargen', 256, f8(8, 7),
    m(10, 8, 10, 8), '#66ccff', '#000000', '#000000', '#c4b89a', '#8a7d60', vic20Palette),

  G('vic20-176x184', 'vic20', 'VIC-20', 'Bitmap 176×184',
    22, 23, 176, 184, 46 / 33,
    'vic20.bin', 'vic20-chargen', 256, f8(8, 7),
    m(10, 8, 10, 8), '#66ccff', '#000000', '#000000', '#c4b89a', '#8a7d60', vic20Palette,
    'vic20-bm', 'bitmap-1bpp'),
];
