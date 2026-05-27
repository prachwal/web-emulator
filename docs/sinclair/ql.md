# Sinclair QL

Zgodność: DEFv1

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | Motorola 68008 @ 7.5 MHz |
| RAM | 128 KB |
| OS | QDOS (multitasking) |
| Rozdzielczość | 512 × 256 (Mode 4, 4 kolory) lub 256 × 256 (Mode 8, 8 kolorów) |
| Tekst | 64 × 24 (Mode 4) lub 32 × 24 (Mode 8) |
| Font | 8 × 8 (256 glyphów) |
| Storage | 2 × Microdrive (magnetofon taśmowy) |

## Paleta

| Index | Mode 4 (4c) | Mode 8 (8c) |
|---|---|---|
| 0 | czarny | czarny |
| 1 | niebieski | niebieski |
| 2 | czerwony | czerwony |
| 3 | żółty | magenta |
| 4 | — | zielony |
| 5 | — | cyjan |
| 6 | — | żółty |
| 7 | — | biały |

## Co już mamy

- [x] Preset `ql-mode4-64x24` (Mode 4, 512×192, 4 kolory, PAR 2/3)
- [x] Preset `ql-mode8-32x24` (Mode 8, 256×192, 8 kolorów, PAR 1)
- [x] Font Kaypro 4/84 8×8 (zastępczy)
- [x] Demo z BASIC listingiem

## Czego brakuje

- [ ] Oryginalny font QL (unikalny 8×8)
- [ ] Obsługa QDOS
- [ ] Mode 4 w 512×256 (pełna wysokość)

## Źródła

- Q-emulator: <https://github.com/madrat/q-emulator>
- Sinclair QL Wikipedia: <https://en.wikipedia.org/wiki/Sinclair_QL>
- uQLx emulator: <https://github.com/SinclairQL/uQLx>
