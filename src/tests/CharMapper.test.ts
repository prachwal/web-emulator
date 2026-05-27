import { describe, it, expect } from 'vitest';
import { asciiCharMapper, petsciiCharMapper, petsciiShiftedCharMapper, getMapper, rawScreenCode } from '../video/text/CharMapper';

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
  it('maps 0 to PETSCII 48 (unchanged from ASCII - digits at same positions)', () => {
    expect(petsciiCharMapper.mapCharCode(0x30)).toBe(0x30);
    expect(petsciiCharMapper.mapCharCode(0x39)).toBe(0x39);
  });
  it('passes through PETSCII graphics codes 0-31', () => {
    expect(petsciiCharMapper.mapCharCode(0)).toBe(0);
    expect(petsciiCharMapper.mapCharCode(1)).toBe(1);
    expect(petsciiCharMapper.mapCharCode(15)).toBe(15);
    expect(petsciiCharMapper.mapCharCode(31)).toBe(31);
  });
  it('maps PETSCII graphics 128-159 to screen codes 0-31', () => {
    expect(petsciiCharMapper.mapCharCode(128)).toBe(0);
    expect(petsciiCharMapper.mapCharCode(129)).toBe(1);
    expect(petsciiCharMapper.mapCharCode(143)).toBe(15);
    expect(petsciiCharMapper.mapCharCode(159)).toBe(31);
  });
  it('does not map graphics to dot', () => {
    for (let c = 0; c < 32; c++) {
      expect(petsciiCharMapper.mapCharCode(c)).not.toBe(0x2e);
    }
    for (let c = 128; c < 160; c++) {
      expect(petsciiCharMapper.mapCharCode(c)).not.toBe(0x2e);
    }
  });
  it('passes explicit Commodore screen codes through unchanged', () => {
    expect(petsciiCharMapper.mapCharCode(rawScreenCode(64))).toBe(64);
    expect(petsciiCharMapper.mapCharCode(rawScreenCode(79))).toBe(79);
    expect(petsciiCharMapper.mapCharCode(rawScreenCode(0xff))).toBe(0xff);
  });
  it('maps C64 PETSCII graphics to chargen screen codes', () => {
    expect(petsciiCharMapper.mapCharCode(192)).toBe(64);
    expect(petsciiCharMapper.mapCharCode(205)).toBe(77);
    expect(petsciiCharMapper.mapCharCode(206)).toBe(78);
    expect(petsciiCharMapper.mapCharCode(223)).toBe(95);
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
    expect(m.mapCharCode(0x41)).toBe(0x41); // 'A' → 65 (PETSCII uppercase slot)
  });
});
