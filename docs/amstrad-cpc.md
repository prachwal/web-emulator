# Amstrad CPC — Colour Personal Computer

Zgodność: DEFv1

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

27 kolorów z 3-poziomowego RGB (0, 128, 255 dla każdej składowej):

| # | R | G | B | Kolor | # | R | G | B | Kolor |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | czarny | 14 | 128 | 128 | 255 | jasnoniebieski |
| 1 | 0 | 0 | 128 | granatowy | 15 | 128 | 255 | 0 | żółtozielony |
| 2 | 0 | 0 | 255 | niebieski | 16 | 128 | 255 | 128 | jasnozielony |
| 3 | 0 | 128 | 0 | ciemnozielony | 17 | 128 | 255 | 255 | jasnocyjan |
| 4 | 0 | 128 | 128 | ciemnocyjan | 18 | 255 | 0 | 0 | czerwony |
| 5 | 0 | 128 | 255 | błękitny | 19 | 255 | 0 | 128 | różowy |
| 6 | 0 | 255 | 0 | zielony | 20 | 255 | 0 | 255 | magenta |
| 7 | 0 | 255 | 128 | limonkowy | 21 | 255 | 128 | 0 | pomarańczowy |
| 8 | 0 | 255 | 255 | cyjan | 22 | 255 | 128 | 128 | łososiowy |
| 9 | 128 | 0 | 0 | ciemnoczerwony | 23 | 255 | 128 | 255 | jasny magenta |
| 10 | 128 | 0 | 128 | fioletowy | 24 | 255 | 255 | 0 | żółty |
| 11 | 128 | 0 | 255 | fiolet | 25 | 255 | 255 | 128 | jasnożółty |
| 12 | 128 | 128 | 0 | oliwkowy | 26 | 255 | 255 | 255 | biały |
| 13 | 128 | 128 | 128 | szary | | | | | |

Palety emulowane:

| Tryb | Kolory | Paleta |
|---|---|---|
| Mode 0 | 16 z 27 | Indeksy 0–15 (R=0 lub R=128, pierwsze 16 kolorów) |
| Mode 1 | 4 z 27 | Czarny, niebieski, czerwony, biały |
| Mode 2 | 2 z 27 | Czarny, zielony |

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
- [x] Preset `cpc464-bmp-160x200` (bitmapa 160×200, 16 kolorów)
- [x] Preset `cpc464-bmp-320x200` (bitmapa 320×200, 4 kolory)
- [x] Preset `cpc464-bmp-640x200` (bitmapa 640×200, 2 kolory)
- [x] Font CPC 8×8 z ROM-u `cpc464.rom` (offset 0x3800, 256 glyphów)
- [x] Paleta 27 kolorów RGB (3-bit), mapowanie 27→16, 27→4, 27→2

## Źródła plików i dokumentacji

### ROM / font
- **Caprice32** — emulator CPC z otwartym kodem (GPLv2): `ColinPitrat/caprice32` na GitHub
  - ROM `cpc464.rom` / `cpc664.rom` / `cpc6128.rom` w katalogu `rom/`
  - Chargen wyekstrahowany z offsetu `0x3800` (256 glifów × 8 bajtów = 2048 B)
  - Repozytorium: <https://github.com/ColinPitrat/caprice32>

### Inne emulatory CPC
  - **JavaCPC** (Java): <https://github.com/pedgarcia/javacpc-src>
  - **xcpc** (C, POSIX): <https://github.com/burzumishi/xcpc>
  - **izkaypro** (Rust, terminal): <https://github.com/ivanizag/izkaypro>

### Dokumentacja techniczna
  - CPCWiki: <https://www.cpcwiki.eu/>
  - Bread80 — analiza gate array: <https://bread80.com/2021/06/03/understanding-the-amstrad-cpc-video-ram-and-gate-array-subsystem/>
  - Chris Fenton — Kaypro/CPC: <https://www.chrisfenton.com/exploring-kaypro-video-performance/>

## Czego brakuje

- [ ] **Prawdziwy dekoder trybów video** — dekodowanie VRAM na piksele (gate array)
- [ ] **Obsługa .dsk** — obrazy dyskietek 3"
- [ ] **Paleta definiowalna przez użytkownika** — wybór dowolnych 4/16 z 27
