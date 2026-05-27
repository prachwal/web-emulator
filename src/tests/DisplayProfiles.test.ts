import { describe, it, expect } from 'vitest';
import { displayProfiles, getDisplayProfile, displayProfileToCrt } from '../video/pipeline/DisplayProfiles';

describe('DisplayProfiles', () => {
  it('has 8 profiles', () => {
    expect(displayProfiles.length).toBe(8);
  });

  it('getDisplayProfile returns by id', () => {
    const p = getDisplayProfile('crt-soft');
    expect(p).toBeDefined();
    expect(p!.curvature).toBe(0.05);
  });

  it('displayProfileToCrt converts correctly', () => {
    const crt = displayProfileToCrt(getDisplayProfile('clean')!);
    expect(crt.curvature).toBe(0);
    expect(crt.enabled).toBe(false);
  });
});
