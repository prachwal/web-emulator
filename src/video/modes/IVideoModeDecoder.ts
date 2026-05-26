import type { VideoMode } from '../../core/types';

export interface IVideoModeDecoder<TMemory = unknown> {
  readonly id: VideoMode;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  decode(memory: TMemory, target: Uint8Array, frameNumber: number): void;
}
