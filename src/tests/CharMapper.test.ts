import { describe, it, expect } from 'vitest';
import { asciiCharMapper, petsciiCharMapper, getMapper } from '../video/text/CharMapper';

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
});
