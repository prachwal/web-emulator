# ZX Spectrum — video modes

Zgodność: DEFv1

## Standard (jedyny oryginalny tryb)

| Właściwość | Wartość |
|---|---|
| Rozdzielczość | 256 × 192 px |
| Kolory | 15 (8 podstawowych + 8 bright, black bright = black) |
| Atrybuty | 32 × 24 komórek (8×8 px), 1 bajt na komórkę |
| Pixel data | 1 bit/piksel, 6144 B ($1800) |
| Attribute data | 768 B ($0300) |
| RAM video | 16 KB (w tym 6912 B widocznego ekranu) |
| Odświeżanie | ~50.08 Hz (PAL) |

## Atrybut — 1 bajt

```
Bit:  7     6     5   4   3     2   1   0
      FLASH BRIGHT PAPER        INK
```

- **INK** (bity 0–2): kolor pierwszego planu (piksele = 1)
- **PAPER** (bity 3–5): kolor tła (piksele = 0)
- **BRIGHT** (bit 6): 0 = kolory przygaszone (0–7), 1 = jasne (8–15)
- **FLASH** (bit 7): 0 = brak, 1 = migotanie INK↔PAPER co ~0.64 s

### Paleta 15 kolorów

| Indeks | Kolor | Jasny |
|---|---|---|
| 0 | black | black (brak zmiany) |
| 1 | blue | bright blue |
| 2 | red | bright red |
| 3 | magenta | bright magenta |
| 4 | green | bright green |
| 5 | cyan | bright cyan |
| 6 | yellow | bright yellow |
| 7 | white | bright white |

Kolejność GRB: numer koloru = bit G/R/B (a nie R/G/B).

## Co już mamy

- [x] 256 × 192 framebuffer z paletą 16 kolorów
- [x] `AttributeBitmapDecoder` — dekodowanie bitmapy z atrybutami INK/PAPER/BRIGHT/FLASH
- [x] Preset `zx-text-32x24` (tryb tekstowy 32×24)
- [x] Preset `zx-attr-256x192` (tryb bitmapowy z atrybutami)
- [x] Ładowanie fontu ZX Spectrum (128 glifów, 8×8)
- [x] Mapper ASCII (ZX Spectrum używa zwykłego ASCII dla tekstu)
- [x] **Atrybuty INK/PAPER/BRIGHT/FLASH w `TextModeDecoder`** — `colorModel:'zx'` dekoduje attr byte z BRIGHT (+8) i FLASH (swap fg↔bg co 16f)
- [x] Demo ZX pokazuje attr cells: INK na PAPER tle, BRIGHT kolory, FLASH

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Źródła plików i dokumentacji

### ROM / font
- **Fuse** — The Free Unix Spectrum Emulator (open source, GPL): `fuse-emulator.sourceforge.net`
- Font `zx-spectrum.bin` pochodzi z ROM-u ZX Spectrum 48K
- Repozytorium: <https://github.com/FrodeSolheim/fs-fuse>

### Dokumentacja techniczna
- ZX Spectrum ULA — Chris Smith: comprehensive hardware analysis
- World of Spectrum: <https://worldofspectrum.org>

## Czego brakuje

- [x] **Widoczny border** — kolor borderu (`#0000aa`) renderowany w tle za viewportem
- [ ] **Dithering CRT** — ZX Spectrum na CRT ma naturalne rozmycie kolorów. Obecnie nie ma symulacji PAL blur.
