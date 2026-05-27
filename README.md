# CRT Web Emulator

Vite + Preact (TSX) + TypeScript CRT web emulator. Renders retro computer video modes (text & bitmap) via WebGL2 with CRT effects.

## Quick start

```sh
npm install
npm run dev         # Vite dev server (localhost:5173)
npm run build       # tsc -b && vite build
npm test            # vitest run (133+ tests)
npm run lint        # tsc --noEmit
npm run test:watch  # vitest watch
```

## Supported machines (20+)

### Sinclair
- ZX Spectrum 48K — 32×24 text, 256×192 attr bitmap, FLASH/BRIGHT
- ZX Spectrum 128K — 32×24 text, attr bitmap, 128K palette
- Sinclair QL — Mode 4 (64×24, 4c) / Mode 8 (32×24, 8c), original QL font

### Commodore
- C64 — 40×25 text, 320×200 bitmap, 160×200 multicolor, PETSCII, sprites
- C128 — VDC 80×25 (640×200/640×400 interlaced), VIC-II 40×25, original VDC font
- PET 2001/4032 — 40×25 / 80×25, PETSCII, dual charset
- VIC-20 — 22×23 text, 176×184 bitmap, multicolor, 4-bit color RAM
- C16 / Plus/4 — TED 40×25, 128-color palette, 3 video modes
- C64/C128/VIC-20/PET/C16/Plus4 — Shift Lock toggle (uppercase↔lowercase chars)

### IBM
- CGA — 40×25 / 80×25 text, 320×200 4c, 640×200 2c, 160×100 16c, tilemap
- MDA / Hercules — 80×25 monochrome, 9×14 cell, 720×348 HGC bitmap

### Amstrad
- CPC 464/664/6128 — Mode 0 (20×25 16c), Mode 1 (40×25 4c), Mode 2 (80×25 2c), gate array decoder

### CP/M
- Kaypro II / 4-84 — 80×24 / 80×25, 160×100 graphics, ADM-3A terminal
- Osborne 1 — 52×24, 104×48 semigraphics
- Otrona Attache — 80×24, amber phosphor
- Xerox 820-II — 80×24, original chargen ROM
- Morrow MD3 — 80×24, 8×12 cell
- DEC Rainbow 100 — 80×24 / 132×24, original DEC font
- Epson PX-8 — 80×8 LCD, original HC-80 chargen

### Others
- Apple 1 — 40×24, Woz monitor, LSB-first, invert MSB
- TRS-80 Model III — 64×16 / 32×16 text, 128×48 semigraphics

## Features

### Display modes
Each machine has **Text** and **Bitmap** variants with multiple resolutions. Switch between Text and Bitmap in the toolbar, then select the resolution variant.

### REAL / DEMO toggle
- **DEMO** — BASIC listing with machine info and color demonstrations
- **REAL** — Authentic startup screen (copyright messages, RAM info, READY prompt)

### Shift Lock (PETSCII machines)
Toggle between uppercase/graphics charset and lowercase/uppercase charset for Commodore machines (C64, C128, VIC-20, PET, C16, Plus/4).

### CRT effects (WebGL2)
- Curvature, scanlines, RGB mask, vignette
- Brightness/contrast/saturation adjustment
- Chromatic aberration, noise
- Interlace flicker simulation
- Preset display profiles: Clean Pixel, CRT Soft/Sharp, Green/Amber Phosphor, Composite Blur, RF Noise, Interlaced

### Debug overlay
Press **Debug** to show: FPS, renderer type (WebGL2/Canvas2D), source/viewport resolution, PAR, zoom, DPR, active font, machine name, text render time, dirty cells, framebuffer upload time.

### Font Inspector
Press **Font** to inspect binary font files:
- Upload `.bin`/`.rom`/`.vid` files
- Adjust: char width/height, cell size, glyph count, offset, bytes per glyph, bit order (MSB/LSB), invert
- 16×16 glyph grid with selection, 8× zoomed preview
- **Export** as JSON or TypeScript FontPreset config (copy to clipboard)

### Reference Image Comparison
Press **Cal** to compare emulator output with a reference screenshot:
- Upload PNG/JPG
- View modes: Current, Reference, Overlay (adjustable opacity), Side-by-side, Difference
- Scale and offset controls
- Per-pixel difference metric

### PNG Export
Press **Save** to download the current canvas as PNG. Filename includes machine ID and preset.

### Render metrics
Debug overlay shows: text render time (smoothed), dirty cells count, full rerender count, framebuffer upload time, render time, RAF delta.

### Video pipeline
Formal pipeline stages: source → palette → border → signal → CRT → output. Each stage can be independently enabled/disabled.

### Dirty cell rendering (text mode)
`DirtyTextBuffer` tracks changed character cells between frames and only re-renders modified cells. Full rerender triggered on font/mapper change.

### Keyboard mapper
`BrowserKeyboardMapper` abstraction layer mapping browser keyboard events to machine key codes. Ready for future WASM core integration.

### Demo script DSL
JSON format for defining text demo scenes without TypeScript:

