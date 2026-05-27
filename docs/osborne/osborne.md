# Osborne 1

Zgodność: DEFv1

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | Z80 @ 4 MHz |
| RAM | 64 KB |
| Rozdzielczość tekstowa | 52 × 24 |
| Komórka znaku | 8 × 8 |
| Rozdzielczość efektywna | 416 × 192 |
| Proporcje piksela | 1:1 |
| Kolory | Monochromatyczny (zielony) |
| Ekran | 5" monochrome CRT |
| System | CP/M 2.2 |
| Font | Oryginalny chargen Osborne 1 8×8 (2048B) |

## Co już mamy

- [x] Preset `osborne-text-52x24`
- [x] Font z oryginalnego chargen ROM-u (BrettHallen/Osborne_1 — `OCC1_char.BIN`, 2048B, 8×8)
- [x] Demo z listingiem BASIC i informacjami o maszynie

## Czego brakuje

- [ ] Oryginalny font ROM `os1vid80.rom` — obecnie używa zastępczego fontu Kaypro
- [ ] Obsługa trybu graficznego 52 × 24 × 128
- [ ] Emulacja terminala

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Źródła plików i dokumentacji

### ROM / font
- **BrettHallen/Osborne_1** — ROM-y i dokumentacja Osborne 1 na GitHub: <https://github.com/BrettHallen/Osborne_1>
- Chargen `OCC1_char.BIN` (2048B, 8×8, 256 glyphów) w katalogu `ROM/`
- Retroarchive: <http://www.retroarchive.org/maslin/disks/roms/index.html>
- Wikipedia: <https://en.wikipedia.org/wiki/Osborne_1>
- bitsavers: <https://bitsavers.org/pdf/osborne/>
