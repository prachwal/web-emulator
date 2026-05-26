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

  initialize(options: RendererOptions): void {
    this.canvas = options.canvas;
    this.sourceWidth = options.sourceWidth;
    this.sourceHeight = options.sourceHeight;
    this.pixelAspectRatio = options.pixelAspectRatio;
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

  setBorderColor(color: [number, number, number]): void {
    this.borderColor = color;
  }

  setScaling(parMultiplier: number, integerScale: boolean): void {
    this.integerScale = integerScale;
  }

  render(_frameNumber: number): void {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.imageSmoothingEnabled = false;
    const br = this.borderColor;
    ctx.fillStyle = `rgb(${Math.round(br[0]*255)},${Math.round(br[1]*255)},${Math.round(br[2]*255)})`;
    ctx.fillRect(0, 0, cw, ch);

    const geo: DisplayGeometry = {
      sourceWidth: this.sourceWidth,
      sourceHeight: this.sourceHeight,
      pixelAspectRatio: this.pixelAspectRatio,
      integerScale: this.integerScale,
      overscanX: 0,
      overscanY: 0,
    };
    const vp = computeViewport(geo, cw, ch);
    const { viewportWidth: vw, viewportHeight: vh, offsetX: ox, offsetY: oy } = vp;

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
