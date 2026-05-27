# Definicja komputera — wymagane elementy

Wersja: **DEFv1**

Każdy nowy komputer w emulatorze musi spełniać poniższą specyfikację. Dokumentacja maszyny (`docs/<machine>.md`) zawiera znacznik `Zgodność: DEFv1` w nagłówku potwierdzający zgodność.

---

## 1. Pliki do utworzenia

| # | Plik | Opis |
|---|---|---|
| 1 | `src/video/presets/<machine>.ts` | Definicje presetów (tryby tekstowe i bitmapowe) |
| 2 | `src/video/text/demos/<machine>.ts` | Demo (zawartość ekranu startowego) |
| 3 | `docs/<machine>.md` | Dokumentacja techniczna |
| 4 | `public/fonts/<machine>/` | Pliki fontów .bin (jeśli są) |

## 2. Rejestracja

| Miejsce | Co dodać |
|---|---|
| `src/video/presets/index.ts` | Import tablicy presetów + spread w `PRESETS[]` |
| `src/video/text/DemoTextScene.ts` | Import funkcji demo + wpis w `demoFns` |
| `src/video/fonts/fontPresets.ts` | Definicja font presetu (jeśli font spoza projektu) |
| `src/video/VideoSystem.ts` | Rejestracja dekodera (jeśli nowy typ dekodera) |
| `src/core/types.ts` | `VideoMode` union (jeśli nowy typ dekodera) |
| `src/app/AppShell.tsx` | Automatycznie — nowe `machineId` pojawi się w menu |
| `src/app/machineConfig.ts` | Wpis w `MACHINE_FEATURES` (max 4 badge'y) |

## 3. Preset (`T()` / `G()`) — wymagane pola

| Pole | Opis | Uwagi |
|---|---|---|
| `id` | Unikalny identyfikator presetu | `{machineId}-{tryb}-{cols}x{rows}` |
| `machineId` | Identyfikator modelu | Np. `cpc-464`, `cpc-664` |
| `machineName` | Nazwa wyświetlana | Np. `Amstrad CPC 464` |
| `type` | `'text'` lub `'bitmap'` | |
| `cols`, `rows` | Liczba kolumn i wierszy tekstu | |
| `charWidth`, `charHeight` | Wymiary znaku w pikselach | Np. `8, 8` lub `8, 16` |
| `framebufferWidth`, `framebufferHeight` | Rozdzielczość bufora | `cols * charWidth` × `rows * charHeight` |
| `pixelAspectRatio` | Proporcja piksela dla 4:3 | `(4/3) / (fw/fh)` |
| `fontFile` | Nazwa pliku fontu | Relatywna do `public/fonts/{machine}/` |
| `fontId` | Identyfikator font presetu | Z `src/video/fonts/fontPresets.ts` |
| `totalChars` | Liczba znaków w foncie | Zwykle `128` lub `256` |
| `font` | Geometria fontu | `f8(h, left)` lub obiekt z `glyphWidth/Height`, `cellWidth/Height`, `xBits`, `invertBits`, `leftBit` |
| `margins` | Marginesy CRT | `m(top, right, bottom, left)` |
| `fgColor`, `bgColor`, `screenBg` | Kolory | |
| `bezelColor`, `labelColor` | Kolory obudowy i etykiety | |
| `palette` | Paleta kolorów | 16 kolorów hex, dopasowana do trybu |
| `vmode` | Tryb video (opcjonalnie) | Dla bitmap: `'bitmap-1bpp'`, `'bitmap-2bpp'` itp. |
| `borderColor` | Kolor obramowania (opcjonalnie) | Domyślnie auto-jasniejsze od `screenBg` |

## 4. Demo (`src/video/text/demos/<machine>.ts`)

- Funkcja `create{Nazwa}Demo(cols, rows): AttributeTextScreen`
- Używa tylko kolorów z palety trybu (indeksy 0 i 1 dla trybów 2-kolorowych)
- Pokazuje nazwę modelu, specyfikację i przykładowy kod BASIC
- Zaimportowana i zarejestrowana w `DemoTextScene.ts`

## 5. Monitory

Każda maszyna może mieć jeden lub więcej monitorów zdefiniowanych w `src/video/monitors/index.ts`.

Wymagane:
- Minimum jeden monitor w `monitorsForMachine(machineId)` dla każdego `machineId`
- Monitor `id` w `MONITORS` z wypełnionymi polami: `type` (crt/lcd), `color` (mono/color), `phosphor`, `sizeInches`, `notes`
- Dla monitorów mono → `paletteToMonochrome` konwertuje paletę automatycznie
- Monitor wyświetlany w menu: Computer → Model → **Monitor** → Mode → Resolution

## 6. Dokumentacja (`docs/<machine>.md`)

Wymagane sekcje:
- **Nagłówek** — nazwa komputera
- **Specyfikacja video** — tabela z CRTC, CPU, RAM, pixel clock, rozdzielczością, kolorami
- **Tryby video** — tabela rozdzielczości, kolory, tryb tekstowy, PAR (4:3)
- **Paleta** — lista kolorów z wartościami RGB
- **Modele** (jeśli więcej niż jeden) — tabela z RAM, storage, systemem
- **Co już mamy** — checklista z [x]
- **Czego brakuje** — checklista z [ ]
- **Źródła plików i dokumentacji** — linki do ROM-ów, emulatorów, dokumentacji
- **Zgodność: DEFv1** — znacznik wersji specyfikacji

## 6. Walidacja

Przed commitem sprawdź:
- [ ] Wszystkie pliki z sekcji 1 istnieją
- [ ] Preset zarejestrowany w `index.ts`
- [ ] Demo zarejestrowane w `DemoTextScene.ts`
- [ ] Font preset istnieje (jeśli potrzeba)
- [ ] Wpis w `machineConfig.ts`
- [ ] `computer` auto-wywnioskowany z `machineName`
- [ ] PAR wyliczony poprawnie: `(4/3) / (fw/fh)`
- [ ] `npm test` przechodzi
- [ ] `npm run build` przechodzi
- [ ] Dokumentacja zawiera znacznik `Zgodność: DEFv1`
