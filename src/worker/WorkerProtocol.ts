import type { CrtSettings, MachineProfile } from '../core/types';
import type { BitmapFont } from '../video/BitmapFont';

export interface SerializedFont {
  name: string;
  glyphCount: number;
  charWidth: number;
  charHeight: number;
  bytesPerGlyph: number;
  data: number[];
}

export interface EmulatorConfig {
  profile: MachineProfile;
  crt: CrtSettings;
  mode: string;
}

export type MainToWorkerMessage =
  | { type: 'init'; canvas?: OffscreenCanvas; config: EmulatorConfig }
  | { type: 'resize'; width: number; height: number; dpr: number }
  | { type: 'set-crt'; settings: CrtSettings }
  | { type: 'load-font'; font: SerializedFont }
  | { type: 'load-palette'; palette: number[] }
  | { type: 'set-mode'; mode: string }
  | { type: 'key-down'; code: string }
  | { type: 'key-up'; code: string }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'step-frame'; memory?: unknown }
  | { type: 'tick'; timestamp: number }
  | { type: 'update-memory'; memory: unknown };

export type WorkerToMainMessage =
  | { type: 'ready'; renderer: string }
  | { type: 'stats'; fps: number; frameTimeMs: number; uploadMs: number; renderMs: number }
  | { type: 'frame' }
  | { type: 'error'; message: string; stack?: string };

export function serializeFont(font: BitmapFont): SerializedFont {
  return {
    name: font.name,
    glyphCount: font.glyphCount,
    charWidth: font.charWidth,
    charHeight: font.charHeight,
    bytesPerGlyph: font.bytesPerGlyph,
    data: Array.from(font.data),
  };
}

export function deserializeFont(data: SerializedFont): BitmapFont {
  return {
    name: data.name,
    glyphCount: data.glyphCount,
    charWidth: data.charWidth,
    charHeight: data.charHeight,
    bytesPerGlyph: data.bytesPerGlyph,
    data: new Uint8Array(data.data),
  };
}
