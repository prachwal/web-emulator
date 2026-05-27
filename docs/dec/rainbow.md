# DEC Rainbow 100

Zgodność: DEFv1

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | Z80 + 8088 (dual CPU) |
| RAM | 64-256 KB |
| Rozdzielczość tekstowa | 80 × 24 |
| Komórka znaku | 8 × 10 |
| Rozdzielczość efektywna | 640 × 240 |
| Proporcje piksela | 2:3 (0.667) |
| Kolory | Monochromatyczny (zielony) |
| Ekran | 12" monochrome |
| System | CP/M + MS-DOS |
| Font | Oryginalny chargen DEC (8×8, z E98 firmware) |

## Co już mamy

- [x] Preset `rainbow-text-80x24`
- [x] Font — oryginalny chargen DEC z bitsavers E98_020E3.BIN (8×8, 2048B, pierwsze 8 z 16B/glyph)
- [x] Demo z listingiem BASIC i informacjami o maszynie

## Czego brakuje

- [x] Oryginalny font ROM — z bitsavers E98_020E3.BIN (8×8, 2048B)
- [x] Obsługa trybu 132×24 — preset `rainbow-text-132x24` (1056×192, PAR 8/33)
- [x] Pełna weryfikacja zestawu znaków — pierwsze 128 glyphów zawiera pełny ASCII; górne 128 to firmware/cursor (nie font)
- [x] Font przycięty do 128 glyphów (1024B)
- [ ] Wsparcie dla podwójnego CPU (Z80 + 8088)

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Źródła plików i dokumentacji

### ROM / font
- **bitsavers** — firmware DEC Rainbow: <https://bitsavers.org/pdf/dec/rainbow/firmware/>
  - `pc100a.zip` → `E98_020E3.BIN` (4096 B, chargen 8×8, pierwsze 8 z 16 B na glyph)
- Wikipedia: <https://en.wikipedia.org/wiki/Rainbow_100>
- Retroarchive: <http://www.retroarchive.org/maslin/disks/roms/index.html>
