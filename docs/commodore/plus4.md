# Commodore Plus/4

Zgodność: DEFv1

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | 7501 @ 1.77 MHz |
| RAM | 64 KB |
| Chip TED | 7360 (video, audio, I/O) |
| Rozdzielczość | 320 × 200 (standard), 160 × 200 (multicolor) |
| Tekst | 40 × 25 |
| Font | 8 × 8 (256 glyphów, PETSCII order) |
| Kolory | 128 (8 odcieni × 8 kolorów × 2 zestawy) |
| Storage | Datasette / 3.5" floppy (1541) |
| OS | BASIC 3.5 + built-in software |

## Paleta TED (128 kolorów)

Paleta TED 7360: 8 barw × 8 poziomów luminancji + macierz alternatywna (bit 7).
Indeksy 0-63: macierz standardowa, 64-127: macierz alternatywna.
Pełna paleta zdefiniowana w `presets/c16.ts`.

## Co już mamy

- [x] Preset `plus4-text-40x25` — tryb tekstowy 40×25 (320×200, PAR 5/6)
- [x] Preset `plus4-bmp-320x200` — tryb bitmapowy Hi-Res
- [x] Preset `plus4-multi-160x200` — tryb bitmapowy Multicolor
- [x] Font z oryginalnego chargen ROM-u (Zimmers c16.bin, 2048B)
- [x] PETSCII mapper
- [x] Demo z BASIC listingiem

## Czego brakuje

- [ ] Emulacja BASIC 3.5 / built-in software

## Ekran startowy (REAL)

```
   **** COMMODORE PLUS/4 ****
    64K RAM SYSTEM
     58877 BASIC BYTES FREE

READY.
```

Biały tekst na czarnym tle. 64K RAM, BASIC 3.5, ten sam chip TED co C16.

## Źródła

- Zimmers: <http://www.zimmers.net/anonftp/pub/cbm/firmware/characters/c16.bin>
- Wikipedia: <https://en.wikipedia.org/wiki/Commodore_Plus/4>
- VICE emulator: <https://vice-emu.sourceforge.io/>
