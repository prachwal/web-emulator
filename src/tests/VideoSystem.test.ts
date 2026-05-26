import { describe, it, expect } from 'vitest';
import { VideoSystem } from '../video/VideoSystem';
import { zxSpectrumProfile } from '../core/types';

describe('VideoSystem', () => {
  it('initializes with profile', () => {
    const vs = new VideoSystem(zxSpectrumProfile);
    expect(vs.state.sourceWidth).toBe(256);
    expect(vs.state.sourceHeight).toBe(192);
    expect(vs.decoder).not.toBeNull();
  });

  it('steps frame without error', () => {
    const vs = new VideoSystem(zxSpectrumProfile);
    expect(() => vs.stepFrame()).not.toThrow();
    expect(vs.state.frameNumber).toBe(1);
  });
});
