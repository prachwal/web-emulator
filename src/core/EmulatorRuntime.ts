import type { CrtSettings, MachineProfile } from './types';
import { machineProfiles, defaultCrtSettings } from './types';
import { VideoSystem } from '../video/VideoSystem';
import { loadPalette, paletteToRgba } from '../video/Palette';
import type { BitmapFont } from '../video/BitmapFont';
import { createDefaultFont } from '../video/BitmapFont';
import type { IRenderer } from '../video/renderers/IRenderer';
import { createRenderer } from '../video/renderers/RendererFactory';

export class EmulatorRuntime {
  video: VideoSystem;
  renderer: IRenderer | null = null;
  config: EmulatorConfig;
  paused: boolean = false;
  running: boolean = false;

  private frameStart: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private fpsAccum: number = 0;
  private lastFpsTime: number = 0;

  constructor(profileId: string = 'zx-spectrum-like') {
    const profile = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];
    this.video = new VideoSystem(profile);
    this.config = {
      profile,
      crt: defaultCrtSettings(),
      mode: profile.supportedModes[0],
    };
  }

  async initCanvas(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    options?: { sourceWidth: number; sourceHeight: number; pixelAspectRatio: number },
  ): Promise<void> {
    const profile = this.config.profile;
    const sourceWidth = options?.sourceWidth ?? profile.sourceWidth;
    const sourceHeight = options?.sourceHeight ?? profile.sourceHeight;
    const pixelAspectRatio = options?.pixelAspectRatio ?? profile.pixelAspectRatio;
    this.renderer = await createRenderer({
      canvas,
      sourceWidth,
      sourceHeight,
      pixelAspectRatio,
      crt: this.config.crt,
      preferred: 'auto',
    });

    const pal = loadPalette(profile.defaultPalette);
    if (pal) {
      this.renderer.uploadPalette(paletteToRgba(pal));
    }

    this.resizeCanvas(canvas);
  }

  resizeCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): void {
    if (!this.renderer) return;
    const dpr = globalThis.devicePixelRatio || 1;
    const w = canvas instanceof HTMLCanvasElement
      ? canvas.clientWidth || canvas.width
      : canvas.width;
    const h = canvas instanceof HTMLCanvasElement
      ? canvas.clientHeight || canvas.height
      : canvas.height;
    this.renderer.resize(w, h, dpr);
  }

  setMode(mode: string): void {
    this.video.setMode(mode);
    this.config.mode = mode;
  }

  setCrt(settings: CrtSettings): void {
    this.config.crt = settings;
    this.renderer?.updateCrt(settings);
  }

  setFont(font: BitmapFont): void {
    this.video.setFont(font);
  }

  loadPalette(name: string): void {
    this.video.loadPaletteByName(name);
    const pal = loadPalette(name);
    if (pal && this.renderer) {
      this.renderer.uploadPalette(paletteToRgba(pal));
    }
  }

  stepFrame(memory?: unknown): void {
    if (this.paused || !this.renderer) return;
    this.video.stepFrame(memory);
    this.renderer.uploadFrame(this.video.state.framebuffer);
    this.renderer.render(this.video.state.frameNumber);
    this.frameCount++;
  }

  renderCurrent(): void {
    if (!this.renderer) return;
    this.renderer.uploadFrame(this.video.state.framebuffer);
    this.renderer.render(this.video.state.frameNumber);
  }

  tick(timestamp: number): void {
    if (!this.running) return;
    this.stepFrame();
    this.measureFps(timestamp);
  }

  private measureFps(timestamp: number): void {
    if (this.lastFpsTime === 0) this.lastFpsTime = timestamp;
    this.fpsAccum++;
    const elapsed = timestamp - this.lastFpsTime;
    if (elapsed >= 1000) {
      this.fps = Math.round((this.fpsAccum * 1000) / elapsed);
      this.fpsAccum = 0;
      this.lastFpsTime = timestamp;
    }
  }

  getFps(): number {
    return this.fps;
  }

  start(): void {
    this.running = true;
    this.paused = false;
  }

  stop(): void {
    this.running = false;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  dispose(): void {
    this.renderer?.dispose();
    this.renderer = null;
    this.running = false;
  }
}

interface EmulatorConfig {
  profile: MachineProfile;
  crt: CrtSettings;
  mode: string;
}
