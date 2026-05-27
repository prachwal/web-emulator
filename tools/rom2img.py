#!/usr/bin/env python3
"""Convert ROM dumps to 256xN bitmaps to visually locate character generator data.

Each row of the output image represents one byte of the ROM as 8 black/white pixels.
A full 256-char font at 8x8 would appear as a 256x8 block (2048 bytes).
"""

import sys, os, math
from PIL import Image

def rom_to_preview(rom_path: str, out_path: str, width: int = 256) -> None:
    data = open(rom_path, 'rb').read()
    height = math.ceil(len(data) / width)
    img = Image.new('1', (width, height))
    pix = img.load()

    for i, byte in enumerate(data):
        x = i % width
        y = i // width
        for b in range(8):
            bit = (byte >> (7 - b)) & 1
            if y < height and x * 8 + b < width:
                # Map horizontally: each byte becomes 8 pixels
                pass
        # Each byte as a vertical 8-pixel column
        for b in range(8):
            bit = (byte >> (7 - b)) & 1
            px = x
            py = y * 8 + b
            if py < img.height and px < img.width:
                pix[px, py] = 0 if bit else 1

    # Also generate a "wide" view where bytes are horizontal 8-bit strips
    wide = Image.new('1', (width * 8, height))
    wpix = wide.load()
    for i, byte in enumerate(data):
        x = i % width
        y = i // width
        for b in range(8):
            bit = (byte >> (7 - b)) & 1
            px = x * 8 + b
            py = y
            if py < wide.height and px < wide.width:
                wpix[px, py] = 0 if bit else 1

    base = os.path.splitext(out_path)[0]
    img.save(f"{base}_compact.png")
    wide.save(f"{base}.png")
    print(f"  Saved {base}_compact.png ({width}x{height}) and {base}.png ({width*8}x{height})")

    # Scan for potential font glyph boundaries
    for glyph_size in [8, 10, 16]:
        count = len(data) // glyph_size
        for start in range(min(glyph_size, len(data) - 32 * glyph_size)):
            font_candidates = 0
            for c in range(32, min(127, count)):
                off = start + c * glyph_size
                if off + glyph_size > len(data):
                    continue
                glyph = data[off:off + glyph_size]
                non_zero = sum(1 for b in glyph if b != 0)
                if non_zero > 0 and non_zero < glyph_size:
                    font_candidates += 1
            if font_candidates >= 50:
                print(f"  -> Potential font: {glyph_size}B/glyph at byte offset {start} ({font_candidates}/95 chars)")
                break

def main():
    if len(sys.argv) < 2:
        print("Usage: rom2img.py <rom_file> [output_prefix]")
        sys.exit(1)

    rom_path = sys.argv[1]
    if not os.path.exists(rom_path):
        print(f"File not found: {rom_path}")
        sys.exit(1)

    out_prefix = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(rom_path)[0]
    rom_to_preview(rom_path, out_prefix)

if __name__ == '__main__':
    main()
