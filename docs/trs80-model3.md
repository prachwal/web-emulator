# TRS-80 Model III — video

Zgodność: DEFv1

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
- [x] Preset `trs80-text-32x16` (tryb tekstowy 32×16, podwójna szerokość)
- [x] Font TRS-80 Model III (256 glifów, 8×8)
- [x] CellHeight = 12 dla lepszego wypełnienia pionowego
- [x] Paleta monochromatyczna

## Uwaga o descendentach

Glify descendentów (g, j, p, q, y) w foncie TRS-80 Model III mieszczą się w 8×8 pikselach — ogon descendentu znajduje się w dolnych wierszach glifu (rows 6-7). CellHeight=12 dodaje odstęp pod glifem, ale descendent jest już w glifie. Dodatkowe przesunięcie nie jest potrzebne.

## Źródła plików i dokumentacji

### ROM / font
- **xtrs** — TRS-80 emulator (open source): `http://www.tim-mann.org/xtrs.html`
- Fonty `m1-chargen.bin` i `m3-chargen.bin` pochodzą z TRS-80 ROM-ów
- Repozytorium: <https://github.com/Tim-Mann/xtrs>

### Dokumentacja techniczna
- TRS-80 Technical Reference Manual
- Radio Shack Model III Service Manual

## Czego brakuje

- [x] Semi-graphics 128×48 — preset `trs80-semi-128x48`, `SemiGraphicsDecoder` (2×3 bloki z kodów znaków)
