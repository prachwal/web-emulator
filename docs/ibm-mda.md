# IBM MDA — Monochrome Display Adapter

## Standard

| Właściwość | Wartość |
|---|---|
| Chip | Motorola 6845 |
| Video RAM | 4 KB |
| Rozdzielczość tekstowa | 80 × 25 |
| Font | 9 × 14 (9-pixelowy znak w 14-pikselowej komórce) |
| Rozdzielczość efektywna | 720 × 350 |
| Kolory | Monochromatyczny (zielony lub biały) |
| Łącze | DE-9 TTL (mono) |
| Grafika | **Brak** — tylko tryb tekstowy |

## Atrybut tekstowy (1 bajt na znak)

```
Bit:  7     6     5   4   3     2   1   0
      BLINK BG            FG
```

- FG (bity 0–3): kolor znaku
- BG (bity 4–6): kolor tła  
- BLINK (bit 7): migotanie

W MDA fizycznie dostępne są tylko: białe, jasnobiałe, podkreślenie, czarne (niewidoczne).
Emulacyjnie można użyć zielonej skali.

## Cechy specjalne

- **9×14 font** — znaki mają 9 pikseli szerokości, ale ostatnia kolumna jest pusta (w rzeczywistości dodaje spacing). Emulacyjnie 8×14 jest wystarczające.
- **Brak trybu graficznego** — Hercules Graphics Card (HGC) dodał 720×348 monochrome bitmap, ale sam MDA go nie ma.
- **Podkreślenie** — znaki mogą mieć atrybut underline, realizowany sprzętowo w czcionce.

## Co już mamy

- [x] Preset `mda-text-80x25` (tryb tekstowy 80×25)
- [x] Font MDA 8×14 (mda-8x14.bin)
- [x] Paleta monochromatyczna (zielony)
- [x] Blink attribute — `colorModel:'mda'` w `TextModeDecoder` (bit 7 = blink)
- [x] Underline attribute — gdy `fgIdx === 1`, dolne 2 wiersze komórki rysowane jako linia

## Co już mamy — HGC

- [x] Preset `mda-herc-720x348` (HGC bitmap 720×348, monochromatyczny zielony)

## Czego brakuje

- [ ] **Tryb HGC** (Hercules, 720×348 bitmap) — brak dedykowanego dekodera (obraz z pliku JPEG).
