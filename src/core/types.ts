export type Rgba = number;
export type ColorIndex = number;

export interface Size {
  width: number;
  height: number;
}

export interface DirtyRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type VideoMode =
  | 'text'
  | 'attribute-text'
  | 'bitmap-1bpp'
  | 'bitmap-2bpp'
  | 'attribute-bitmap'
  | 'tilemap'
  | 'c64-text'
  | 'cga-160x100'
  | 'semi-graphics'
  | 'c64-multicolor'
  | 'kaypro-graphics'
  | 'herc-bitmap';

export interface VideoState {
  mode: VideoMode;
  sourceWidth: number;
  sourceHeight: number;
  frameNumber: number;
  framebuffer: Uint8Array;
  palette: Uint32Array;
  dirtyRects: DirtyRect[];
  borderColorIndex: number;
}

export interface CrtSettings {
  enabled: boolean;
  curvature: number;
  scanlineStrength: number;
  maskStrength: number;
  bloomStrength: number;
  bloomRadius: number;
  brightness: number;
  contrast: number;
  saturation: number;
  chromaticAberration: number;
  noiseStrength: number;
  phosphorPersistence: number;
  interlace: boolean;
  vignette: number;
}

export function defaultCrtSettings(): CrtSettings {
  return {
    enabled: true,
    curvature: 0.05,
    scanlineStrength: 0.3,
    maskStrength: 0.15,
    bloomStrength: 0.0,
    bloomRadius: 2.0,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    chromaticAberration: 0.0,
    noiseStrength: 0.0,
    phosphorPersistence: 0.0,
    interlace: false,
    vignette: 0.2,
  };
}

export interface MachineProfile {
  id: string;
  name: string;
  sourceWidth: number;
  sourceHeight: number;
  refreshRate: number;
  defaultPalette: string;
  defaultFont?: string;
  supportedModes: VideoMode[];
  pixelAspectRatio: number;
  border: {
    enabled: boolean;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export const zxSpectrumProfile: MachineProfile = {
  id: 'zx-spectrum-like',
  name: 'ZX Spectrum-like',
  sourceWidth: 256,
  sourceHeight: 192,
  refreshRate: 50,
  defaultPalette: 'zx-spectrum',
  pixelAspectRatio: 1,
  supportedModes: ['attribute-bitmap'],
  border: { enabled: true, left: 32, right: 32, top: 24, bottom: 24 },
};

export const c64Profile: MachineProfile = {
  id: 'c64-like',
  name: 'C64-like',
  sourceWidth: 320,
  sourceHeight: 200,
  refreshRate: 50,
  defaultPalette: 'c64',
  defaultFont: 'c64-charrom',
  pixelAspectRatio: 5 / 6,
  supportedModes: ['text', 'bitmap-2bpp', 'c64-text'],
  border: { enabled: true, left: 24, right: 24, top: 20, bottom: 20 },
};

export const machineProfiles: Record<string, MachineProfile> = {
  'zx-spectrum-like': zxSpectrumProfile,
  'c64-like': c64Profile,
};
