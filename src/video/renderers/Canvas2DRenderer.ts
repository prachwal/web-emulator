import type { IRenderer, RendererOptions } from './IRenderer';
import type { CrtSettings } from '../../core/types';

export class Canvas2DRenderer implements IRenderer {
  readonly kind = 'canvas2d' as const;

  private canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private displayWidth: number = 0;
  private displayHeight: number = 0;
  private dpr: number = 1;
  private palette: Uint8Array = new Uint8Array(0);
  private currentFramebuffer: Uint8Array = new Uint8Array(0);
  private crt: CrtSettings = {
    enabled: false, curvature: 0, scanlineStrength: 0,
    maskStrength: 0, bloomStrength: 0, bloomRadius: 0,
    brightness: 1, contrast: 1, saturation: 1,
    chromaticAberration: 0, noiseStrength: 0,
    phosphorPersistence: 0, interlace: false, vignette: 0,
  };

  initialize(options: RendererOptions): void {
    this.canvas = options.canvas;
    this.sourceWidth = options.sourceWidth;
    this.sourceHeight = options.sourceHeight;
    this.crt = options.crt;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas2D: failed to get 2d context');
    this.ctx = ctx;
  }

  resize(displayWidth: number, displayHeight: number, dpr: number): void {
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.dpr = dpr;
    if (this.canvas) {
      this.canvas.width = Math.round(displayWidth * dpr);
      this.canvas.height = Math.round(displayHeight * dpr);
    }
  }

  uploadPalette(palette: Uint8Array): void {
    this.palette = palette;
  }

  uploadFrame(framebuffer: Uint8Array): void {
    this.currentFramebuffer = framebuffer;
  }

  updateCrt(settings: CrtSettings): void {
    this.crt = settings;
  }

  render(_frameNumber: number): void {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);

    const scale = Math.max(1, Math.floor(Math.min(
      cw / this.sourceWidth,
      ch / this.sourceHeight,
    )));

    const vw = this.sourceWidth * scale;
    const vh = this.sourceHeight * scale;
    const ox = Math.floor((cw - vw) / 2);
    const oy = Math.floor((ch - vh) / 2);

    if (this.palette.length === 0) return;

    const imageData = ctx.createImageData(this.sourceWidth, this.sourceHeight);
    for (let i = 0; i < this.currentFramebuffer.length && i < this.sourceWidth * this.sourceHeight; i++) {
      const idx = this.currentFramebuffer[i] * 4;
      imageData.data[i * 4] = idx < this.palette.length ? this.palette[idx] : 0;
      imageData.data[i * 4 + 1] = idx + 1 < this.palette.length ? this.palette[idx + 1] : 0;
      imageData.data[i * 4 + 2] = idx + 2 < this.palette.length ? this.palette[idx + 2] : 0;
      imageData.data[i * 4 + 3] = idx + 3 < this.palette.length ? this.palette[idx + 3] : 255;
    }

    const tempCanvas = new OffscreenCanvas(this.sourceWidth, this.sourceHeight);
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.drawImage(tempCanvas, ox, oy, vw, vh);
  }

  dispose(): void {
    this.ctx = null;
    this.canvas = null;
  }
}
