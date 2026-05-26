import type { VideoState, DirtyRect, VideoMode } from '../core/types';

export function createVideoState(
  mode: VideoMode,
  sourceWidth: number,
  sourceHeight: number,
): VideoState {
  return {
    mode,
    sourceWidth,
    sourceHeight,
    frameNumber: 0,
    framebuffer: new Uint8Array(sourceWidth * sourceHeight),
    palette: new Uint32Array(256),
    dirtyRects: [{ x: 0, y: 0, width: sourceWidth, height: sourceHeight }],
    borderColorIndex: 0,
  };
}

export function clearDirtyRects(state: VideoState): void {
  state.dirtyRects = [];
}

export function markDirty(state: VideoState, rect: DirtyRect): void {
  state.dirtyRects.push(rect);
}

export function markAllDirty(state: VideoState): void {
  state.dirtyRects = [{ x: 0, y: 0, width: state.sourceWidth, height: state.sourceHeight }];
}
