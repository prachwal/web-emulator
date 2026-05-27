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
| Font | Kaypro 4/84 8×8 (zastępczy, brak czystego chargenu w ROM-ie Osborne) |

## Co już mamy

- [x] Preset `osborne-text-52x24`
- [x] Font — Kaypro 4/84 8×8 (zastępczy, oryginalny OCC1_char.BIN nie jest czystym chargenem)
- [x] Demo z listingiem BASIC i informacjami o maszynie

## Czego brakuje

- [ ] Oryginalny font ROM — OCC1_char.BIN i os1vid80.rom wymagają dalszej analizy
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
