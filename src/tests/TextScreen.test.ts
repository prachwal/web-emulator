import { describe, it, expect } from 'vitest';
import { TextScreen } from '../video/text/TextScreen';
import { AttributeTextScreen } from '../video/text/AttributeTextScreen';

describe('TextScreen', () => {
  it('creates screen with correct size', () => {
    const s = new TextScreen(40, 25);
    expect(s.columns).toBe(40);
    expect(s.rows).toBe(25);
    expect(s.chars.length).toBe(1000);
  });

  it('clears with space character', () => {
    const s = new TextScreen(10, 10);
    s.putChar(0, 0, 65);
    s.clear();
    expect(s.getChar(0, 0)).toBe(32);
  });

  it('putChar writes and getChar reads', () => {
    const s = new TextScreen(10, 10);
    s.putChar(3, 4, 65);
    expect(s.getChar(3, 4)).toBe(65);
  });

  it('putChar ignores out-of-bounds', () => {
    const s = new TextScreen(10, 10);
    s.putChar(-1, 0, 65);
    s.putChar(99, 99, 65);
    expect(s.getChar(-1, 0)).toBe(0);
  });

  it('writeText writes a string', () => {
    const s = new TextScreen(10, 10);
    s.writeText(1, 1, 'HELLO');
    expect(s.getChar(1, 1)).toBe(72);
    expect(s.getChar(5, 1)).toBe(79);
  });

  it('scroll shifts content up', () => {
    const s = new TextScreen(5, 3);
    s.writeText(0, 0, 'AAAAA');
    s.writeText(0, 1, 'BBBBB');
    s.writeText(0, 2, 'CCCCC');
    s.scroll();
    expect(s.getChar(0, 0)).toBe(66);
    expect(s.getChar(0, 1)).toBe(67);
    expect(s.getChar(0, 2)).toBe(32);
  });
});

describe('AttributeTextScreen', () => {
  it('creates screen with colors', () => {
    const s = new AttributeTextScreen(40, 25);
    expect(s.chars.length).toBe(1000);
    expect(s.foreground.length).toBe(1000);
    expect(s.background.length).toBe(1000);
  });

  it('putChar with colors', () => {
    const s = new AttributeTextScreen(10, 10);
    s.putChar(2, 3, 65, 14, 4);
    const cell = s.getChar(2, 3);
    expect(cell.charCode).toBe(65);
    expect(cell.foreground).toBe(14);
    expect(cell.background).toBe(4);
  });

  it('clear resets chars and colors', () => {
    const s = new AttributeTextScreen(10, 10);
    s.putChar(0, 0, 65, 14, 4);
    s.clear(32, 15, 0);
    const cell = s.getChar(0, 0);
    expect(cell.charCode).toBe(32);
    expect(cell.foreground).toBe(15);
    expect(cell.background).toBe(0);
  });

  it('scroll shifts all arrays', () => {
    const s = new AttributeTextScreen(5, 3);
    s.putChar(0, 0, 65, 1, 2);
    s.putChar(0, 1, 66, 3, 4);
    s.putChar(0, 2, 67, 5, 6);
    s.scroll();
    const r0 = s.getChar(0, 0);
    const r1 = s.getChar(0, 1);
    const r2 = s.getChar(0, 2);
    expect(r0.charCode).toBe(66);
    expect(r0.foreground).toBe(3);
    expect(r1.charCode).toBe(67);
    expect(r1.foreground).toBe(5);
    expect(r2.charCode).toBe(32);
  });
});
