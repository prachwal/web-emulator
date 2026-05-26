# CRT Web Emulator — AGENTS.md

## Project

Vite + Preact (TSX) + TypeScript CRT web emulator. Renders retro computer video modes (text & bitmap) via WebGL2 with CRT effects.

## Commands

```sh
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build
npm test             # vitest run (66 tests, 12 files)
npm run lint         # tsc --noEmit
npm run test:watch   # vitest watch
```

## Architecture

```
src/
  app/          — UI components (Preact TSX)
    AppShell.tsx       — layout + toolbar + CRT bezel + nameplate
    EmulatorViewport.tsx — canvas init, render loop, font/palette upload
    SettingsPanel.tsx  — CRT slider controls
    DebugOverlay.tsx   — FPS counter
  core/         — runtime, types
    EmulatorRuntime.ts  — initCanvas(), resizeCanvas(), stepFrame()
    types.ts            — CrtSettings, MachineProfile, VideoMode union
  video/        — graphics pipeline
    BitmapFont.ts       — getGlyphBit(), loadFontFromBin()
    Framebuffer.ts      — Uint8Array indexed framebuffer
    Palette.ts          — ZX Spectrum (16), C64 (16), parseCssHexColor()
    DisplayGeometry.ts  — computeViewport() with integer scaling
    presets.ts          — PRESETS array, T()/G() helpers, FontGeometry
    VideoSystem.ts      — decoder registry, stepFrame(), mode switching
    VideoState.ts       — createVideoState(), markAllDirty()
    modes/
      IVideoModeDecoder.ts  — interface { id, sourceWidth, sourceHeight, decode() }
      TextModeDecoder.ts    — 'text', with colorModel: 'mda'|'c64'|'zx'
      Bitmap1BppDecoder.ts  — 'bitmap-1bpp'
      Bitmap2BppDecoder.ts  — 'bitmap-2bpp' (C64 320x200)
      AttributeBitmapDecoder.ts — 'attribute-bitmap' (ZX INK/PAPER/BRIGHT/FLASH)
      TilemapDecoder.ts     — 'tilemap' (CGA)
    renderers/
      IRenderer.ts         — interface { initialize, resize, uploadFrame, render }
      WebGL2Renderer.ts    — WebGL2 with UNPACK_FLIP_Y_WEBGL, CRT shader
      Canvas2DRenderer.ts  — debug/fallback
      RendererFactory.ts   — createRenderer('auto'|'webgl2'|'canvas2d')
    text/
      TextModeRenderer.ts  — renderGlyphToFramebuffer(), renderAttributeTextToFramebuffer()
      AttributeTextScreen.ts — char grid with per-cell fg/bg
      DemoTextScene.ts     — per-machine demo content
      CharMapper.ts        — ascii, petscii
      TextScreen.ts        — simple char grid
      TextCursor.ts        — cursor blink/position
    fonts/
      FontLoader.ts        — loadBitmapFont() from .bin via fetch
      fontPresets.ts       — font metadata (xBits, invertBits, cellWidth/Height)
      FontRegistry.ts      — global font cache
    image/
      ImageLoader.ts       — loadImage() + imageToIndexedFramebuffer()
  input/        — keyboard controller
  wasm/         — Go WASM bridge (WIP)
  worker/       — web worker protocol
```

## Preset system

Central in `src/video/presets.ts`. Machines: zx, c64, cga, pet, mda, trs80, apple1, vic20.

Each preset has `type: 'text' | 'bitmap'`, framebuffer dimensions, PAR, palette, fontId, and FontGeometry (glyphWidth/Height, cellWidth/Height, bytesPerGlyph, xBits, invertBits, leftBit).

Three-level UI: Machine → Text|Bitmap → Resolution variant.

## Rendering pipeline

```
DemoTextScene → AttributeTextScreen → TextModeRenderer.renderAttributeTextToFramebuffer()
  → framebuffer (Uint8Array) → WebGL2Renderer.uploadFrame() → .render()
```

Bitmap mode: `imageToIndexedFramebuffer()` loads tukan.jpg, quantizes to palette, writes to framebuffer.

## WebGL2 key details

- `UNPACK_FLIP_Y_WEBGL = 1` (row 0 = top of texture)
- Full backbuffer/FBO clear before each frame
- Viewport uses `computeViewport()` with `integerScale: true` for centered scaled output
- CRT pass renders to FBO then composites: curvature, scanlines, mask, vignette

## Font system

- `.bin` files in `public/fonts/{machine}/`
- BitmapFont: charWidth, charHeight, cellWidth? cellHeight?, xBits?, invertBits?
- `getGlyphBit(font, charCode, x, y)` uses xBits[] for column→bit mapping
- Mappers: `ascii` (passthrough), `petscii` (Commodore shift)

## Color nuances

- **ZX**: AttributeBitmapDecoder decodes INK/PAPER/BRIGHT/FLASH per 8×8 cell
- **C64**: TextModeDecoder.colorModel='c64' reads colorRam as 4-bit nybble (foreground only)
- **Apple 1**: TextRenderOptions.invertMsb swaps fg/bg when charCode >= 128

## Conventions

- No comments in code (exception: section headers in CSS)
- Use `@preact/signals` for reactive state (signal, computed)
- Preact TSX with `.tsx` extension
- CSS classes follow BEM-lite (`.crt-label`, `.toolbar-btn`)
- Tests in `src/tests/` using Vitest with jsdom
- Prefer editing existing files over creating new ones
- Commit messages: `feat(machine): description` or `fix(area): description`
