# Kaypro — CP/M Portable Computer

## Standard

| Właściwość | Wartość |
|---|---|
| CPU | Z80A @ 2.5 MHz (Kaypro II) / 4 MHz (Kaypro 4/84) |
| RAM | 64 KB |
| Video RAM | 2 KB character RAM + 2 KB attribute RAM |
| Chip | SY6545A-1 CRTC |
| Pixel clock | 18 MHz |
| Rozdzielczość tekstowa | Kaypro II: 80 × 24; Kaypro 4/84: 80 × 25 |
| Font | Kaypro II: ROM 7 × 8 skalowany do komórki 7 × 16; Kaypro 4/84: 8 × 16 z ROM-u 81-235 |
| Rozdzielczość efektywna | Kaypro II: 560 × 384; Kaypro 4/84: 640 × 400 |
| Emulowane skalowanie | Square-pixel (PAR 1:1), bez ściskania fontu |
| Kolory | Monochromatyczny (zielony P1 fosfor) |
| Ekran | 9" CRT (wbudowany) |
| System | CP/M 2.2 / 3.0 |
| Grafika | 160 × 100, 3 kolory (przez nadużycie zestawu znaków) |
| Emulacja terminala | ADM-3A |

## Sprzętowe sterowanie znakami

Kaypro używa SY6545A-1 CRTC z oddzielną pamięcią znaków i atrybutów:

- **Character RAM**: 2048 bajtów (80 × 25 = 2000, 48 niewykorzystane)
- **Attribute RAM**: 2048 bajtów (równoległy do character RAM)
- **Font ROM**: Kaypro II: 2 KB 81-146A (górne 128 glyphów odwrócone bitowo); Kaypro 4/84: 4 KB 81-235

Kaypro II używa fontu ROM 7×8; ASCII jest w górnej połowie ROM-u (`code + 128`) i wymaga odwrócenia bitów. W emulatorze glif jest skalowany pionowo 2× do komórki 7×16, żeby tryb 80×24 miał czytelne proporcje CRT. Kaypro 4/84 używa wyższego fontu 8×16. Atrybuty pozwalają na odwrócenie wideo (inverse).

### Atrybut tekstowy

Kaypro używa 8-bitowego bajtu atrybutu:

```
Bit:  7     6     5     4     3     2     1     0
     INV   CURS   BG2   BG1   BG0   FG2   FG1   FG0
```

Gdzie INV = 1 odwraca kolory znaku (zamiana fg ↔ bg).

## Grafika "medium-resolution"

Tryb 160×100 z 3 kolorami (czarny, zielony, jaśniejszy zielony):
- Każda komórka znaku (8×16) dzielona na blok 2×4 pikseli
- Znaki 128-255 przechowują wzory bloków
- Atrybut INV pozwala na dostęp do 8. bitu

W praktyce bardzo wolne: ~300 pikseli/s przez BIOS, do ~25 fps przez bezpośredni dostęp do VRAM z asemblera.

## Modele

| Model | Rok | CPU | Dyski | Cechy szczególne |
|---|---|---|---|---|
| Kaypro II | 1982 | Z80A 2.5 MHz | 2× SS/DD 191 KB | Pierwszy model, 9" zielony CRT |
| Kaypro IV | 1983 | Z80A 2.5 MHz | 2× DS/DD 390 KB | WordStar w zestawie |
| Kaypro 10 | 1983 | Z80A 2.5 MHz | 1× DS/DD + 10 MB HDD | Pierwszy z twardym dyskiem |
| Kaypro 4/84 | 1984 | Z80A 4 MHz | 2× DS/DD half-height | 300 baud modem, grafika |
| Kaypro 2X | 1984 | Z80A 4 MHz | 2× DS/DD | Brak modemu, WordStar |
| Kaypro 1 | 1986 | Z80A 4 MHz | 2× DS/DD | Ostatni model CP/M |

## Co już mamy

- [x] Preset `kaypro2-text-80x24` (Kaypro II, tryb tekstowy 80×24)
- [x] Preset `kaypro4-text-80x25` (Kaypro 4/84, tryb tekstowy 80×25)
- [x] Font Kaypro II 7×8 z `kaypro2.u43` / 81-146A (offset 1024, inverted, scaleY 2×)
- [x] Font Kaypro 4/84 8×16 z `kaypro4.u9` / 81-235
- [x] Skalowanie square-pixel dla czytelnego fontu 8×16
- [x] Paleta monochromatyczna (zielona)
- [x] Tryb graficzny 160×100 (medium-resolution graphics)
- [x] Demo z BASIC listingiem i CP/M READY prompt
- [x] Specyfikacje w toolbar

## Czego brakuje

- [ ] **Obsługa ADM-3A escape sekwencji** — czyszczenie ekranu, pozycjonowanie kursora
- [ ] **Dwa zestawy znaków** (górny/dolny 256 glyphów) — Kaypro 4/84 ma 2 zestawy
- [ ] **Attribute RAM** (inverse video, cursor) — oddzielna pamięć atrybutów
