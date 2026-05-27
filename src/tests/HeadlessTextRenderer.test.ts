import { describe, it, expect } from 'vitest';
import { renderHeadlessText } from '../video/text/HeadlessTextRenderer';
import { AttributeTextScreen } from '../video/text/AttributeTextScreen';
import { TextScreen } from '../video/text/TextScreen';
import { createDefaultFont } from '../video/BitmapFont';
import { asciiCharMapper, petsciiCharMapper } from '../video/text/CharMapper';

describe('renderHeadlessText', () => {
  it('renders a single character to indexed buffer', () => {
    const screen = new AttributeTextScreen(1, 1);
    screen.putChar(0, 0, 0x41, 1, 0); // 'A', fg=1, bg=0
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({ screen, font });
    expect(result.width).toBe(8);
    expect(result.height).toBe(8);
    expect(result.indexed.length).toBe(64);
    // at least one pixel is set (the 'A' glyph has non-zero pixels)
    const hasFg = result.indexed.some(p => p === 1);
    expect(hasFg).toBe(true);
  });

  it('renders multi-cell screen', () => {
    const screen = new AttributeTextScreen(3, 2);
    screen.putChar(0, 0, 0x48, 7, 0); // H
    screen.putChar(1, 0, 0x49, 7, 0); // I
    screen.putChar(0, 1, 0x21, 7, 0); // !
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({ screen, font });
    expect(result.width).toBe(24);
    expect(result.height).toBe(16);
    expect(result.indexed.length).toBe(384);
  });

  it('is deterministic (same input = same output)', () => {
    const screen = new AttributeTextScreen(2, 2);
    screen.putChar(0, 0, 0x41, 1, 0);
    const font = createDefaultFont(8, 8);
    const a = renderHeadlessText({ screen, font });
    const b = renderHeadlessText({ screen, font });
    expect(a.indexed).toEqual(b.indexed);
  });

  it('produces indexed buffer with correct color indices', () => {
    const screen = new AttributeTextScreen(1, 1);
    screen.putChar(0, 0, 0x20, 5, 3); // space, fg=5, bg=3
    const font = createDefaultFont(8, 8);
    const result = renderHeadlessText({ screen, font });
    // space char renders all background
    expect(result.indexed[0]).toBe(3);
  });

  it('produces RGBA buffer when palette is given', () => {
    const screen = new AttributeTextScreen(1, 1);
    screen.putChar(0, 0, 0x41, 1, 0); // 'A', fg=1
    const font = createDefaultFont(8, 8);
    const palette = ['#000000', '#ff0000'];
    const result = renderHeadlessText({ screen, font, palette });
    expect(result.rgba).toBeDefined();
    expect(result.rgba!.length).toBe(64 * 4);
    // at least one pixel is red (index 1 = #ff0000)
    const hasRed = result.rgba!.some((_, i) => i % 4 === 0 && result.rgba![i] === 0xff);
    expect(hasRed).toBe(true);
  });
});
