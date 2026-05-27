# CRT Web Emulator — AGENTS.md

## Project

Vite + Preact (TSX) + TypeScript CRT web emulator. Renders retro computer video modes (text & bitmap) via WebGL2 with CRT effects.

## Commands

### CLI

```sh
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build
npm test             # vitest run (currently 76 tests, 12 files)
npm run lint         # tsc --noEmit
npm run test:watch   # vitest watch
```

After adding/editing presets or machine features, restart the dev server (`npm run dev`) — changes are picked up by Vite HMR.

### OpenCode slash commands (`.opencode/commands/`)

| Command | What it does |
|---|---|
| `/build` | Run `npm test && npm run build`, show failures |
| `/commit` | Stage all, review diff, commit with proper message |
| `/docs` | Update `<machine>.md` and demo after feature work |
| `/add-machine` | Scaffold preset files, demo, docs for a new machine |

### Repetitive tasks — standard procedure

After implementing features for a machine, always do in order:
1. Update `docs/<machine>.md` — move items from "Czego brakuje" to "Co już mamy" with [x]
   (Use the `checklist` MCP tool: `check_item(path, item_text)` to mark items done)
2. Update demo file in `src/video/text/demos/<machine>.ts`
3. Run `npm test && npm run build`
4. Git add, commit with `feat(machine):` or `fix(area):`

### Computer definition spec

A generic computer definition is documented in `docs/computer-definition.md` (DEFv1).
**Before adding/modifying a machine, read that file.** It lists every file, registration,
and field required for a complete implementation.

- When creating a new machine: follow the spec step by step
- When fixing a machine: validate against the spec checklist in section 6
- Each `docs/<machine>.md` must have a `Zgodność: DEFv1` marker in its header.
  If missing, run the checklist from section 6 automatically before committing.

## Architecture

```
src/
  app/            — UI components (Preact TSX)
    AppShell.tsx         — layout + toolbar + CRT bezel + nameplate
    EmulatorViewport.tsx — canvas init, render loop, font/palette upload
    SettingsPanel.tsx    — CRT slider controls
    DebugOverlay.tsx     — FPS counter
  core/           — runtime, types
    EmulatorRuntime.ts   — initCanvas(), resizeCanvas(), stepFrame()
    types.ts             — CrtSettings, MachineProfile, VideoMode union
  video/
    BitmapFont.ts        — getGlyphBit(), loadFontFromBin()
    Framebuffer.ts       — Uint8Array indexed framebuffer
    Palette.ts           — ZX Spectrum (16), C64 (16), parseCssHexColor()
    DisplayGeometry.ts   — computeViewport() with integer scaling
    presets/
      types.ts           — Preset, FontGeometry, Margins, helpers (T, G, f8, f8hl, m)
      index.ts           — aggregates per-machine presets, exports PRESETS[]
      zx.ts              — ZX Spectrum presets
      c64.ts             — Commodore 64 presets
      cga.ts             — IBM CGA presets
      pet.ts             — Commodore PET presets
      mda.ts             — IBM MDA presets
      trs80.ts           — TRS-80 Model III presets
      apple1.ts          — Apple 1 presets
      vic20.ts           — VIC-20 presets
    VideoSystem.ts       — decoder registry, stepFrame(), mode switching
    VideoState.ts        — createVideoState(), markAllDirty()
    modes/
      IVideoModeDecoder.ts   — interface { id, sourceWidth, sourceHeight, decode() }
      TextModeDecoder.ts     — 'text', with colorModel: 'mda'|'c64'|'zx'|'cga'
      Bitmap1BppDecoder.ts   — 'bitmap-1bpp'
      Bitmap2BppDecoder.ts   — 'bitmap-2bpp' (C64 320x200)
      AttributeBitmapDecoder.ts — 'attribute-bitmap' (ZX INK/PAPER/BRIGHT/FLASH)
      TilemapDecoder.ts      — 'tilemap' (CGA)
    renderers/
      IRenderer.ts          — interface { initialize, resize, uploadFrame, render }
      WebGL2Renderer.ts     — WebGL2 with UNPACK_FLIP_Y_WEBGL, CRT shader
      Canvas2DRenderer.ts   — debug/fallback
      RendererFactory.ts    — createRenderer('auto'|'webgl2'|'canvas2d')
    text/
      TextModeRenderer.ts   — renderGlyphToFramebuffer(), renderAttributeTextToFramebuffer()
      AttributeTextScreen.ts — char grid with per-cell fg/bg
      DemoTextScene.ts      — per-machine demo content (createDemoForMachine)
      CharMapper.ts         — ascii, petscii
      TextScreen.ts         — simple char grid
      TextCursor.ts         — cursor blink/position
    fonts/
      FontLoader.ts         — loadBitmapFont() from .bin via fetch
      fontPresets.ts        — font metadata (xBits, invertBits, cellWidth/Height)
      FontRegistry.ts       — global font cache
    image/
      ImageLoader.ts        — loadImage() + imageToIndexedFramebuffer()
  input/            — keyboard controller
  wasm/             — Go WASM bridge (WIP)
  worker/           — web worker protocol
```

