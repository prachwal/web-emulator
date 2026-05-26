import { describe, it, expect } from 'vitest';
import { asciiCharMapper, petsciiCharMapper, petsciiShiftedCharMapper, getMapper } from '../video/text/CharMapper';

describe('asciiCharMapper', () => {
  it('passes through ASCII characters', () => {
    expect(asciiCharMapper.mapCharCode(0x41)).toBe(0x41);
    expect(asciiCharMapper.mapCharCode(0x20)).toBe(0x20);
  });
});

describe('petsciiCharMapper', () => {
  it('maps uppercase A to PETSCII 1', () => {
    expect(petsciiCharMapper.mapCharCode(0x41)).toBe(1);
  });
  it('maps lowercase a to PETSCII 1', () => {
    expect(petsciiCharMapper.mapCharCode(0x61)).toBe(1);
  });
  it('maps 0 to PETSCII 32', () => {
    expect(petsciiCharMapper.mapCharCode(0x30)).toBe(0x20);
  });
});

describe('getMapper', () => {
  it('returns ascii for unknown id', () => {
    expect(getMapper('unknown').id).toBe('ascii');
  });
  it('returns petscii for petscii id', () => {
    expect(getMapper('petscii').id).toBe('petscii');
  });

  it('petscii shifted keeps lowercase distinct from uppercase', () => {
    const m = petsciiShiftedCharMapper;
    const lowerA = m.mapCharCode(0x61); // 'a'
    const upperA = m.mapCharCode(0x41); // 'A'
    expect(lowerA).not.toBe(upperA);
    expect(m.mapCharCode(0x61)).toBe(1);  // 'a' → 1
    expect(m.mapCharCode(0x7a)).toBe(26); // 'z' → 26
    expect(m.mapCharCode(0x41)).toBe(33); // 'A' → 33 (PETSCII uppercase slot)
  });
});
