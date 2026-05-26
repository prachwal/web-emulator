import type { VideoState, MachineProfile, DirtyRect } from '../core/types';
import { createVideoState, markAllDirty } from './VideoState';
import type { IVideoModeDecoder } from './modes/IVideoModeDecoder';
import { TextModeDecoder } from './modes/TextModeDecoder';
import { Bitmap1BppDecoder } from './modes/Bitmap1BppDecoder';
import { Bitmap2BppDecoder } from './modes/Bitmap2BppDecoder';
import { AttributeBitmapDecoder } from './modes/AttributeBitmapDecoder';
import { TilemapDecoder } from './modes/TilemapDecoder';
import { Cga160x100Decoder } from './modes/Cga160x100Decoder';
import { loadPalette, paletteToUint32 } from './Palette';
import type { BitmapFont } from './BitmapFont';
import { createDefaultFont } from './BitmapFont';

export class VideoSystem {
  state: VideoState;
  decoder: IVideoModeDecoder | null = null;
  font: BitmapFont;
  profile: MachineProfile;

  private decoders: Map<string, IVideoModeDecoder> = new Map();

  constructor(profile: MachineProfile) {
    this.profile = profile;
    this.state = createVideoState(
      profile.supportedModes[0],
      profile.sourceWidth,
      profile.sourceHeight,
    );
    this.font = createDefaultFont();

    this.registerDecoder(new TextModeDecoder(40, 25, 8, 8));
    this.registerDecoder(new Bitmap1BppDecoder(profile.sourceWidth, profile.sourceHeight));
    this.registerDecoder(new Bitmap2BppDecoder(profile.sourceWidth, profile.sourceHeight));
    this.registerDecoder(new AttributeBitmapDecoder(profile.sourceWidth, profile.sourceHeight));
    this.registerDecoder(new TilemapDecoder(profile.sourceWidth, profile.sourceHeight));
    this.registerDecoder(new Cga160x100Decoder());

    this.loadProfilePalette(profile);
    this.setMode(profile.supportedModes[0]);
  }

  private registerDecoder(decoder: IVideoModeDecoder): void {
    this.decoders.set(decoder.id, decoder);
  }

  setMode(mode: string): void {
    const decoder = this.decoders.get(mode);
    if (!decoder) return;
    this.decoder = decoder;
    this.state.mode = mode as any;
    this.state.sourceWidth = decoder.sourceWidth;
    this.state.sourceHeight = decoder.sourceHeight;
    const newSize = decoder.sourceWidth * decoder.sourceHeight;
    if (this.state.framebuffer.length !== newSize) {
      this.state.framebuffer = new Uint8Array(newSize);
    }
    markAllDirty(this.state);
  }

  private loadProfilePalette(profile: MachineProfile): void {
    const pal = loadPalette(profile.defaultPalette);
    if (pal) {
      this.state.palette = pal.colors;
    }
  }

  loadPaletteByName(name: string): void {
    const pal = loadPalette(name);
    if (pal) {
      this.state.palette = pal.colors;
    }
  }

  setFont(font: BitmapFont): void {
    this.font = font;
  }

  resetFrame(): void {
    this.state.dirtyRects = [];
    this.state.frameNumber = 0;
  }

  stepFrame(memory?: unknown): void {
    if (!this.decoder) return;
    this.decoder.decode(
      memory ?? this.getDefaultMemory(),
      this.state.framebuffer,
      this.state.frameNumber,
    );
    this.state.frameNumber++;
    markAllDirty(this.state);
  }

  private getDefaultMemory(): unknown {
    switch (this.state.mode) {
      case 'text':
        return {
          columns: 40,
          rows: 25,
          charWidth: 8,
          charHeight: 8,
          screenRam: new Uint8Array(40 * 25),
          colorRam: new Uint8Array(40 * 25),
          font: this.font,
          backgroundColorIndex: 0,
        };
      default:
        return {};
    }
  }
}
