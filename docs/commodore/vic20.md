# Commodore VIC-20 — video (VIC chip)

Zgodność: DEFv1

## Chip graficzny: MOS VIC (6560/6561)

| Właściwość | Wartość |
|---|---|
| CPU | MOS 6502 @ 1.1 MHz (NTSC) / 1.0 MHz (PAL) |
| RAM | 5 KB (rozszerzalne do 32+ KB) |
| Video | MOS VIC 6560 (NTSC) / 6561 (PAL) |
| Tryb tekstowy | 22 × 23 znaki (oryginalnie 20 × 23 na NTSC) |
| Rozdzielczość bitmap | 176 × 184 (PAL) |
| Kolory | 16 |
| Sprite'y | Brak (VIC-20 nie ma sprite'ów, w przeciwieństwie do C64) |
| Memory | 4 KB VRAM + 512 B color RAM |

## Tryby

### Standard Character Mode
- 22 × 23 znaków (tylko PAL, NTSC: 20 × 23 z węższym oknem)
- Font 8 × 8 (w ROM, 2 zestawy po 256 znaków)
- 16 kolorów (ale z ograniczeniami per-znak)

### Multicolor Character Mode
- 22 × 23, każdy znak 4 × 8 w 3+1 kolorach
- Dodatkowe 3 kolory na znak

### Standard Bitmap Mode
- 176 × 184 (PAL), ale dostęp do pamięci ograniczony przez architekturę VIC
- 1 bit/piksel
- 2 kolory na blok 8 × 8

### Paleta VIC-20

| Indeks | Kolor |
|---|---|
| 0 | Black |
| 1 | White |
| 2 | Red |
| 3 | Cyan |
| 4 | Purple |
| 5 | Green |
| 6 | Blue |
| 7 | Yellow |
| 8 | Orange |
| 9 | Light Orange |
| 10 | Pink |
| 11 | Light Cyan |
| 12 | Light Purple |
| 13 | Light Green |
| 14 | Light Blue |
| 15 | Light Yellow |

## Cechy specjalne

- **Brak sprite'ów** — w przeciwieństwie do C64, VIC-20 nie ma sprzętowych sprite'ów.
- **Ograniczona rozdzielczość** — tylko 22 kolumny × 23 wiersze, co daje wąski ekran.
- **Współdzielona pamięć** — VIC i CPU współdzielą tę samą pamięć RAM (nie ma osobnej VRAM jak w C64).
- **Pamięć kolorów** — 512 bajtów w $9600–$97FF, 4 bity na znak.

## Co już mamy

- [x] Preset `vic20-text-22x23` (tryb tekstowy 22×23)
- [x] Preset `vic20-176x184` (tryb bitmapowy 176×184, `Bitmap1BppDecoder`)
- [x] Font VIC-20 (2 zestawy, 512 glifów)
- [x] Mapper PETSCII
- [x] Paleta VIC-20 16 kolorów
- [x] Demo VIC-20 pokazuje pełną paletę 16 kolorów, per-znak Color RAM (fg przez `AttributeTextScreen`), 176×184 bitmap
- [x] Preset `vic20-multi-176x184` — tryb Multicolor 176×184

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Ekran startowy (REAL)

```
 **** VIC-20 BASIC ****
  3583 BYTES FREE

READY.
```

Biały tekst na czarnym tle w rozdzielczości 22×23 znaków.

## Źródła plików i dokumentacji

### ROM / font
- **VICE** — Versatile Commodore Emulator (open source, GPL): `vice-emu.sourceforge.net`
- Font `vic20.bin` to standardowy VIC-20 CHARGEN ROM (4096B)
- Repozytorium: <https://github.com/VICE-Team/svn-mirror>

### Dokumentacja techniczna
- VIC-20 Programmer's Reference Guide
- Denial VIC-20 Forum: <https://sleepingelephant.com/denial>

## Czego brakuje

- [ ] **Color RAM (nybble)** — wsparcie przez `AttributeTextScreen` per-cell fg już działa; do pełnej zgodności brak osobnego dekodera z `colorModel: 'vic20'`.
