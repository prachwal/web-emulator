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
| Font | Kaypro 4/84 8×10 (zastępczy) |

## Co już mamy

- [x] Preset `rainbow-text-80x24`
- [x] Font — Kaypro 4/84 (8×10, pierwsze 10 skanów znaku 8×16)
- [x] Demo z listingiem BASIC i informacjami o maszynie

## Czego brakuje

- [ ] Oryginalny font ROM `rbw-char.rom` — obecnie używa zastępczego fontu Kaypro
- [ ] Obsługa trybu 132 × 24
- [ ] Wsparcie dla podwójnego CPU (Z80 + 8088)

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Źródła plików i dokumentacji

### ROM / font
- **bitsavers** — firmware DEC Rainbow: <https://bitsavers.org/pdf/dec/rainbow/firmware/>
  - `pc100a.zip` → `E98_020E3.BIN` (4096 B, chargen 8×8, pierwsze 8 z 16 B na glyph)
- Wikipedia: <https://en.wikipedia.org/wiki/Rainbow_100>
- Retroarchive: <http://www.retroarchive.org/maslin/disks/roms/index.html>
