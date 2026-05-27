export type CharMapper = {
  id: string;
  name: string;
  mapCharCode(input: number): number;
};

export function rawScreenCode(code: number): number {
  return 0x100 | (code & 0xff);
}

export const asciiCharMapper: CharMapper = {
  id: 'ascii',
  name: 'ASCII',
  mapCharCode(input: number): number {
    return input & 0xff;
  },
};

export const petsciiCharMapper: CharMapper = {
  id: 'petscii',
  name: 'PETSCII (uppercase/graphics)',
  mapCharCode(input: number): number {
    if (input >= 0x100 && input <= 0x1ff) return input & 0xff;
    if (input >= 0xc0 && input <= 0xdf) return input - 0x80;
    if (input >= 0x80 && input <= 0x9f) return input & 0x7f;
    if (input < 0x20) return input;
    if (input >= 0x41 && input <= 0x5a) return input - 0x40;
    if (input >= 0x61 && input <= 0x7a) return input - 0x60;
    if (input >= 0x30 && input <= 0x39) return input;
    return input;
  },
};

export const petsciiShiftedCharMapper: CharMapper = {
  id: 'petscii-shifted',
  name: 'PETSCII (lowercase/uppercase)',
  mapCharCode(input: number): number {
    if (input >= 0x100 && input <= 0x1ff) return input & 0xff;
    if (input >= 0xc0 && input <= 0xdf) return input - 0x80;
    if (input >= 0xa0 && input <= 0xbf) return input & 0x7f;
    if (input < 0x20) return input;
    if (input >= 0x61 && input <= 0x7a) return input - 0x60;
    if (input >= 0x41 && input <= 0x5a) return input;
    if (input >= 0x30 && input <= 0x39) return input;
    return input;
  },
};

export function getMapper(id: string): CharMapper {
  switch (id) {
    case 'petscii': return petsciiCharMapper;
    case 'petscii-shifted': return petsciiShiftedCharMapper;
    default: return asciiCharMapper;
  }
}
