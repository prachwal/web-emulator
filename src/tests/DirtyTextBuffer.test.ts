import { describe, it, expect } from 'vitest';
import { DirtyTextBuffer } from '../video/text/DirtyTextBuffer';
import { AttributeTextScreen } from '../video/text/AttributeTextScreen';
import { createDefaultFont } from '../video/BitmapFont';
import { hashBuffer } from './golden/GoldenSnapshot';

describe('DirtyTextBuffer', () => {
  it('renders full screen on first call', () => {
    const buf = new DirtyTextBuffer();
    const screen = new AttributeTextScreen(4, 2);
    screen.writeText(0, 0, 'TEST');
    const font = createDefaultFont();
    const fb = new Uint8Array(4 * 2 * 8 * 8);
    buf.markDirty(screen);
    const rendered = buf.render(screen, font, fb);
    expect(rendered).toBe(true);
    // at least some pixels set
    expect(fb.some(p => p > 0)).toBe(true);
  });

  it('skips render when nothing changed', () => {
    const buf = new DirtyTextBuffer();
    const screen = new AttributeTextScreen(2, 1);
    screen.writeText(0, 0, 'A');
    const font = createDefaultFont();
    const fb = new Uint8Array(2 * 1 * 8 * 8);
    buf.markDirty(screen);
    buf.render(screen, font, fb);
    const h1 = hashBuffer(fb);
    // same screen again
    buf.markDirty(screen);
    const rendered = buf.render(screen, font, fb);
    expect(rendered).toBe(false); // no change
    const h2 = hashBuffer(fb);
    expect(h1).toBe(h2); // framebuffer unchanged
  });

  it('renders after content change', () => {
    const buf = new DirtyTextBuffer();
    const screen = new AttributeTextScreen(2, 1);
    screen.writeText(0, 0, 'A');
    const font = createDefaultFont();
    const fb = new Uint8Array(128);
    buf.markDirty(screen);
    buf.render(screen, font, fb);
    const h1 = hashBuffer(fb);
    screen.writeText(0, 0, ' '); // space is blank in default font
    buf.markDirty(screen);
    const rendered = buf.render(screen, font, fb);
    expect(rendered).toBe(true);
    const h2 = hashBuffer(fb);
    expect(h1).not.toBe(h2); // space != 'A'
  });
});
