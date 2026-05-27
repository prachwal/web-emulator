import { T, f8, m } from './types';

const otrPal = ['#000000','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347',
  '#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347'];

export const otronaPresets = [
  T('otrona-text-80x24', 'otrona', 'Otrona Attache', 80, 24, 8, 8, 640, 192, 1,
    'kaypro4.u9', 'otrona', 256, f8(8, 7),
    m(8, 6, 8, 6), '#ffb347', '#000000', '#000000', '#303030', '#666', otrPal),
];
