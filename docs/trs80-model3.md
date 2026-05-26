# TRS-80 Model III — video

## Standard

| Właściwość | Wartość |
|---|---|
| CPU | Z80 @ 2.03 MHz |
| RAM | 16–48 KB |
| Video | MC6845 CRTC (Motorola 6845) |
| Monitor | Wbudowany monochromatyczny (zielony lub biały) |

## Tryby

### Text mode (64 × 16)
- 64 kolumny × 16 wierszy
- Komórka 8 × 12 (glif 8 × 8 + 4 piksele odstępu pionowego na descendery)
- Efektywna rozdzielczość: 512 × 192
- Znaki mają descendery (g, j, p, q, y) które schodzą poniżej linii bazowej
- Łącznie 256 znaków w ROM

### Text mode (32 × 16)
- 32 kolumny × 16 wierszy (podwójna szerokość znaku)
- Ta sama wysokość komórki 12 pikseli

### Semi-graphics mode
- 128 × 48 (po włączeniu trybu semi-graphics)
- 2 kolory: czarny i biały/zielony
- Używane głównie do prostych wykresów i gier

### Paleta
- Monochromatyczny: biały/zielony na czarnym (lub na odwrót)
- Brak koloru sprzętowo

## Cechy specjalne

- **Descendery** — w przeciwieństwie do większości 8-bitowych komputerów, TRS-80 Model III obsługuje descendery. Glif ma 8 pikseli wysokości, ale komórka 12 pikseli, zostawiając 4 piksele na descendery (g, j, p, q, y).
- **Semi-graphics** — specjalny tryb gdzie znaki są interpretowane jako bloki 2×3 pikseli.
- **Podwójna szerokość** — w trybie 32×16 każdy znak ma efektywnie 2× normalną szerokość.

## Co już mamy

- [x] Preset `trs80-text-64x16` (tryb tekstowy 64×16)
- [x] Font TRS-80 Model III (256 glifów, 8×8)
- [x] CellHeight = 12 dla lepszego wypełnienia pionowego
- [x] Paleta monochromatyczna

## Czego brakuje

- [ ] **Descendery w renderowaniu** — obecnie glif rysuje się od góry komórki, ale descendery (dolne 4 piksele) nie są obsługiwane (glyphData ma tylko 8 bajtów, nie 12). Potrzebne: przesunięcie glifu w komórce (góra komórki = render od offsetY) i czarne tło w pustej dolnej części.
- [ ] **Semi-graphics mode** — brak.
- [ ] **Tryb 32×16** (podwójna szerokość) — brak presetu.
