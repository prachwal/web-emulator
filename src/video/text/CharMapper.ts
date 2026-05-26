export type CharMapper = {
  id: string;
  name: string;
  mapCharCode(input: number): number;
};

export const asciiCharMapper: CharMapper = {
  id: 'ascii',
  name: 'ASCII',
  mapCharCode(input: number): number {
    return input & 0xff;
  },
};

export const petsciiCharMapper: CharMapper = {
  id: 'petscii',
  name: 'PETSCII',
  mapCharCode(input: number): number {
    if (input >= 0x41 && input <= 0x5a) return input - 0x40;   // A-Z → PETSCII 1-26
    if (input >= 0x61 && input <= 0x7a) return input - 0x60;   // a-z → PETSCII 1-26
    if (input >= 0x30 && input <= 0x39) return input - 0x10;   // 0-9 → PETSCII 32-41
    if (input >= 0x21 && input <= 0x2f) return input;           // !"#$%&'()*+,-./
    if (input >= 0x3a && input <= 0x40) return input;           // :;<=>?@
    if (input === 0x20) return 0x20;                             // space
    return 0x2e;                                                 // default '.'
  },
};

export const petsciiShiftedCharMapper: CharMapper = {
  id: 'petscii-shifted',
  name: 'PETSCII shifted',
  mapCharCode(input: number): number {
    if (input >= 0x61 && input <= 0x7a) return input - 0x60;   // a-z → 1-26 (lowercase set)
    if (input >= 0x41 && input <= 0x5a) return input - 0x20;   // A-Z → 65-90 (uppercase set)
    if (input >= 0x30 && input <= 0x39) return input - 0x10;   // 0-9 → 32-41
    if (input >= 0x21 && input <= 0x2f) return input;
    if (input >= 0x3a && input <= 0x40) return input;
    if (input === 0x20) return 0x20;
    return 0x2e;
  },
};

export function getMapper(id: string): CharMapper {
  switch (id) {
    case 'petscii': return petsciiCharMapper;
    case 'petscii-shifted': return petsciiShiftedCharMapper;
    default: return asciiCharMapper;
  }
}
