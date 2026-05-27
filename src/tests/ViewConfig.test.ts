import { describe, it, expect } from 'vitest';
import { exportViewConfig, importViewConfig } from '../video/pipeline/ViewConfig';

describe('ViewConfig', () => {
  it('exports and imports config', () => {
    const json = exportViewConfig({
      computer: 'Sinclair', machineId: 'zx', presetId: 'zx-text-32x24',
      monitorId: 'zx-tv', displayProfileId: 'crt-soft',
      parMultiplier: 1, zoom: 0.9, screenMode: 'demo', shiftLock: false, showBorder: true,
    });
    const obj = importViewConfig(json);
    expect(obj).not.toBeNull();
    expect(obj!.machineId).toBe('zx');
  });

  it('returns null for invalid JSON', () => {
    expect(importViewConfig('not json')).toBeNull();
  });

  it('returns null for wrong version', () => {
    expect(importViewConfig('{"version":99}')).toBeNull();
  });
});
