import { describe, it, expect } from 'vitest';
import { asciiCharMapper, zxSpectrumCharMapper, petsciiCharMapper } from '../video/text/CharMapper';

describe('asciiCharMapper', () => {
  it('passes through ASCII characters', () => {
    expect(asciiCharMapper.mapCharCode(0x41)).toBe(0x41);
    expect(asciiCharMapper.mapCharCode(0x20)).toBe(0x20);
  });
});

describe('zxSpectrumCharMapper', () => {
  it('maps A-Z to ZX positions', () => {
    expect(zxSpectrumCharMapper.mapCharCode(0x41)).toBe(0x26);
  });
});

describe('petsciiCharMapper', () => {
  it('maps uppercase A to PETSCII', () => {
    expect(petsciiCharMapper.mapCharCode(0x41)).toBe(1);
  });
});
