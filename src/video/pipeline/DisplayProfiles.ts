export interface DisplayProfile {
  id: string;
  name: string;
  description: string;
  curvature: number;
  scanlineStrength: number;
  maskStrength: number;
  brightness: number;
  contrast: number;
  saturation: number;
  vignette: number;
  chromaticAberration: number;
  noiseStrength: number;
  interlace: boolean;
}

export const displayProfiles: DisplayProfile[] = [
  { id: 'clean', name: 'Clean Pixel', description: 'No CRT effects, sharp pixels',
    curvature: 0, scanlineStrength: 0, maskStrength: 0, brightness: 1, contrast: 1, saturation: 1,
    vignette: 0, chromaticAberration: 0, noiseStrength: 0, interlace: false },
  { id: 'crt-soft', name: 'CRT Soft', description: 'Soft scanlines, slight curvature',
    curvature: 0.05, scanlineStrength: 0.2, maskStrength: 0.1, brightness: 1, contrast: 1, saturation: 1,
    vignette: 0.1, chromaticAberration: 0, noiseStrength: 0, interlace: false },
  { id: 'crt-sharp', name: 'CRT Sharp', description: 'Strong scanlines, visible mask',
    curvature: 0.08, scanlineStrength: 0.4, maskStrength: 0.3, brightness: 1.1, contrast: 1.2, saturation: 1,
    vignette: 0.2, chromaticAberration: 0.002, noiseStrength: 0, interlace: false },
  { id: 'green-phosphor', name: 'Green Phosphor', description: 'Mono green phosphor monitor',
    curvature: 0.05, scanlineStrength: 0.2, maskStrength: 0, brightness: 0.9, contrast: 1, saturation: 0,
    vignette: 0.15, chromaticAberration: 0, noiseStrength: 0.02, interlace: false },
  { id: 'amber-phosphor', name: 'Amber Phosphor', description: 'Mono amber phosphor monitor',
    curvature: 0.05, scanlineStrength: 0.2, maskStrength: 0, brightness: 0.9, contrast: 1, saturation: 0,
    vignette: 0.15, chromaticAberration: 0, noiseStrength: 0.02, interlace: false },
  { id: 'composite-blur', name: 'Composite Blur', description: 'Blurry composite video',
    curvature: 0.02, scanlineStrength: 0.1, maskStrength: 0, brightness: 0.95, contrast: 0.9, saturation: 0.8,
    vignette: 0.1, chromaticAberration: 0.005, noiseStrength: 0.03, interlace: false },
  { id: 'rf-noise', name: 'RF Noise', description: 'Noisy RF signal',
    curvature: 0.03, scanlineStrength: 0.15, maskStrength: 0, brightness: 0.9, contrast: 0.85, saturation: 0.7,
    vignette: 0.1, chromaticAberration: 0.003, noiseStrength: 0.08, interlace: false },
  { id: 'interlace', name: 'Interlaced', description: 'Interlaced display flicker',
    curvature: 0.05, scanlineStrength: 0.3, maskStrength: 0, brightness: 1, contrast: 1, saturation: 1,
    vignette: 0.1, chromaticAberration: 0, noiseStrength: 0, interlace: true },
];

export function getDisplayProfile(id: string): DisplayProfile | undefined {
  return displayProfiles.find(p => p.id === id);
}

export function displayProfileToCrt(profile: DisplayProfile) {
  return {
    enabled: profile.scanlineStrength > 0 || profile.curvature > 0 || profile.maskStrength > 0,
    curvature: profile.curvature, scanlineStrength: profile.scanlineStrength,
    maskStrength: profile.maskStrength, bloomStrength: 0, bloomRadius: 0,
    brightness: profile.brightness, contrast: profile.contrast, saturation: profile.saturation,
    chromaticAberration: profile.chromaticAberration, noiseStrength: profile.noiseStrength,
    phosphorPersistence: 0, interlace: profile.interlace, vignette: profile.vignette,
  };
}
