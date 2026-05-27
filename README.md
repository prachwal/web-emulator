# CRT Web Emulator

Vite + Preact (TSX) + TypeScript CRT web emulator. Renders retro computer video modes (text & bitmap) via WebGL2 with CRT effects.

## Quick start

```sh
npm install
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm test         # vitest run (84+ tests)
```

## Architecture

```
src/
  app/            — Preact UI (AppShell, EmulatorViewport, SettingsPanel)
  core/           — EmulatorRuntime, types, profiles
  video/
    presets/      — Per-machine presets (text & bitmap modes)
    fonts/        — Font loading, font presets, registry
    modes/        — Video mode decoders (text, bitmap, tilemap, etc.)
    renderers/    — WebGL2 (primary), Canvas2D (fallback)
    text/         — Text rendering, AttributeTextScreen, CharMapper, demos
    Palette.ts    — Color palettes, paletteToMonochrome
    BitmapFont.ts — Font glyph data and loading
  input/          — Keyboard controller
```

## Adding a machine

1. Add font `.bin` to `public/fonts/<machine>/`
2. Create `src/video/fonts/fontPresets.ts` entry
3. Create `src/video/presets/<machine>.ts` with `T()` / `G()` presets
4. Register in `src/video/presets/index.ts`
5. Create `src/video/text/demos/<machine>.ts` with demo scene
6. Register in `src/video/text/DemoTextScene.ts`
7. Create `docs/<brand>/<machine>.md`
8. Add monitor mapping in `src/video/monitors/index.ts`

Each preset defines: cols, rows, char cell size, framebuffer size, pixel aspect ratio, font, palette, margins, colors.

## Pixel Aspect Ratio

`pixelAspectRatio` in the preset makes the displayed image match the original monitor's 4:3 proportions:

```
PAR = (4/3) / (framebufferWidth / framebufferHeight)
```

- C64 320×200: PAR = 5/6 ≈ 0.833
- ZX Spectrum 256×192: PAR = 1 (square pixels)
- CPC 160×200: PAR = 5/3 ≈ 1.667

## Fonts

- `.bin` files in `public/fonts/<machine>/`
- Font preset in `fontPresets.ts` with: `url`, `glyphCount`, `charWidth/Height`, `bytesPerGlyph`, `xBits`, `mapperId`
- `mapperId`: `'ascii'`, `'petscii'`, `'petscii-shifted'`
- `xBits` controls bit-to-pixel mapping (MSB-first vs LSB-first)

## Preset system

Central in `src/video/presets/`. Three-level selection in UI: Machine → Text|Bitmap → Variant.

```
T('id', 'machineId', 'name', cols, rows, cw, ch, fw, fh, par, fontFile, fontId, total, geom, margins, fg, bg, screen, bezel, label, palette)
G('id', 'machineId', 'name', 'label', ...same..., palette, graphicsRenderer, videoMode)
```

## Status

- **22 machines** implemented with text and bitmap presets
- **WebGL2 renderer** with CRT curvature, scanlines, mask, vignette
- **Canvas2D fallback** for debug/compatibility
- **84 unit tests**, 14 test files
- **Go/WASM bridge**: work in progress

## Commands

```sh
npm run lint      # tsc --noEmit
npm run test:watch  # vitest watch
```
