import type { VideoMode } from '../core/types';

export interface IVideoMode {
  readonly id: VideoMode;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
}