## Preset system

Central in `src/video/presets/index.ts`. Machines: zx, c64, cga, pet, mda, trs80, apple1, vic20.

Each preset has `type: 'text' | 'bitmap'`, framebuffer dimensions, PAR, palette, fontId, and FontGeometry (glyphWidth/Height, cellWidth/Height, bytesPerGlyph, xBits, invertBits, leftBit).

Three-level UI: Machine → Text|Bitmap → Resolution variant.

To add presets for a new machine, create `src/video/presets/<machine>.ts` and register it in `index.ts`.

**See `docs/computer-definition.md` for the complete checklist.**

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

| Machine | Feature | Implementation |
|---|---|---|
| **ZX** | Attribute INK/PAPER/BRIGHT/FLASH per 8×8 cell | `AttributeBitmapDecoder` + `TextModeDecoder.colorModel='zx'` |
| **C64** | Color RAM as 4-bit nybble (foreground only) | `TextModeDecoder.colorModel='c64'` |
| **CGA** | Blink attribute, RGBI 16-color palette | `TextModeDecoder.colorModel='cga'` + inline palette |
| **MDA** | Blink attribute, monochrome green | `TextModeDecoder.colorModel='mda'` |
| **Apple 1** | Inverted chars via MSB=1 swap fg↔bg | `TextRenderOptions.invertMsb` |

## Available skills

The agent has 42 skills; load with `skill({name: "<skill>"})`. Relevant to this project:

| Skill | When to use |
|---|---|
| `preact-ui` | Designing/refactoring Preact TSX components, signals, hooks, forms |
| `typescript-fundamentals` | Type design, interfaces, patterns, module organization |
| `project-tooling` | Vite, Vitest, TypeScript, ESLint config, package scripts |
| `vite-config` | Changing Vite config, aliases, env vars, build output |
| `eslint-config` | Setting up or fixing ESLint flat config |
| `vitest-vue-testing` | Writing/fixing Vitest tests with jsdom |
| `web-testing` | Playwright E2E tests, visual comparison |
| `web-performance` | Render optimization, WebGL, Core Web Vitals, code splitting |
| `scss-system` | SCSS design system, tokens, mixins, theming |
| `web-design-review` | Reviewing visual design implementation, spacing, typography, color |
| `release-docs` | README, changelogs, deployment docs, version notes |
| `docs-instructions` | AGENTS.md, Copilot/Codex instructions, repo prompts |
| `web-deployment` | Netlify/Vercel deploy, env vars, redirects, cache headers |

Less relevant: `netlify-*`, `vue-*`, `auth0-cli`, `mongodb-netlify`, `neon-netlify`,
`storybook-ui`, `vercel-*`, `a11y-review`, `web-*` (auth, forms, i18n, SEO, PWA, security, privacy, content).

Usage: load a skill when the task description matches its trigger phrase
(e.g. "review this UI" → `web-design-review`, "write a test" → `vitest-vue-testing`).
If multiple skills match, load the most specific one first.

## Subagents

Subagents defined in `.opencode/agents/`:

| Agent | Model | Purpose |
|---|---|---|
| `planner` | `openai/gpt-5.5` | Creates structured implementation plans from scout research for the build agent. Invoke with `@planner`. |
| `researcher` | `opencode-go/deepseek-v4-flash` | Web search and information analysis. Delegated by other agents for online research. Invoke with `@researcher`. |

## Conventions

- No comments in code (exception: section headers in CSS)
- **When using external fonts, ROMs, or binaries:**
  1. Search upstream emulator source repos for the files
  2. Document the exact source (repo URL, file path, offset) in the machine's `docs/<brand>/<machine>.md`
  3. Add a "Źródła plików i dokumentacji" section with all links
  4. This saves time on future lookups
- Documentacja maszyn w `docs/<brand>/<machine>.md`, monitory w `docs/<brand>/monitors.md`
- Use `@preact/signals` for reactive state (signal, computed)
- Preact TSX with `.tsx` extension
- CSS classes follow BEM-lite (`.crt-label`, `.toolbar-btn`)
- Tests in `src/tests/` using Vitest with jsdom
- Prefer editing existing files over creating new ones
- Commit messages: `feat(machine): description` or `fix(area): description`
- **After implementing features for a machine:**
  1. Update the corresponding `docs/<machine>.md` — move features from "Czego brakuje" to "Co już mamy" with [x]
  2. Update `src/video/text/DemoTextScene.ts` — add demo content showcasing the new features
  3. Run `npm test && npm run build` to verify