```json
{
  "machine": "zx",
  "mode": "text",
  "cols": 32, "rows": 24,
  "lines": [
    { "text": "READY", "y": 0, "fg": 7, "bg": 0 }
  ]
}
```

### View config export/import
Save and restore full configuration as JSON: machine, preset, monitor, display profile, PAR multiplier, zoom, screen mode, shift lock, border visibility.

## Architecture

```
src/
  app/              — AppShell, EmulatorViewport, SettingsPanel, DebugOverlay,
  |                   DisplaySettings, machineConfig, ReferenceComparisonPanel,
  |                   FontInspectorPanel
  core/             — EmulatorRuntime, types, CrtSettings, RenderMetrics
  input/            — KeyboardMapper (browser → machine key events)
  video/
    presets/        — Per-machine presets (text & bitmap modes), types
    fonts/          — Font loading (FontLoader), font presets, registry,
    |                 BinaryFontDecoder, FontPresetExport
    modes/          — Video mode decoders (TextMode, AttributeBitmap,
    |                 Bitmap1/2Bpp, Tilemap, CpcGateArray, C64Multicolor,
    |                 C64Sprite, KayproGraphics, HgcBitmap, SemiGraphics, etc.)
    renderers/      — WebGL2Renderer (primary), Canvas2DRenderer (fallback),
    |                 RendererFactory
    shaders/        — WebGL2 shaders (screen.vert, palette.frag, crt.frag)
    text/           — TextModeRenderer, AttributeTextScreen, TextScreen,
    |                 CharMapper (ascii/petscii/petscii-shifted),
    |                 DemoTextScene, demos/<machine>.ts,
    |                 BootScreenScene, HeadlessTextRenderer,
    |                 DemoScript (JSON DSL), DirtyTextBuffer
    image/          — ImageLoader, PngSnapshot, ImageLoader
    pipeline/       — FrameSource, DisplayOutput, VideoPipeline,
    |                 DisplayProfiles (8 presets), ViewConfig
    comparison/     — ReferenceImage (diff metrics, loadReferenceImage)
    monitors/       — Monitor definitions (28 monitors)
```

## Rendering pipeline

```
Text mode:
  DemoTextScene / BootScreenScene
    → AttributeTextScreen (chars + fg/bg per cell)
    → CharMapper (ascii/petscii)
    → renderAttributeTextToFramebuffer / renderGlyphToFramebuffer
    → indexed framebuffer (Uint8Array)

Bitmap mode:
  ImageLoader (test image) / PngSnapshot
    → imageToIndexedFramebuffer (quantize to palette)
    → indexed framebuffer (Uint8Array)

Display:
  indexed framebuffer
    → WebGL2Renderer: palette texture → FBO → CRT shader → canvas
    → Canvas2DRenderer: palette RGBA → OffscreenCanvas → canvas
```

## Pixel Aspect Ratio

PAR in the preset makes the displayed image match the original monitor's 4:3 proportions:

```
PAR = (4/3) / (framebufferWidth / framebufferHeight)
```

- C64 320×200: PAR = 5/6 ≈ 0.833
- ZX Spectrum 256×192: PAR = 1 (square pixels)
- CPC 160×200: PAR = 5/3 ≈ 1.667
- C128 VDC 640×200: PAR = 5/12 ≈ 0.417
- MDA 720×350: PAR ≈ 0.686

## Adding a machine

1. Add font `.bin` to `public/fonts/<machine>/`
2. Create font preset entry in `src/video/fonts/fontPresets.ts`
3. Create `src/video/presets/<machine>.ts` with `T()` (text) / `G()` (bitmap) presets
4. Register in `src/video/presets/index.ts`
5. Create `src/video/text/demos/<machine>.ts` with demo scene
6. Register in `src/video/text/DemoTextScene.ts`
7. Add boot screen in `src/video/text/BootScreenScene.ts`
8. Create `docs/<brand>/<machine>.md`
9. Add monitor mapping in `src/video/monitors/index.ts`

Each preset defines: cols, rows, char cell size, framebuffer size, pixel aspect ratio, font, palette, margins, border colors.

## Font system

- `.bin` files in `public/fonts/<machine>/`
- Font preset in `fontPresets.ts`: `url`, `glyphCount`, `charWidth/Height`, `bytesPerGlyph`, `xBits`, `mapperId`
- `mapperId`: `'ascii'`, `'petscii'`, `'petscii-shifted'`
- `xBits` controls bit-to-pixel mapping: `[7,6,5,4,3,2,1,0]` (MSB-first) or `[0,1,2,3,4,5,6,7]` (LSB-first)
- `invertBits` for inverted fonts
- `scaleX`/`scaleY` for character doubling (e.g. interlaced modes)

## Test status

- **133 unit tests**, 25 test files
- Tests cover: display geometry, font bitmap, text rendering, character mappers, video mode decoders, image difference metrics, golden snapshots, dirty cell rendering, display profiles, demo scripts, keyboard mapper, view config export, render metrics
- All tests run headless (no WebGL/canvas needed)

## GitHub issues workflow

```sh
gh issue list --limit 20
gh issue view <NUMBER>
gh issue close <NUMBER> --comment "Closed by <HASH>: description"
```

See `.opencode/commands/issues.md` for details.
