import { describe, it, expect } from 'vitest';
import { paletteToMonochrome, parseCssHexColor, paletteToRgbaBytes, paletteToUint32 } from '../video/Palette';

describe('paletteToMonochrome', () => {
  it('converts colors to green shades', () => {
    const result = paletteToMonochrome(['#ff0000', '#00ff00', '#0000ff', '#ffffff'], 'green');
    expect(result[0]).toMatch(/^#00[0-9a-f]{2}00$/);
    expect(result[3]).toBe('#00ff00');
  });

  it('converts colors to amber shades', () => {
    const result = paletteToMonochrome(['#ff0000', '#ffffff'], 'amber');
    expect(result[0]).toMatch(/^#ff[0-9a-f]{2}00$/);
  });
});

describe('parseCssHexColor', () => {
  it('parses 6-digit hex', () => {
    expect(parseCssHexColor('#FF0000')).toEqual([255, 0, 0, 255]);
    expect(parseCssHexColor('#00FF00')).toEqual([0, 255, 0, 255]);
    expect(parseCssHexColor('#0000FF')).toEqual([0, 0, 255, 255]);
  });

  it('parses 3-digit hex', () => {
    expect(parseCssHexColor('#F00')).toEqual([255, 0, 0, 255]);
  });

  it('parses with alpha', () => {
    expect(parseCssHexColor('#FF000080')).toEqual([255, 0, 0, 128]);
  });
});

describe('paletteToRgbaBytes', () => {
  it('converts colors to RGBA buffer', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    const buf = paletteToRgbaBytes(colors);
    expect(buf[0]).toBe(255);
    expect(buf[1]).toBe(0);
    expect(buf[2]).toBe(0);
    expect(buf[3]).toBe(255);
    expect(buf[4]).toBe(0);
    expect(buf[5]).toBe(255);
    expect(buf[6]).toBe(0);
    expect(buf[7]).toBe(255);
  });
});

describe('paletteToUint32', () => {
  it('converts colors to Uint32Array', () => {
    const colors = ['#FF0000', '#00FF00'];
    const arr = paletteToUint32(colors);
    expect(arr[0]).toBe(0xFF0000FF);
    expect(arr[1]).toBe(0xFF00FF00);
  });
});
