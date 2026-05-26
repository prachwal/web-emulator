export type TextVideoModeDefinition = {
  id: string;
  label: string;
  columns: number;
  rows: number;
  charWidth: number;
  charHeight: number;
  framebufferWidth: number;
  framebufferHeight: number;
  pixelAspectRatio: number;
  displayAspectRatio: number;
};

export const textVideoModes: TextVideoModeDefinition[] = [
  {
    id: 'text-32x24',
    label: 'Text 32×24 / 256×192',
    columns: 32,
    rows: 24,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 256,
    framebufferHeight: 192,
    pixelAspectRatio: 1,
    displayAspectRatio: 4 / 3,
  },
  {
    id: 'text-40x25',
    label: 'Text 40×25 / 320×200',
    columns: 40,
    rows: 25,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 320,
    framebufferHeight: 200,
    pixelAspectRatio: 5 / 6,
    displayAspectRatio: 4 / 3,
  },
  {
    id: 'text-40x24',
    label: 'Text 40×24 / 320×192',
    columns: 40,
    rows: 24,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 320,
    framebufferHeight: 192,
    pixelAspectRatio: 5 / 6,
    displayAspectRatio: 4 / 3,
  },
  {
    id: 'text-80x25',
    label: 'Text 80×25 / 640×200',
    columns: 80,
    rows: 25,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 640,
    framebufferHeight: 200,
    pixelAspectRatio: 1,
    displayAspectRatio: 4 / 3,
  },
  {
    id: 'text-64x16',
    label: 'Text 64×16 / 512×128',
    columns: 64,
    rows: 16,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 512,
    framebufferHeight: 128,
    pixelAspectRatio: 1,
    displayAspectRatio: 4 / 3,
  },
  {
    id: 'text-22x23',
    label: 'Text 22×23 / 176×184',
    columns: 22,
    rows: 23,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 176,
    framebufferHeight: 184,
    pixelAspectRatio: 1,
    displayAspectRatio: 4 / 3,
  },
  {
    id: 'charset-16x16',
    label: 'Charset 16×16 (all glyphs)',
    columns: 16,
    rows: 16,
    charWidth: 8,
    charHeight: 8,
    framebufferWidth: 128,
    framebufferHeight: 128,
    pixelAspectRatio: 1,
    displayAspectRatio: 1,
  },
];

export function getTextMode(id: string): TextVideoModeDefinition | undefined {
  return textVideoModes.find(m => m.id === id);
}
