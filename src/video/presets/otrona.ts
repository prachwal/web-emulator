import { T, f8, m } from './types';

const otrPal = ['#000000','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347',
  '#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347','#ffb347'];

export const otronaPresets = [
  T('otrona-text-80x24', 'otrona', 'Otrona Attache', 80, 24, 8, 16, 640, 384, 1,
    'otrona-g-chargen.bin', 'otrona', 256, f8(16, 7),
    m(8, 6, 8, 6), '#ffb347', '#000000', '#000000', '#303030', '#666', otrPal),
];
