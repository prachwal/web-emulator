import { T, G, f8, m } from './types';

const cpc27 = [
  '#000000','#000080','#0000ff','#008000','#008080','#0080ff',
  '#00ff00','#00ff80','#00ffff','#800000','#800080','#8000ff',
  '#808000','#808080','#8080ff','#80ff00','#80ff80','#80ffff',
  '#ff0000','#ff0080','#ff00ff','#ff8000','#ff8080','#ff80ff',
  '#ffff00','#ffff80','#ffffff',
];

const cpcPal16 = [
  '#000000','#000080','#008000','#008080',
  '#800000','#800080','#808000','#808080',
  '#0000ff','#0080ff','#00ff00','#00ff80',
  '#ff0000','#ff0080','#ffff00','#ffffff',
];

const cpcPal16G = [
  '#000000','#00ff00','#008000','#33ff33',
  '#00aa00','#00cc00','#006600','#339933',
  '#33ff33','#66ff66','#00ff00','#33ff00',
  '#00cc00','#00cc33','#66ff00','#99ff99',
];

const cpcPal4 = ['#000000','#00ff00','#008000','#33ff33'];
const cpcPal2 = ['#000000','#00ff00'];

const cpcBorder = '#002000';

function cpct(name: string, mid: string, cols: number, fw: number, par: number, pal: string[]) {
  const base = mid.replace('-', '');
  return T(`${mid}-mode${cols<=20?'0':cols<=40?'1':'2'}-${cols}x25`, mid, name, cols, 25, 8, 8, fw, 200, par,
    `${base}-chargen.bin`, mid, 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', pal, undefined, cpcBorder);
}

function cpcb(name: string, mid: string, label: string, cols: number, fw: number, par: number, pal: string[]) {
  const base = mid.replace('-', '');
  return G(`${mid}-bmp-${fw}x200`, mid, name, label, cols, 25, fw, 200, par,
    `${base}-chargen.bin`, mid, 256, f8(8, 7),
    m(10, 8, 10, 8), '#ffffff', '#000000', '#000000', '#303030', '#666', pal, 'mode', undefined, cpcBorder);
}

export const cpc464Presets = [
  cpct('Amstrad CPC 464', 'cpc-464', 20, 160, 5 / 3, cpcPal16G),
  cpct('Amstrad CPC 464', 'cpc-464', 40, 320, 5 / 6, cpcPal4),
  cpct('Amstrad CPC 464', 'cpc-464', 80, 640, 5 / 12, cpcPal2),
  cpcb('Amstrad CPC 464', 'cpc-464', 'BMP 160×200 16c', 20, 160, 5 / 3, cpcPal16),
  cpcb('Amstrad CPC 464', 'cpc-464', 'BMP 320×200 4c', 40, 320, 5 / 6, cpcPal4),
  cpcb('Amstrad CPC 464', 'cpc-464', 'BMP 640×200 2c', 80, 640, 5 / 12, cpcPal2),
];

export const cpc664Presets = [
  cpct('Amstrad CPC 664', 'cpc-664', 80, 640, 5 / 12, cpcPal2),
];

export const cpc6128Presets = [
  cpct('Amstrad CPC 6128', 'cpc-6128', 80, 640, 5 / 12, cpcPal2),
];
