# Commodore 64 — video modes (VIC-II)

Zgodność: DEFv1

## Chip graficzny: MOS VIC-II (6567/6569)

| Właściwość | Wartość |
|---|---|
| Rozdzielczość tekstowa | 40 × 25 (8×8 znaków) |
| Rozdzielczość bitmapowa | 320 × 200 (hi-res, 1bpp) lub 160 × 200 (multicolor, 2bpp) |
| Kolory | 16 |
| Color RAM | 1 KB nybble-addressable ($D800–$DBFF), 4 bitów na komórkę |
| Sprite'y | 8 sprzętowych, 24×21 px, 1 lub 3 kolorów + przezroczystość |
| Skanowanie | Raster interrupt — zmiana rejestrów w trakcie wyświetlania |

## Tryby VIC-II

### Standard Character Mode (tryb tekstowy)
- 40 × 25 znaków, każdy 8 × 8 pikseli
- Font w RAM (można przełączać zestawy znaków)
- Foreground: z Color RAM ($D800, 4 bity = jeden z 16 kolorów)
- Background: rejestry $D021–$D024 (4 kolory tła, per-cell)
- **Uwaga**: Color RAM używa tylko dolnych 4 bitów. Górne 4 bity bajtu w $D800 są ignorowane.

### Multicolor Character Mode
- 40 × 25, ale każdy znak ma efektywną rozdzielczość 4 × 8 pikseli w 4 kolorach
- Kolory pochodzą z Color RAM i rejestrów $D021–$D024

### Hi-Res Bitmap Mode
- 320 × 200, 1 bit/piksel
- Kolor piksela = 1 → Color RAM ($D800) dla danej komórki 8×8
- Kolor piksela = 0 → rejestr $D021 (ekranowe tło)

### Multicolor Bitmap Mode
- 160 × 200, 2 bity/piksel
- 4 kolory na komórkę 4 × 8: z Color RAM, $D021, $D022, $D023

## Paleta C64

| Indeks | Kolor | Przykład |
|---|---|---|
| 0 | Black | #000000 |
| 1 | White | #FFFFFF |
| 2 | Red | #880000 |
| 3 | Cyan | #A8F8F8 |
| 4 | Purple / Violet | #F8A800 |
| 5 | Green | #F8F8A8 |
| 6 | Blue | #00A800 |
| 7 | Yellow | #00F800 |
| 8 | Orange | #A800A8 |
| 9 | Brown | #F8A8F8 |
| 10 | Light Red | #A80000 |
| 11 | Dark Gray | #F8A8A8 |
| 12 | Medium Gray | #000088 |
| 13 | Light Green | #0000A8 |
| 14 | Light Blue | #008888 |
| 15 | Light Gray | #00A8A8 |

## Co już mamy

- [x] Preset `c64-text-40x25` (tryb tekstowy 40×25)
- [x] Preset `c64-320x200` (tryb bitmapowy 320×200)
- [x] Paleta C64 (16 kolorów)
- [x] Font C64 CHARGEN (2 zestawy, 512 glifów)
- [x] Mapper PETSCII
- [x] **Color RAM (4-bit nybble)** — `TextModeDecoder.colorModel: 'c64'` czyta `colorRam` jako 4-bit nybble (tylko foreground, background z `backgroundColorIndex`). Zarejestrowane w `VideoSystem`.
- [x] **Bitmap2BppDecoder** — dekoder dla `'bitmap-2bpp'` z obsługą Color RAM per komórkę 8×8 (kolor 1 z nybbla, kolor 2 z foregroundColorIndex). Zarejestrowany w `VideoSystem`.
- [x] Demo C64 pokazuje informacje o VIC-II, SID, Color RAM, sprite'ach, trybach 320×200/160×200
- [x] **Multicolor 160×200 4c** — preset `c64-160x200`, `C64MulticolorDecoder` (2bpp, 4 kolory na komórkę 4×8)

## Źródła plików i dokumentacji

### ROM / font
- **VICE** — Versatile Commodore Emulator (open source, GPL): `vice-emu.sourceforge.net`
- Font `chargen.bin` to standardowy C64 CHARGEN ROM (2 zestawy po 256 znaków, 4096B)
- Repozytorium: <https://github.com/VICE-Team/svn-mirror>

### Dokumentacja techniczna
- C64 Wiki: <https://www.c64-wiki.com>
- VIC-II Article: <https://vic-ii.world>

## Czego brakuje

- [ ] **Rejestry tła $D021–$D024** — w trybie bitmapowym kolor tła pochodzi z rejestru, nie z Color RAM.
- [ ] **Sprite'y** — brak (8 sprite'ów, 24×21).
- [ ] **Raster interrupt** — brak symulacji zmian w trakcie skanowania.
