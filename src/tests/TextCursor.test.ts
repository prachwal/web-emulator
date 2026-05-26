import { describe, it, expect } from 'vitest';
import { TextCursor } from '../video/text/TextCursor';

describe('TextCursor', () => {
  it('initializes at 0,0', () => {
    const c = new TextCursor(40, 25);
    expect(c.x).toBe(0);
    expect(c.y).toBe(0);
  });

  it('moveTo positions cursor', () => {
    const c = new TextCursor(40, 25);
    c.moveTo(10, 5);
    expect(c.x).toBe(10);
    expect(c.y).toBe(5);
  });

  it('advance moves to next column', () => {
    const c = new TextCursor(40, 25);
    c.advance(40);
    expect(c.x).toBe(1);
    expect(c.y).toBe(0);
  });

  it('advance wraps to next row', () => {
    const c = new TextCursor(40, 25);
    c.moveTo(39, 0);
    c.advance(40);
    expect(c.x).toBe(0);
    expect(c.y).toBe(1);
  });

  it('newline moves to next row', () => {
    const c = new TextCursor(40, 25);
    c.moveTo(10, 5);
    c.newline();
    expect(c.x).toBe(0);
    expect(c.y).toBe(6);
  });

  it('backspace moves left', () => {
    const c = new TextCursor(40, 25);
    c.moveTo(5, 3);
    c.backspace();
    expect(c.x).toBe(4);
    expect(c.y).toBe(3);
  });

  it('backspace wraps to previous row', () => {
    const c = new TextCursor(40, 25);
    c.moveTo(0, 3);
    c.backspace();
    expect(c.x).toBe(39);
    expect(c.y).toBe(2);
  });
});
