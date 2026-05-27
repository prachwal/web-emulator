# Amstrad CPC — Colour Personal Computer

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | Z80A @ 4 MHz (efektywnie ~3.3 MHz) |
| CRTC | Motorola 6845 + custom Gate Array |
| Pixel clock | 16 MHz |
| VRAM | Współdzielona z CPU (dostęp przeplatany) |
| RAM | 64 KB (464/664) / 128 KB (6128) |
| ROM | 32 KB (firmware + BASIC 1.0/1.1) |
| Odświeżanie | 50 Hz (PAL) / 60 Hz (NTSC) |
| Dźwięk | AY-3-8912 (3 kanały) |
| Storage | Kaseta (464) / 3" floppy (664/6128) |
| Łącze video | RGB DIN 6-pin |

## Tryby video

| Tryb | Rozdzielczość | Kolory | Kolumn tekstu | B/piksel | PAR (4:3) |
|---|---|---|---|---|---|
| Mode 0 | 160×200 | **16** z 27 | 20 | 4 | **5/3** |
| Mode 1 | 320×200 | **4** z 27 | 40 | 2 | **5/6** |
| Mode 2 | 640×200 | **2** z 27 | 80 | 1 | **5/12** |

## Paleta

27 kolorów z 3-poziomowego RGB (off/half/full → 3×3×3 = 27):

| # | Kolor | R | G | B | # | Kolor | R | G | B |
|---|---|---|---|---|---|---|---|---|---|
| 0 | czarny | 0 | 0 | 0 | 9 | jasnoniebieski | 0 | 0 | 255 |
| 1 | niebieski | 0 | 0 | 128 | 10 | jasnozielony | 0 | 255 | 0 |
| 2 | zielony | 0 | 128 | 0 | 11 | jasnocyjan | 0 | 255 | 128 |
| 3 | cyjan | 0 | 128 | 128 | 12 | jasnoczerwony | 255 | 0 | 0 |
| 4 | czerwony | 128 | 0 | 0 | 13 | jasnofioletowy | 255 | 0 | 128 |
| 5 | fioletowy | 128 | 0 | 128 | 14 | żółty | 255 | 255 | 0 |
| 6 | brązowy | 128 | 128 | 0 | 15 | biały | 255 | 255 | 128 |
| 7 | jasnoszary | 128 | 128 | 128 | 16-26 | pozostałe odcienie | 128/255 | 128/255 | 128/255 |
| 8 | ciemnoszary | 0 | 0 | 128 | | | | | |

## Modele

| Model | Rok | RAM | Storage | System |
|---|---|---|---|---|
| CPC 464 | 1984 | 64 KB | Kaseta | BASIC 1.0 |
| CPC 664 | 1985 | 64 KB | 3" floppy | BASIC 1.1, CP/M 2.2 |
| CPC 6128 | 1985 | 128 KB | 3" floppy | BASIC 1.1, CP/M 2.2/3.1 |

## Co już mamy

- [x] Preset `cpc464-mode0-20x25` (Mode 0, 160×200, 16 kolorów)
- [x] Preset `cpc464-mode1-40x25` (Mode 1, 320×200, 4 kolory)
- [x] Preset `cpc464-mode2-80x25` (Mode 2, 640×200, 2 kolory)
- [x] Preset `cpc664-mode2-80x25` (CPC 664)
- [x] Preset `cpc6128-mode2-80x25` (CPC 6128)
- [x] Font CPC 8×8 z ROM-u `cpc464.rom` (offset 0x3800, 256 glyphów)
- [x] Paleta 27 kolorów RGB (3-bit)

## Czego brakuje

- [ ] **Tryb plus/sprite'y** — hardware sprites i 4096 kolorów (plus range)
- [ ] **Paleta 27 kolorów w palecie 16-kolorowej** — mapowanie 27→16 dla trybu 0
- [ ] **Prawdziwy dekoder trybów video** — dekodowanie VRAM na piksele (gate array)
- [ ] **Obsługa .dsk** — obrazy dyskietek 3"
