import type { IRenderer, RendererOptions } from './IRenderer';
import type { CrtSettings } from '../../core/types';
import { computeViewport } from '../DisplayGeometry';
import type { DisplayGeometry } from '../DisplayGeometry';

export class Canvas2DRenderer implements IRenderer {
  readonly kind = 'canvas2d' as const;

  private canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private pixelAspectRatio: number = 1;
  private parMultiplier: number = 1;
  private zoom: number = 1;
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
  private borderColor: [number, number, number] = [0, 0, 0];
  private integerScale: boolean = true;

  // Reusable buffers (avoid per-frame allocation)
  private tempCanvas: OffscreenCanvas | null = null;
  private tempCtx: OffscreenCanvasRenderingContext2D | null = null;
  private reuseImageData: ImageData | null = null;

  initialize(options: RendererOptions): void {
    this.canvas = options.canvas;
    this.sourceWidth = options.sourceWidth;
    this.sourceHeight = options.sourceHeight;
    this.pixelAspectRatio = options.pixelAspectRatio;
    this.crt = options.crt;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas2D: failed to get 2d context');
    this.ctx = ctx;
    this.initBuffers();
  }

  private initBuffers(): void {
    this.tempCanvas = new OffscreenCanvas(this.sourceWidth, this.sourceHeight);
    this.tempCtx = this.tempCanvas.getContext('2d')!;
    this.reuseImageData = this.tempCtx.createImageData(this.sourceWidth, this.sourceHeight);
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

  setBorderColor(color: [number, number, number]): void {
    this.borderColor = color;
  }

  setScaling(parMultiplier: number, integerScale: boolean): void {
    this.parMultiplier = parMultiplier;
    this.integerScale = integerScale;
  }

  setZoom(z: number): void {
    this.zoom = z;
  }

  render(_frameNumber: number): void {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.imageSmoothingEnabled = false;
    const br = this.borderColor;
    ctx.fillStyle = `rgb(${br[0]},${br[1]},${br[2]})`;
    ctx.fillRect(0, 0, cw, ch);

    const geo: DisplayGeometry = {
      sourceWidth: this.sourceWidth,
      sourceHeight: this.sourceHeight,
      pixelAspectRatio: this.pixelAspectRatio * this.parMultiplier,
      integerScale: this.integerScale,
      overscanX: 0,
      overscanY: 0,
      zoom: this.zoom,
    };
    const vp = computeViewport(geo, cw, ch);
    const { viewportWidth: vw, viewportHeight: vh, offsetX: ox, offsetY: oy } = vp;

    if (!this.tempCanvas || !this.tempCtx || !this.reuseImageData || this.palette.length === 0) return;

    const imageData = this.reuseImageData;
    const fb = this.currentFramebuffer;
    const pal = this.palette;
    const len = Math.min(fb.length, this.sourceWidth * this.sourceHeight);
    for (let i = 0; i < len; i++) {
      const idx = fb[i] * 4;
      imageData.data[i * 4] = idx < pal.length ? pal[idx] : 0;
      imageData.data[i * 4 + 1] = idx + 1 < pal.length ? pal[idx + 1] : 0;
      imageData.data[i * 4 + 2] = idx + 2 < pal.length ? pal[idx + 2] : 0;
      imageData.data[i * 4 + 3] = idx + 3 < pal.length ? pal[idx + 3] : 255;
    }

    this.tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(this.tempCanvas, ox, oy, vw, vh);
  }

  dispose(): void {
    this.ctx = null;
    this.canvas = null;
    this.tempCtx = null;
    this.tempCanvas = null;
    this.reuseImageData = null;
  }
}
