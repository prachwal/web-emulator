# Morrow MD3 (Micro Decision)

Zgodność: DEFv1

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | Z80 @ 4 MHz |
| RAM | 64-256 KB |
| Rozdzielczość tekstowa | 80 × 24 |
| Komórka znaku | 8 × 12 |
| Rozdzielczość efektywna | 640 × 288 |
| Proporcje piksela | 3:5 (0.6) |
| Kolory | Monochromatyczny (zielony) |
| Ekran | Monitor zielony |
| System | CP/M 2.2 |
| Font | Kaypro 4/84 8×12 (zastępczy) |

## Co już mamy

- [x] Preset `morrow-text-80x24`
- [x] Font — Kaypro 4/84 (8×12, pierwsze 12 skanów znaku 8×16)
- [x] Demo z listingiem BASIC i informacjami o maszynie

## Czego brakuje

- [ ] Oryginalny font ROM `md3-31.rom` — obecnie używa zastępczego fontu Kaypro

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Ekran startowy (REAL)

```
           Morrow MD3
  Z80  64K  CP/M 2.2
  6" 26MB Hard Disk
  Micro-Pro WordStar  SuperCalc

        A>
```

Monochromatyczny zielony tekst na czarnym tle. 80×24 znaki, 8×12 komórka, wbudowany dysk twardy 26MB.

## Źródła plików i dokumentacji

- Wikipedia: <https://en.wikipedia.org/wiki/Morrow_Micro_Decision>
- bitsavers: <https://bitsavers.org/pdf/morrow/>
- Retroarchive: <http://www.retroarchive.org/maslin/disks/roms/index.html>
