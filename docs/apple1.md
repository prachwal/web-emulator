# Apple 1 — video

Zgodność: DEFv1

## Standard

| Właściwość | Wartość |
|---|---|
| CPU | MOS 6502 @ 1 MHz |
| RAM | 4 KB (rozszerzalne do 64 KB) |
| Video | Dyskretna logika TTL (brak dedykowanego chipa) |
| Wyjście | Composite video (NTSC) |
| Tryb | Tylko tekstowy |
| Znaki | 40 × 24 wiersze |
| Font | 8 × 8, 128 znaków (ASCII + symbole) |
| Znaki na zestaw | 128 (górne 128 to lustrzane odbicie) |

## Konstrukcja video

Video w Apple 1 jest zrealizowane na około 30 układach TTL (bramki, liczniki, rejestry), które generują sygnał composite video bezpośrednio:
- 40 znaków × 24 linie = 960 znaków na ekranie
- 40 × 8 = 320 pikseli w poziomie (z czego część to marginesy)
- 24 × 8 = 192 piksele w pionie
- Każdy znak to 8 × 8 pikseli, 1 bit/piksel

### Organizacja pamięci ekranu
- $0000–$03E7 (dolne 1 KB RAM): 40 kolumn × 24 wiersze = 960 bajtów znaków
- Każdy bajt to kod znaku (7 bitów, MSB = 0 dla normalnych, 1 dla odwróconych)

### Font
- 128 znaków w EPROM 256×8 (organizacja 32×8)
- Zawiera wielkie litery, cyfry, znaki interpunkcyjne i symbole
- Górna połowa (kody 64–127) to lustrzane odbicie dolnej połowy (lub puste)
- Bit order: **LSB-first** (bit 0 = lewy piksel, bit 7 = prawy)

### Odwrócone znaki
- MSB kodu znaku = 1 → odwrócone video (white na black → black na white)
- Realizowane sprzętowo przez XOR z sygnałem wideo

## Co już mamy

- [x] Preset `apple1-text-40x24` (tryb tekstowy 40×24)
- [x] Font Apple 1 (apple1.vid, 128 glifów)
- [x] Bit order LSB-first
- [x] Paleta zielonego monochromatycznego
- [x] **Odwrócone znaki (MSB=1)** — opcja `invertMsb` w `TextRenderOptions`. Gdy `charCode ≥ 128`, czyszczony jest MSB i zamieniane fg↔bg. Demo Apple 1 pokazuje odwrócony pasek tytułowy.
- [x] Test: `invertMsb swaps fg/bg when charCode >= 128` w `TextModeRenderer.test.ts`

## Czego brakuje

- [ ] **Górna połowa fontu (kody 64–127)** — w rzeczywistym Apple 1 górne 64 znaki są puste lub lustrzane. Wymaga weryfikacji apple1.vid.
