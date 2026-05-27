import { T, f8, m } from './types';

const epsPal = ['#000000','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33',
  '#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33','#33ff33'];

export const epsonPx8Presets = [
  T('epson-px8-text-80x8', 'epson-px8', 'Epson PX-8', 80, 8, 8, 8, 640, 64, 10/3,
    'kaypro4.u9', 'epson-px8', 256, f8(8, 7),
    m(8, 6, 8, 6), '#33ff33', '#000000', '#000000', '#303030', '#666', epsPal),
];
