# IBM CGA — Color Graphics Adapter

Zgodność: DEFv1

## Standard

| Właściwość | Wartość |
|---|---|
| Chip | Motorola 6845 |
| Video RAM | 16 KB |
| Synchronizacja | 15.7 kHz poziom, 59.9 Hz pion |
| Łącze | DE-9 (RGBI digital TTL) + RCA composite NTSC |

## Tryby tekstowe

| Tryb | Kolumny × wiersze | Font | Efektywna rozdz. |
|---|---|---|---|
| 40 × 25 (mode 0/1) | 40 × 25 | 8 × 8 | 320 × 200 |
| 80 × 25 (mode 2/3) | 80 × 25 | 8 × 8 | 640 × 200 |

Każda komórka znaku: 8 × 8 pikseli, atrybut bajt = [blink:1][bg:3][fg:4].

## Tryby graficzne

| Tryb | Rozdzielczość | BPP | Kolory | Paleta |
|---|---|---|---|---|
| 4 | 320 × 200 | 2 | 4 | 2 palety × 2 intensywności |
| 5 | 320 × 200 | 2 | 4 | Cyan/red/white (mono composite) |
| 6 | 640 × 200 | 1 | 2 | Black + 1 z 16 |
| Tweaked (160×100) | 160 × 100 | 4 | 16 | Pełna paleta RGBI |

### Palety 320×200 (mode 4)

| Pixel bits | Palette 0 (lo) | Palette 0 (hi) | Palette 1 (lo) | Palette 1 (hi) |
|---|---|---|---|---|
| 00 | Background | Background | Background | Background |
| 01 | Green (2) | Light Green (10) | Cyan (3) | Light Cyan (11) |
| 10 | Red (4) | Light Red (12) | Magenta (5) | Light Magenta (13) |
| 11 | Brown (6) | Yellow (14) | Light Gray (7) | White (15) |

### Pełna paleta 16 kolorów RGBI

| Index | Kolor | Hex |
|---|---|---|
| 0 | Black | #000000 |
| 1 | Blue | #0000AA |
| 2 | Green | #00AA00 |
| 3 | Cyan | #00AAAA |
| 4 | Red | #AA0000 |
| 5 | Magenta | #AA00AA |
| 6 | Brown (Dark Yellow) | #AA5500 |
| 7 | Light Gray | #AAAAAA |
| 8 | Dark Gray | #555555 |
| 9 | Light Blue | #5555FF |
| 10 | Light Green | #55FF55 |
| 11 | Light Cyan | #55FFFF |
| 12 | Light Red | #FF5555 |
| 13 | Light Magenta | #FF55FF |
| 14 | Yellow | #FFFF55 |
| 15 | White | #FFFFFF |

## Cechy specjalne

- **Snow** — w 80‑kolumnowym trybie tekstowym zapis do VRAM podczas skanowania powoduje zakłócenia (snow).
- **Composite artifact colors** — na monitorach kompozytowych NTSC wzorce pikseli w trybie 640×200 dają dodatkowe kolory (artifact colors), pozwalając na ~16 kolorów przy niższej rozdzielczości.
- **160×100 16c** — hack trybu tekstowego: zmniejszona wysokość znaku do 2 linii, użycie znaków blokowych (0xDD, 0xDE) dla 16 kolorów w 160×100.

## Co już mamy

- [x] Preset `cga-text-40x25` (tryb tekstowy 40×25)
- [x] Preset `cga-text-80x25` (tryb tekstowy 80×25)
- [x] Preset `cga-320x200` (tryb graficzny z `TilemapDecoder`)
- [x] Preset `cga-640x200` (tryb graficzny 640×200 2c, mode 6, używa `Bitmap1BppDecoder`)
- [x] Font CGA (thick i thin)
- [x] Paleta CGA 16 kolorów inline
- [x] Blink attribute — `colorModel:'cga'` w `TextModeDecoder` (bit 7 zamienia fg↔bg co 16 klatek)
- [x] **160×100 16c** — preset `cga-160x100`, `Cga160x100Decoder`, pokazuje tukan.jpg w 16 kolorach

## Czego brakuje

- [ ] **Palety CGA mode 4** — obecnie nie ma przełączania 4-kolorowych palet dla trybu 320×200.
- [ ] **Composite artifact colors** — symulacja kolorów artifact NTSC.
