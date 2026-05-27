export interface FrameSource {
  width: number;
  height: number;
  palette: readonly string[];
  pixels: Uint8Array;
}

export interface BorderConfig {
  top: number; right: number; bottom: number; left: number;
  color: [number, number, number];
}

export interface DisplayOutput {
  source: FrameSource;
  border?: BorderConfig;
  geometry: {
    pixelAspectRatio: number;
    integerScale: boolean;
    zoom: number;
  };
  crt: {
    curvature: number; scanlineStrength: number; maskStrength: number;
    brightness: number; contrast: number; saturation: number;
    vignette: number; chromaticAberration: number; noiseStrength: number;
    interlace: boolean;
  };
}

export function frameSourceFromBuffer(
  pixels: Uint8Array, width: number, height: number, palette: readonly string[],
): FrameSource {
  return { width, height, palette, pixels };
}
