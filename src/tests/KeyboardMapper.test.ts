import { describe, it, expect } from 'vitest';
import { BrowserKeyboardMapper } from '../input/KeyboardMapper';

describe('BrowserKeyboardMapper', () => {
  const mapper = new BrowserKeyboardMapper('zx');

  it('maps letter key', () => {
    const ev = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    const result = mapper.mapBrowserKey(ev);
    expect(result).not.toBeNull();
    expect(result!.keyCode).toBe('A');
    expect(result!.pressed).toBe(true);
    expect(result!.machineId).toBe('zx');
  });

  it('maps arrow keys', () => {
    const ev = new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp' });
    const result = mapper.mapBrowserKey(ev);
    expect(result!.keyCode).toBe('UP');
  });
});
