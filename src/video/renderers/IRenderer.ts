import type { CrtSettings } from '../../core/types';

export interface RendererOptions {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  sourceWidth: number;
  sourceHeight: number;
  pixelAspectRatio: number;
  crt: CrtSettings;
}

export interface IRenderer {
  readonly kind: 'webgl2' | 'webgpu' | 'canvas2d';

  initialize(options: RendererOptions): Promise<void> | void;
  resize(displayWidth: number, displayHeight: number, devicePixelRatio: number): void;
  uploadPalette(palette: Uint8Array): void;
  uploadFrame(framebuffer: Uint8Array): void;
  render(frameNumber: number): void;
  updateCrt(settings: CrtSettings): void;
  setBorderColor(color: [number, number, number]): void;
  setScaling(parMultiplier: number, integerScale: boolean): void;
  setZoom(zoom: number): void;
  dispose(): void;
}
