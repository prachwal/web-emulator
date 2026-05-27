# Epson PX-8 Geneva

Zgodność: DEFv1

## Specyfikacja video

| Właściwość | Wartość |
|---|---|
| CPU | Z80 @ 3.68 MHz |
| RAM | 64 KB |
| Rozdzielczość tekstowa | 80 × 8 |
| Komórka znaku | 8 × 8 |
| Rozdzielczość efektywna | 640 × 64 |
| Proporcje piksela | 10:3 (3.333) |
| Kolory | Monochromatyczny (LCD) |
| Ekran | 8-line LCD (480 × 64 native) |
| System | CP/M 2.2 |
| Font | Oryginalny chargen PX-8/HC-80 (2048B, 8×8) |

## Co już mamy

- [x] Preset `epson-px8-text-80x8`
- [x] Font — oryginalny chargen PX-8 (electrickery.nl font.zip FONT.ROM, 2048B)
- [x] Demo z listingiem BASIC i informacjami o maszynie

## Czego brakuje

- [ ] Wsparcie dla ROM-based software (WordStar, Calc, Portable BASIC)
- [ ] Obsługa LCD kontrastu

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Ekran startowy (REAL)

```
               EPSON PX-8
  Z80  64K  CP/M 2.2
  Built-in LCD 80x8

          A>
```

Monochromatyczny tekst na LCD. 80×8 znaków, ciekłokrystaliczny wyświetlacz, komputer kieszonkowy.

## Źródła plików i dokumentacji

- Wikipedia: <https://en.wikipedia.org/wiki/Epson_PX-8>
- Retroarchive: <http://www.retroarchive.org/maslin/disks/roms/index.html>
- SeaSoft PX-8 page: <https://www.seasip.info/Cpm/px8.html>
- Electrickery PX-8 ROMs & font: <https://electrickery.nl/comp/px8/roms/> → `font.zip` → `FONT.ROM` (oryginalny chargen HC-80/PX-8, 2048B)
