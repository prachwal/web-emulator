import { describe, it, expect } from 'vitest';
import { RingBuffer } from '../core/RingBuffer';

describe('RingBuffer', () => {
  it('pushes and pops values', () => {
    const buf = new RingBuffer<number>(4);
    buf.push(1);
    buf.push(2);
    expect(buf.pop()).toBe(1);
    expect(buf.pop()).toBe(2);
    expect(buf.pop()).toBeUndefined();
  });

  it('overwrites oldest when full', () => {
    const buf = new RingBuffer<number>(3);
    buf.push(1);
    buf.push(2);
    buf.push(3);
    buf.push(4);
    expect(buf.toArray()).toEqual([2, 3, 4]);
  });

  it('clears buffer', () => {
    const buf = new RingBuffer<number>(3);
    buf.push(1);
    buf.push(2);
    buf.clear();
    expect(buf.size).toBe(0);
    expect(buf.pop()).toBeUndefined();
  });
});
