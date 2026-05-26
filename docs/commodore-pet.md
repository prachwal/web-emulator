# Commodore PET — video

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

- [x] Preset `pet-text-40x25` (tryb tekstowy 40×25)
- [x] Font PET 2001 (256 glifów)
- [x] Font PET 4032 (512 glifów)
- [x] Mapper PETSCII
- [x] Paleta PET (zielony tekst)

## Czego brakuje

- [ ] **PET 4032 80‑kolumnowy** — brak osobnego presetu dla PET 4032 w trybie tekstowym.
- [ ] **Znaki półgraficzne w demo** — demo PET powinno pokazywać znaki graficzne PETSCII (linie, klocki) do rysowania ramek i prostych kształtów.
- [ ] **Przełączanie zestawów znaków** — PET ma dwa zestawy: uppercase/graphic i lowercase/uppercase.
