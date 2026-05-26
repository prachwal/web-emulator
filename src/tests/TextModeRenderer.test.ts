import { describe, it, expect } from 'vitest';
import { renderGlyphToFramebuffer, renderAttributeTextToFramebuffer, renderCharsetTable } from '../video/text/TextModeRenderer';
import { AttributeTextScreen } from '../video/text/AttributeTextScreen';
import { loadFontFromBin, createDefaultFont } from '../video/BitmapFont';
import { asciiCharMapper } from '../video/text/CharMapper';

describe('renderGlyphToFramebuffer', () => {
  it('renders glyph with MSB-first bit order', () => {
    const font = createDefaultFont(8, 8);
    const fb = new Uint8Array(8 * 8);
    renderGlyphToFramebuffer(font, 0x41, fb, 8, 8, 0, 0, 1, 0);
    expect(fb[0]).toBe(1);
  });

  it('renders foreground for bit=1, background for bit=0', () => {
    const data = new Uint8Array(8);
    data[0] = 0x80;
    const font = loadFontFromBin('test', 'Test', data, 1, 8, 8, 'msb-left');
    const fb = new Uint8Array(8 * 8);
    renderGlyphToFramebuffer(font, 0, fb, 8, 8, 0, 0, 7, 3);
    expect(fb[0]).toBe(7);
    expect(fb[1]).toBe(3);
  });

  it('renders with LSB-first bit order', () => {
    const data = new Uint8Array(8);
    data[0] = 0x01;
    const font = loadFontFromBin('test', 'Test', data, 1, 8, 8, 'lsb-left');
    const fb = new Uint8Array(8 * 8);
    renderGlyphToFramebuffer(font, 0, fb, 8, 8, 0, 0, 1, 0);
    expect(fb[0]).toBe(1);
    expect(fb[1]).toBe(0);
  });

  it('stays within framebuffer bounds', () => {
    const font = createDefaultFont(8, 8);
    const fb = new Uint8Array(4 * 4);
    renderGlyphToFramebuffer(font, 0x41, fb, 4, 4, 0, 0, 1, 0);
    expect(fb[0]).toBeGreaterThanOrEqual(0);
  });
});

describe('renderAttributeTextToFramebuffer', () => {
  it('renders full screen', () => {
    const font = createDefaultFont(8, 8);
    const screen = new AttributeTextScreen(4, 4);
    screen.writeText(0, 0, 'TEST', 7, 0);
    const fb = new Uint8Array(32 * 32);
    renderAttributeTextToFramebuffer(screen, font, fb);
    expect(fb[0]).toBe(7);
  });

  it('invertMsb swaps fg/bg when charCode >= 128', () => {
    const font = createDefaultFont(8, 8);
    const screen = new AttributeTextScreen(4, 4);
    screen.clear(32, 3, 9);
    screen.writeText(0, 0, 'A', 7, 0);
    const fb = new Uint8Array(32 * 32);
    const fb2 = new Uint8Array(32 * 32);
    renderAttributeTextToFramebuffer(screen, font, fb, {}, asciiCharMapper);
    renderAttributeTextToFramebuffer(screen, font, fb2, { invertMsb: true }, asciiCharMapper);
    expect(fb[0]).toBe(7);
    expect(fb2[0]).toBe(7);
    screen.putChar(0, 0, 'A'.charCodeAt(0) | 0x80, 7, 0);
    const fb3 = new Uint8Array(32 * 32);
    renderAttributeTextToFramebuffer(screen, font, fb3, { invertMsb: true }, asciiCharMapper);
    expect(fb3[0]).toBe(0);
  });
});

describe('renderCharsetTable', () => {
  it('renders all glyphs without error', () => {
    const font = createDefaultFont(8, 8);
    const fb = new Uint8Array(128 * 128);
    renderCharsetTable(font, 16, 16, fb);
    // glyph 0x41 (A) at row 4, col 1 pixel (0,0) = foreground
    const glyphRow = Math.floor(0x41 / 16);
    const glyphCol = 0x41 % 16;
    const px = glyphCol * 8;
    const py = glyphRow * 8;
    expect(fb[py * 128 + px]).toBe(15);
    expect(fb.length).toBe(16384);
  });
});
