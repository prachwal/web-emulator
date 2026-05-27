export interface Palette {
  name: string;
  colors: Uint32Array;
}

export function parseCssHexColor(hex: string): [number, number, number, number] {
  let s = hex.replace('#', '');
  if (s.length === 3) {
    s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  }
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  const a = s.length >= 8 ? parseInt(s.slice(6, 8), 16) : 255;
  return [r, g, b, a];
}

export function paletteToRgbaBytes(colors: string[]): Uint8Array {
  const buf = new Uint8Array(colors.length * 4);
  for (let i = 0; i < colors.length; i++) {
    const [r, g, b, a] = parseCssHexColor(colors[i]);
    buf[i * 4] = r;
    buf[i * 4 + 1] = g;
    buf[i * 4 + 2] = b;
    buf[i * 4 + 3] = a;
  }
  return buf;
}

export function paletteToUint32(colors: string[]): Uint32Array {
  const arr = new Uint32Array(colors.length);
  for (let i = 0; i < colors.length; i++) {
    const [r, g, b, a] = parseCssHexColor(colors[i]);
    arr[i] = (a << 24) | (b << 16) | (g << 8) | r;
  }
  return arr;
}

export function paletteToMonochrome(colors: string[], phosphor: 'green' | 'amber' | 'white'): string[] {
  const lums = colors.map(c => {
    const [r, g, b] = parseCssHexColor(c);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  });
  const maxLum = Math.max(1, ...lums);
  return colors.map((c, i) => {
    const v = Math.round(Math.min(255, lums[i] * 255 / maxLum));
    const s = v.toString(16).padStart(2, '0');
    if (phosphor === 'green') return `#00${s}00`;
    if (phosphor === 'amber') return `#ff${Math.round(v * 0.7).toString(16).padStart(2, '0')}00`;
    return `#${s}${s}${s}`;
  });
}

export const zxSpectrumColors: string[] = [
  '#000000', '#0000D7', '#D70000', '#D700D7',
  '#00D700', '#00D7D7', '#D7D700', '#D7D7D7',
  '#000000', '#0000FF', '#FF0000', '#FF00FF',
  '#00FF00', '#00FFFF', '#FFFF00', '#FFFFFF',
];

export const c64Colors: string[] = [
  '#000000', '#FFFFFF', '#880000', '#A8F8F8',
  '#F8A800', '#F8F8A8', '#00A800', '#00F800',
  '#A800A8', '#F8A8F8', '#A80000', '#F8A8A8',
  '#000088', '#0000A8', '#008888', '#00A8A8',
];

export function loadPalette(name: string): Palette | undefined {
  switch (name) {
    case 'zx-spectrum':
      return { name: 'ZX Spectrum', colors: paletteToUint32(zxSpectrumColors) };
    case 'c64':
      return { name: 'C64', colors: paletteToUint32(c64Colors) };
    default:
      return undefined;
  }
}

export function paletteToRgba(palette: Palette): Uint8Array {
  const buf = new Uint8Array(palette.colors.length * 4);
  for (let i = 0; i < palette.colors.length; i++) {
    const c = palette.colors[i];
    buf[i * 4] = c & 0xff;
    buf[i * 4 + 1] = (c >> 8) & 0xff;
    buf[i * 4 + 2] = (c >> 16) & 0xff;
    buf[i * 4 + 3] = (c >> 24) & 0xff;
  }
  return buf;
}

export function makePaletteTexture(palette: Palette): Uint8Array {
  return paletteToRgba(palette);
}
