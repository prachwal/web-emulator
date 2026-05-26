#!/usr/bin/env python3
"""Dump font .bin files: show glyphs, hex, and bit-order analysis."""

import sys, os, json

def parse_bits(byte_val: int, left_bit: int = 7, width: int = 8) -> str:
    """Render a byte as a string of # and . from left_bit to left_bit +/- width."""
    bits = []
    for c in range(width):
        bitpos = left_bit - c if left_bit >= width - 1 else left_bit + c
        bitpos = max(0, min(7, bitpos))
        bits.append('#' if (byte_val >> bitpos) & 1 else '.')
    return ''.join(bits)

def dump_font(path: str, glyph_size: int = 8, glyph_count: int = 256,
              offset: int = 0, left_bit: int = 7, width: int = 8):
    """Dump font file contents."""
    with open(path, 'rb') as f:
        data = f.read()

    expected = offset + glyph_count * glyph_size
    if len(data) < expected:
        print(f"File too small: {len(data)}B, need {expected}B")
        return

    slice_data = data[offset:offset + glyph_count * glyph_size]
    rows = []

    for code in range(glyph_count):
        start = code * glyph_size
        glyph = slice_data[start:start + glyph_size]

        if all(b == 0 for b in glyph):
            continue

        glyph_rows = []
        for row in range(glyph_size):
            glyph_rows.append(parse_bits(glyph[row], left_bit, width))

        rows.append({
            'code': code,
            'hex': ' '.join(f'{b:02x}' for b in glyph),
            'rows': glyph_rows,
        })

    return rows

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Dump font .bin files')
    parser.add_argument('path', help='Path to .bin font file')
    parser.add_argument('--glyph-size', type=int, default=8, help='Bytes per glyph')
    parser.add_argument('--glyph-count', type=int, default=256, help='Number of glyphs')
    parser.add_argument('--offset', type=int, default=0, help='File offset')
    parser.add_argument('--left-bit', type=int, default=7,
                        help='Bit position of leftmost pixel (7=MSB, 0=LSB)')
    parser.add_argument('--width', type=int, default=8, help='Glyph width in pixels')
    parser.add_argument('--codes', type=str, default='',
                        help='Comma-separated glyph codes to show (default: all non-empty)')
    parser.add_argument('--json', action='store_true', help='Output as JSON')

    args = parser.parse_args()

    result = dump_font(args.path, args.glyph_size, args.glyph_count,
                       args.offset, args.left_bit, args.width)

    if args.codes:
        codes = [int(c.strip()) for c in args.codes.split(',') if c.strip()]
        result = [r for r in result if r['code'] in codes]

    if args.json:
        print(json.dumps(result, indent=2))
        return

    for g in result:
        print(f"Glyph {g['code']:3d}  [{g['hex']}]")
        for r in g['rows']:
            print(f"       {r}")
        print()

if __name__ == '__main__':
    main()
