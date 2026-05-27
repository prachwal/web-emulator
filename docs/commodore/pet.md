# Commodore PET — video

Zgodność: DEFv1

## Standard

| Właściwość | Wartość |
|---|---|
| CPU | MOS 6502 |
| RAM | 4–96 KB (zależnie od modelu) |
| Video | MOS 6545 CRTC (kompatybilny z Motorola 6845) |
| Monitor | Wbudowany monochromatyczny (zielony lub biały) |
| Znaki | 40 × 25 (PET 2001) lub 80 × 25 (PET 4032) |
| Font | PETSCII, 8 × 8, w ROM |
| Grafika | Tylko znaki półgraficzne (PETSCII graphic characters) |

## Tryby

PET nie ma sprzętowego trybu bitmapowego. Grafika jest wyłącznie znakowa:
- Znaki PETSCII zawierają zestaw graficznych (głównie linie, klocki, elementy do rysowania)
- Przez odpowiednie ustawienie znaków w pamięci ekranu można uzyskać pseudo-grafikę

### Różnice modeli

| Model | Kolumny | Wiersze | Font | Pamięć video |
|---|---|---|---|---|
| PET 2001 | 40 | 25 | 8×8, 256 znaków | 1 KB |
| PET 4032 | 80 | 25 | 8×8, 256 znaków | 2 KB |

### Paleta

PET jest monochromatyczny. Kolor jest emulowany:
- Zielony tekst na czarnym tle (najbardziej autentyczne)
- Można emulować biały fosfor (alternatywny monitor)

## Co już mamy

- [x] Preset `pet-text-40x25` (tryb tekstowy 40×25, PET 2001)
- [x] Preset `pet-text-80x25` (tryb tekstowy 80×25, PET 4032, 640×200)
- [x] Font PET 2001 (256 glifów)
- [x] Font PET 4032 (512 glifów)
- [x] Mapper PETSCII
- [x] Paleta PET (zielony tekst)
- [x] Demo PET dostosowuje tytuł i informacje do modelu (40/80 kolumn)

### Monitor

Zobacz: [Dostępne monitory](monitors.md)

## Ekran startowy (REAL)

```
   *** COMMODORE PET ***
    8K RAM SYSTEM

READY.
```

Biały tekst na czarnym tle. PET 2001 wyświetla 40×25 znaków.

## Źródła plików i dokumentacji

### ROM / font
- **VICE** — Versatile Commodore Emulator (open source, GPL): `vice-emu.sourceforge.net`
- Fonty `pet-2001.bin` i `pet-4032.bin` pochodzą z PET ROM-ów
- Repozytorium: <https://github.com/VICE-Team/svn-mirror>

### Dokumentacja techniczna
- PET-CBM Wiki: <https://www.c64-wiki.com>

## Czego brakuje

- [x] **Znaki półgraficzne w demo** — demo PET pokazuje znaki graficzne PETSCII (linie, klocki)
- [ ] **Przełączanie zestawów znaków** — PET ma dwa zestawy: uppercase/graphic i lowercase/uppercase.
