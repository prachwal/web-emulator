# Plan implementacji web app: emulator/renderer CRT dla komputerów 8-bit

**Stack bazowy:** Vite + TypeScript + Preact  
**Rendering:** WebGL2 jako backend główny, WebGPU jako backend opcjonalny, Canvas 2D jako fallback/debug  
**Concurrency:** Web Worker + OffscreenCanvas  
**Opcjonalny rdzeń obliczeniowy:** Go kompilowany do WebAssembly  
**Cel:** szybki, modularny renderer trybów tekstowych i graficznych 8-bit z emulacją pikseli, fontów bitmapowych, palet, atrybutów, sprite'ów i efektu CRT.

---

## 1. Założenia projektowe

### 1.1. Cel aplikacji

Aplikacja ma renderować obraz zbliżony do komputerów 8-bitowych, np. ZX Spectrum, Commodore 64, Atari 8-bit, Amstrad CPC, MSX lub własnych maszyn fantasy-retro.

System powinien obsługiwać:

- niskopoziomowy framebuffer indeksowany paletą,
- tryby tekstowe,
- tryby bitmapowe,
- tryby tilemap,
- tryby z atrybutami kolorów,
- fonty bitmapowe ładowane z ROM/bin/png/json,
- sprite'y,
- border/overscan,
- skalowanie pikseli bez interpolacji,
- shader CRT: scanlines, maska RGB, bloom, curvature, phosphor persistence, noise, interlace,
- renderowanie w Workerze,
- opcjonalne użycie Go/WASM dla rdzenia emulacji lub dekodowania obrazu.

### 1.2. Główna zasada architektoniczna

Nie renderować retro-pikseli jako DOM ani jako tysiące `fillRect`. Obraz powinien przechodzić przez pipeline:

```text
emulacja / logika video
    -> framebuffer indeksowany
    -> tekstura GPU
    -> mapowanie palety
    -> post-process CRT
    -> canvas
```

### 1.3. Separacja odpowiedzialności

Aplikacja powinna mieć oddzielone warstwy:

```text
UI Preact
Renderer abstraction
Video model
Mode decoders
CRT post-processing
Input
Audio, jeśli potrzebne
Worker runtime
WASM bridge, jeśli potrzebny
```

---

## 2. Stack technologiczny

### 2.1. Frontend

- Vite
- TypeScript
- Preact
- Preact Signals lub własny lekki store
- CSS Modules albo plain CSS variables
- Vitest do testów jednostkowych TS
- Playwright opcjonalnie do testów E2E/rendering smoke tests

### 2.2. Rendering

Priorytety backendów:

1. `WebGL2Renderer` - backend podstawowy.
2. `WebGPURenderer` - backend nowoczesny, opcjonalny.
3. `Canvas2DRenderer` - fallback, debug, snapshot tests.

### 2.3. Worker

- Web Worker typu module.
- OffscreenCanvas, jeśli przeglądarka obsługuje transfer canvas do workera.
- Fallback: Worker liczy framebuffer, main thread tylko wysyła teksturę do canvas.

### 2.4. WASM

Go/WASM tylko wtedy, gdy faktycznie potrzebujesz:

- ciężkiego rdzenia emulacji CPU,
- dekodowania scanline po scanline,
- przeniesienia istniejącego kodu Go,
- deterministycznego core'u współdzielonego z wersją desktop/server.

Nie używać Go/WASM na siłę do samego renderingu GPU. Shadery i upload tekstur zostają w TypeScript/WebGL/WebGPU.

---

## 3. Struktura repozytorium

```text
crt-webapp/
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  public/
    fonts/
      c64-charrom.bin
      zx-spectrum.romfont.bin
    palettes/
      c64.json
      zx-spectrum.json
    wasm/
      emulator.wasm
      wasm_exec.js
  src/
    main.tsx
    app/
      App.tsx
      AppShell.tsx
      SettingsPanel.tsx
      EmulatorViewport.tsx
      DebugOverlay.tsx
    core/
      EmulatorRuntime.ts
      Clock.ts
      RingBuffer.ts
      types.ts
    video/
      VideoSystem.ts
      VideoState.ts
      VideoMode.ts
      Framebuffer.ts
      Palette.ts
      BitmapFont.ts
      Sprite.ts
      modes/
        IVideoModeDecoder.ts
        TextModeDecoder.ts
        Bitmap1BppDecoder.ts
        Bitmap2BppDecoder.ts
        AttributeBitmapDecoder.ts
        TilemapDecoder.ts
        C64LikeTextDecoder.ts
        SpectrumLikeDecoder.ts
      renderers/
        IRenderer.ts
        RendererFactory.ts
        WebGL2Renderer.ts
        WebGPURenderer.ts
        Canvas2DRenderer.ts
      shaders/
        webgl/
          screen.vert
          palette.frag
          crt.frag
          bloom-threshold.frag
          blur-horizontal.frag
          blur-vertical.frag
        webgpu/
          screen.wgsl
          crt.wgsl
    worker/
      emulator.worker.ts
      WorkerProtocol.ts
    input/
      KeyboardController.ts
      JoystickController.ts
    wasm/
      GoWasmBridge.ts
      WasmMemoryView.ts
    audio/
      AudioEngine.ts
      worklet/
        audio-processor.ts
    tests/
      fixtures/
      helpers/
  go-core/
    go.mod
    cmd/wasm/main.go
    internal/video/
    internal/emulator/
```

---

## 4. Inicjalizacja projektu

### 4.1. Utworzenie aplikacji

```bash
npm create vite@latest crt-webapp -- --template preact-ts
cd crt-webapp
npm install
```

### 4.2. Pakiety developerskie

```bash
npm install -D vitest @vitest/ui jsdom playwright
npm install @preact/signals
```

### 4.3. Skrypty `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "wasm:build": "cd go-core && GOOS=js GOARCH=wasm go build -o ../public/wasm/emulator.wasm ./cmd/wasm"
  }
}
```

---

## 5. Model danych video

### 5.1. Typy podstawowe

```ts
export type Rgba = number;
export type ColorIndex = number;

export interface Size {
  width: number;
  height: number;
}

export interface VideoState {
  mode: VideoMode;
  sourceWidth: number;
  sourceHeight: number;
  frameNumber: number;
  framebuffer: Uint8Array;
  palette: Uint32Array;
  dirtyRects: DirtyRect[];
  borderColorIndex: number;
}

export interface DirtyRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### 5.2. Framebuffer indeksowany

Dla większości maszyn 8-bit zalecany format:

```text
Uint8Array framebuffer
1 bajt = indeks koloru w palecie
```

Zalety:

- mały transfer CPU -> GPU,
- łatwe mapowanie palet,
- łatwe snapshoty,
- dobrze pasuje do historycznych układów video,
- shader może mapować indeksy na RGB.

Przykłady rozmiarów:

```text
256 x 192 = 49 152 bajty
320 x 200 = 64 000 bajtów
256 x 240 = 61 440 bajtów
384 x 272 = 104 448 bajtów
```

### 5.3. Paleta

Format palety:

```ts
export interface Palette {
  name: string;
  colors: Uint32Array;
}
```

Kolor przechowywać jako `0xAABBGGRR` albo `0xRRGGBBAA`, ale konsekwentnie. Dla uploadu do GPU najlepiej przygotować `Uint8Array` RGBA.

---

## 6. Tryby graficzne

### 6.1. Interfejs dekodera trybu

```ts
export interface IVideoModeDecoder<TMemory = unknown> {
  readonly id: VideoMode;
  readonly sourceWidth: number;
  readonly sourceHeight: number;

  decode(memory: TMemory, target: Uint8Array, frameNumber: number): void;
}
```

### 6.2. Text mode

Model:

```ts
export interface TextModeMemory {
  columns: number;
  rows: number;
  charWidth: number;
  charHeight: number;
  screenRam: Uint8Array;
  colorRam: Uint8Array;
  font: BitmapFont;
  backgroundColorIndex: number;
}
```

Algorytm:

```text
for each cell:
  charCode = screenRam[cell]
  color = colorRam[cell]
  glyph = font[charCode]
  for glyph y:
    rowBits = glyph[y]
    for glyph x:
      bit = rowBits & mask
      framebuffer[pixel] = bit ? foreground : background
```

### 6.3. Bitmap 1bpp

Dla ZX Spectrum-like:

```text
bitmap: 256 x 192 x 1 bit
attributes: 32 x 24 bajty
każdy atrybut: ink, paper, bright, flash
```

Dekoder powinien obsługiwać:

- nietypowy układ pamięci ZX Spectrum,
- bright,
- flash zależny od `frameNumber`,
- border.

### 6.4. Bitmap 2bpp/4bpp

Dla trybów multicolor:

```text
2bpp: 4 kolory na piksel
4bpp: 16 kolorów na piksel
```

Potrzebne warianty:

- globalna paleta,
- paleta per tile,
- kolory z rejestrów video,
- kolory z attribute RAM.

### 6.5. Tilemap

Model:

```ts
export interface TilemapMemory {
  mapWidth: number;
  mapHeight: number;
  tileWidth: number;
  tileHeight: number;
  tileMap: Uint16Array;
  tileData: Uint8Array;
  paletteMap?: Uint8Array;
  scrollX: number;
  scrollY: number;
}
```

### 6.6. Sprite layer

Sprite'y renderować po tle, z obsługą:

- pozycji,
- przezroczystości,
- priorytetu,
- flip X/Y,
- palety,
- powiększenia,
- kolizji, jeśli potrzebna emulacja.

---

## 7. Renderer abstraction

### 7.1. Interfejs renderera

```ts
export interface RendererOptions {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  sourceWidth: number;
  sourceHeight: number;
  crt: CrtSettings;
}

export interface IRenderer {
  readonly kind: 'webgl2' | 'webgpu' | 'canvas2d';

  initialize(options: RendererOptions): Promise<void> | void;
  resize(displayWidth: number, displayHeight: number, devicePixelRatio: number): void;
  uploadPalette(palette: Uint8Array): void;
  uploadFrame(framebuffer: Uint8Array): void;
  render(frameNumber: number): void;
  dispose(): void;
}
```

### 7.2. RendererFactory

```ts
export async function createRenderer(options: RendererOptions): Promise<IRenderer> {
  if ('gpu' in navigator) {
    try {
      const renderer = new WebGPURenderer();
      await renderer.initialize(options);
      return renderer;
    } catch {
      // fallback
    }
  }

  const gl = options.canvas.getContext('webgl2');
  if (gl) {
    const renderer = new WebGL2Renderer();
    await renderer.initialize(options);
    return renderer;
  }

  const renderer = new Canvas2DRenderer();
  await renderer.initialize(options);
  return renderer;
}
```

Uwaga: można odwrócić priorytet i wymusić WebGL2 jako domyślny, a WebGPU aktywować flagą konfiguracyjną. To bezpieczniejsze na start.

---

## 8. WebGL2 renderer

### 8.1. Tekstury

Minimalny zestaw tekstur:

```text
screenIndexTexture: R8, rozmiar źródła, indeksy kolorów
paletteTexture: RGBA8, np. 256 x 1
crtIntermediateTexture: RGBA8, rozmiar canvas/backbuffer
bloomTextureA
bloomTextureB
persistenceTexture, opcjonalnie
```

### 8.2. Upload framebufferu

W WebGL2 używać tekstury jednego kanału:

```ts
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.R8,
  sourceWidth,
  sourceHeight,
  0,
  gl.RED,
  gl.UNSIGNED_BYTE,
  framebuffer
);
```

Dla aktualizacji po inicjalizacji:

```ts
gl.texSubImage2D(
  gl.TEXTURE_2D,
  0,
  0,
  0,
  sourceWidth,
  sourceHeight,
  gl.RED,
  gl.UNSIGNED_BYTE,
  framebuffer
);
```

### 8.3. Filtracja

Wymagane:

```ts
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
```

### 8.4. Draw calls

Startowo:

```text
1. pass palette: indeksy -> RGBA low-res/upscaled
2. pass CRT composite
```

Docelowo:

```text
1. source index texture
2. palette pass
3. bloom threshold
4. blur horizontal
5. blur vertical
6. phosphor persistence
7. final CRT composite
```

---

## 9. WebGPU renderer

### 9.1. Cel WebGPU

WebGPU powinien być drugim backendem, nie pierwszym etapem projektu. Warto go dodać, gdy WebGL2 działa stabilnie.

WebGPU daje:

- nowocześniejszy model zasobów GPU,
- compute shader dla konwersji/filtrów,
- lepszą kontrolę pipeline,
- potencjalnie lepsze skalowanie dla złożonego CRT.

### 9.2. Minimalny pipeline WebGPU

```text
GPUTexture R8Uint/R8Unorm - framebuffer indeksowany
GPUTexture RGBA8Unorm - paleta
RenderPipeline - palette mapping
RenderPipeline - CRT composite
opcjonalnie ComputePipeline - preprocessing/bloom
```

### 9.3. Strategia wdrożenia

Najpierw zdefiniować wspólny kontrakt `IRenderer`, potem:

```text
Milestone A: WebGL2Renderer
Milestone B: Canvas2DRenderer fallback
Milestone C: testy snapshotowe framebufferów
Milestone D: WebGPURenderer jako eksperymentalny backend
```

---

## 10. CRT shader

### 10.1. Ustawienia CRT

```ts
export interface CrtSettings {
  enabled: boolean;
  curvature: number;
  scanlineStrength: number;
  maskStrength: number;
  bloomStrength: number;
  bloomRadius: number;
  brightness: number;
  contrast: number;
  saturation: number;
  chromaticAberration: number;
  noiseStrength: number;
  phosphorPersistence: number;
  interlace: boolean;
  vignette: number;
}
```

### 10.2. Efekty MVP

W pierwszej wersji:

- nearest-neighbor upscale,
- scanlines,
- RGB mask,
- curvature,
- vignette,
- brightness/contrast.

### 10.3. Efekty docelowe

W kolejnych wersjach:

- bloom wieloprzebiegowy,
- phosphor persistence,
- chromatic aberration,
- noise zależny od czasu,
- interlace,
- PAL/NTSC composite artifacting,
- overscan i border.

---

## 11. Skalowanie i viewport

### 11.1. Integer scaling

Preferować skalowanie całkowite:

```ts
export function computeIntegerScale(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): number {
  return Math.max(1, Math.floor(Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  )));
}
```

### 11.2. Letterbox/pillarbox

Wyliczyć viewport:

```ts
const scale = computeIntegerScale(sourceWidth, sourceHeight, displayWidth, displayHeight);
const viewportWidth = sourceWidth * scale;
const viewportHeight = sourceHeight * scale;
const viewportX = Math.floor((displayWidth - viewportWidth) / 2);
const viewportY = Math.floor((displayHeight - viewportHeight) / 2);
```

### 11.3. CSS

```css
.emulatorCanvas {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  background: #000;
}
```

---

## 12. Worker architecture

### 12.1. Protokół wiadomości

```ts
export type MainToWorkerMessage =
  | { type: 'init'; canvas?: OffscreenCanvas; config: EmulatorConfig }
  | { type: 'resize'; width: number; height: number; dpr: number }
  | { type: 'set-crt'; settings: CrtSettings }
  | { type: 'load-font'; font: SerializedFont }
  | { type: 'load-palette'; palette: number[] }
  | { type: 'key-down'; code: string }
  | { type: 'key-up'; code: string }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'step-frame' };

export type WorkerToMainMessage =
  | { type: 'ready'; renderer: string }
  | { type: 'stats'; fps: number; frameTimeMs: number; uploadMs: number; renderMs: number }
  | { type: 'error'; message: string; stack?: string };
```

### 12.2. Main thread

Main thread powinien robić tylko:

- UI,
- input,
- konfigurację,
- transfer canvas,
- panel debug.

### 12.3. Worker

Worker powinien robić:

- emulację/aktualizację stanu,
- dekodowanie trybu graficznego do framebufferu,
- render, jeśli ma OffscreenCanvas,
- pomiar czasu frame.

### 12.4. Pętla frame

W Workerze nie zawsze masz idealne `requestAnimationFrame`. Możliwe strategie:

1. `requestAnimationFrame` w workerze, jeśli dostępny.
2. Main thread wysyła tick `raf` do workera.
3. `setTimeout`/fixed timestep jako fallback.

Rekomendacja produkcyjna:

```text
main thread requestAnimationFrame
  -> worker postMessage({ type: 'tick', timestamp })
  -> worker emuluje do timestamp
  -> worker renderuje
```

---

## 13. Integracja Go/WASM

### 13.1. Kiedy używać Go

Go/WASM ma sens dla:

- istniejącego emulator core w Go,
- CPU/memory/video logic,
- deterministycznego core,
- współdzielenia logiki z CLI/server.

Nie ma sensu dla:

- samego shader CRT,
- samego uploadu tekstur,
- prostego dekodowania fontów, które TS zrobi wystarczająco szybko.

### 13.2. Struktura Go

```text
go-core/
  go.mod
  cmd/wasm/main.go
  internal/emulator/emulator.go
  internal/video/framebuffer.go
```

### 13.3. Build Go do WASM

```bash
cd go-core
GOOS=js GOARCH=wasm go build -o ../public/wasm/emulator.wasm ./cmd/wasm
```

Skopiować `wasm_exec.js` z instalacji Go:

```bash
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ../public/wasm/wasm_exec.js
```

### 13.4. Most TS <-> WASM

```ts
export class GoWasmBridge {
  private go: any;
  private instance?: WebAssembly.Instance;

  async load(path: string): Promise<void> {
    await import('/wasm/wasm_exec.js');
    this.go = new (globalThis as any).Go();
    const result = await WebAssembly.instantiateStreaming(fetch(path), this.go.importObject);
    this.instance = result.instance;
    this.go.run(this.instance);
  }
}
```

### 13.5. Minimalna zasada wydajności

Nie wołać funkcji WASM dla każdego piksela. Przekazywać duże bufory i pracować partiami:

```text
JS -> WASM: ustaw pamięć/rejestry/input
WASM: wykonaj ramkę lub scanline batch
JS: pobierz widok framebufferu
GPU: upload jednej tekstury
```

---

## 14. Fonty bitmapowe

### 14.1. Format wewnętrzny

```ts
export interface BitmapFont {
  name: string;
  glyphCount: number;
  charWidth: number;
  charHeight: number;
  bytesPerGlyph: number;
  data: Uint8Array;
}
```

### 14.2. Loadery

Wdrożyć loadery:

```text
BinaryFontLoader
JsonFontLoader
PngFontAtlasLoader
RomFontLoader
```

### 14.3. Testy fontów

Testować:

- indeksowanie glyphów,
- odczyt bitu piksela,
- konwersję ROM -> bitmapa,
- render przykładowych znaków do framebufferu.

---

## 15. Palety

### 15.1. Format JSON

```json
{
  "name": "ZX Spectrum",
  "colors": [
    "#000000",
    "#0000D7",
    "#D70000",
    "#D700D7",
    "#00D700",
    "#00D7D7",
    "#D7D700",
    "#D7D7D7"
  ]
}
```

### 15.2. Funkcje

```ts
export function parseCssHexColor(hex: string): [number, number, number, number];
export function paletteToRgbaBytes(colors: string[]): Uint8Array;
export function paletteToUint32(colors: string[]): Uint32Array;
```

---

## 16. UI Preact

### 16.1. Komponenty

```text
AppShell
  EmulatorViewport
  Toolbar
  SettingsPanel
    VideoModeSelector
    PaletteSelector
    CrtControls
    FontLoader
    PerformancePanel
  DebugOverlay
```

### 16.2. Stan UI

Stan UI powinien być oddzielony od stanu emulacji:

```ts
interface UiState {
  selectedRenderer: 'auto' | 'webgl2' | 'webgpu' | 'canvas2d';
  selectedMachineProfile: string;
  crtSettings: CrtSettings;
  paused: boolean;
  showDebug: boolean;
}
```

### 16.3. Kontrolki CRT

Dodać slidery:

- scanline strength,
- mask strength,
- curvature,
- bloom strength,
- phosphor persistence,
- noise,
- brightness,
- contrast,
- saturation.

---

## 17. Konfiguracja profili maszyn

### 17.1. MachineProfile

```ts
export interface MachineProfile {
  id: string;
  name: string;
  sourceWidth: number;
  sourceHeight: number;
  refreshRate: number;
  defaultPalette: string;
  defaultFont?: string;
  supportedModes: VideoMode[];
  border: {
    enabled: boolean;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}
```

### 17.2. Przykłady

```ts
export const zxSpectrumProfile: MachineProfile = {
  id: 'zx-spectrum-like',
  name: 'ZX Spectrum-like',
  sourceWidth: 256,
  sourceHeight: 192,
  refreshRate: 50,
  defaultPalette: 'zx-spectrum',
  supportedModes: ['attribute-bitmap'],
  border: { enabled: true, left: 32, right: 32, top: 24, bottom: 24 }
};
```

---

## 18. Testy

### 18.1. Testy jednostkowe TS

Użyć Vitest.

Testować:

- `computeIntegerScale`,
- parser palet,
- font bit lookup,
- dekodery trybów graficznych,
- dirty rects,
- serializację protokołu worker,
- fallback wyboru renderera.

### 18.2. Testy snapshotowe framebufferów

Dla dekoderów przygotować fixture:

```text
input memory
expected framebuffer
```

Porównanie:

```ts
expect(actualFramebuffer).toEqual(expectedFramebuffer);
```

### 18.3. Testy renderingu

Dla Canvas2DRenderer można robić snapshot PNG. Dla WebGL2:

- render do framebufferu,
- `gl.readPixels`,
- porównanie tolerancyjne.

### 18.4. Testy Go

W `go-core`:

```bash
go test ./...
```

Testować:

- CPU step, jeśli istnieje,
- dekodowanie pamięci video,
- generowanie framebufferu,
- eksportowane funkcje WASM na poziomie czystej logiki.

---

## 19. Milestones implementacji

### Milestone 0: Szkielet projektu

Zakres:

- Vite + Preact + TS,
- podstawowy layout,
- canvas viewport,
- panel ustawień,
- Vitest,
- typy bazowe.

Akceptacja:

- `npm run dev` działa,
- `npm run build` działa,
- `npm test` działa,
- aplikacja pokazuje pusty canvas.

### Milestone 1: Framebuffer + Canvas2D debug renderer

Zakres:

- `Framebuffer`,
- `Palette`,
- `Canvas2DRenderer`,
- test pattern generator,
- integer scaling.

Akceptacja:

- aplikacja pokazuje checkerboard/test pattern,
- piksele są ostre,
- brak interpolacji.

### Milestone 2: Fonty bitmapowe + text mode

Zakres:

- `BitmapFont`,
- loader `.bin`,
- `TextModeDecoder`,
- render tekstu 40x25,
- wybór fontu w UI.

Akceptacja:

- widoczny tryb tekstowy,
- font 8x8 renderowany poprawnie,
- testy bit lookup i text decoder przechodzą.

### Milestone 3: WebGL2 renderer MVP

Zakres:

- inicjalizacja WebGL2,
- tekstura R8 na indeksy,
- tekstura palety,
- shader mapowania indeks -> RGB,
- fullscreen quad,
- nearest sampling.

Akceptacja:

- WebGL2 renderuje ten sam obraz co Canvas2D,
- kolory są zgodne z paletą,
- renderowanie jest stabilne przy resize.

### Milestone 4: CRT shader MVP

Zakres:

- scanlines,
- maska RGB,
- curvature,
- vignette,
- brightness/contrast,
- UI sliders.

Akceptacja:

- można włączać/wyłączać CRT,
- parametry zmieniają obraz bez restartu,
- koszt renderowania mieści się w budżecie 16.6 ms dla 60 FPS na desktopie.

### Milestone 5: Worker + OffscreenCanvas

Zakres:

- worker protocol,
- transfer canvas,
- render w workerze,
- resize messages,
- stats messages.

Akceptacja:

- UI nie zacina się podczas renderowania,
- debug panel pokazuje FPS/frame time,
- fallback działa bez OffscreenCanvas.

### Milestone 6: Tryby bitmap/attribute/tilemap

Zakres:

- `Bitmap1BppDecoder`,
- `AttributeBitmapDecoder`,
- `TilemapDecoder`,
- profile ZX-like/C64-like/custom.

Akceptacja:

- przykładowe obrazy testowe renderują się poprawnie,
- atrybuty kolorów działają,
- tilemap scrolling działa.

### Milestone 7: Bloom + persistence

Zakres:

- render targets/FBO,
- bloom threshold,
- blur horizontal/vertical,
- compositing,
- feedback buffer dla phosphor persistence.

Akceptacja:

- bloom działa jako osobny parametr,
- persistence działa bez ghostingu całego UI,
- można wyłączyć kosztowne efekty.

### Milestone 8: Go/WASM opcjonalnie

Zakres:

- `go-core`,
- build wasm,
- `GoWasmBridge`,
- eksport funkcji `stepFrame`, `getFramebufferPtr`, `getFramebufferLen`,
- integracja z workerem.

Akceptacja:

- TS potrafi uruchomić WASM,
- WASM generuje framebuffer,
- GPU renderuje framebuffer z WASM.

### Milestone 9: WebGPU backend opcjonalny

Zakres:

- feature detection,
- adapter/device,
- swapchain/context config,
- upload framebufferu,
- WGSL shader palette + CRT.

Akceptacja:

- WebGPU renderuje obraz zgodny z WebGL2,
- fallback do WebGL2 działa automatycznie.

### Milestone 10: Profilowanie i optymalizacja

Zakres:

- pomiary CPU decode time,
- upload time,
- render time,
- FPS,
- memory allocations,
- object pooling.

Akceptacja:

- brak alokacji per pixel,
- brak dużych alokacji per frame,
- stabilny frame time,
- profile wydajności zapisane w dokumentacji.

---

## 20. Budżet wydajności

### 20.1. Dla 60 FPS

```text
cała ramka: 16.6 ms
emulacja/decode: 1-6 ms
upload texture: < 1 ms
render CRT: 1-5 ms
UI/main thread: minimalnie
```

### 20.2. Dla 50 FPS PAL

```text
cała ramka: 20 ms
```

### 20.3. Reguły wydajności

- Nie alokować framebufferu co ramkę.
- Nie tworzyć shaderów/programów co ramkę.
- Nie tworzyć tekstur co ramkę.
- Nie wysyłać miliona małych wiadomości worker-main.
- Nie renderować piksela przez DOM.
- Nie używać `fillRect` per pixel poza trybem debug/fallback.
- Uploadować jedną teksturę na frame.
- Dla dużych efektów CRT używać kilku prostych passów, nie jednego ogromnego shadera.

---

## 21. Obsługa wejścia

### 21.1. Keyboard

Mapować klawiaturę przez `KeyboardEvent.code`, nie tylko `key`, bo `key` zależy od layoutu.

```ts
export interface KeyEventMessage {
  type: 'key-down' | 'key-up';
  code: string;
  repeat: boolean;
}
```

### 21.2. Joystick/gamepad

Dodać później przez Gamepad API:

```text
poll gamepad on frame
map axes/buttons to virtual joystick
send compact input state to worker
```

---

## 22. Audio, jeśli potrzebne

Dla prawdziwego emulatora audio robić przez AudioWorklet.

Pipeline:

```text
emulator audio buffer
  -> SharedArrayBuffer/RingBuffer, jeśli COOP/COEP ustawione
  -> AudioWorkletProcessor
  -> output
```

Na start można pominąć audio i skupić się na video.

---

## 23. Build i deployment

### 23.1. Vite config

```ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  worker: {
    format: 'es'
  },
  build: {
    target: 'es2022',
    sourcemap: true
  }
});
```

### 23.2. WASM assets

Pliki `.wasm` trzymać w `public/wasm` lub importować jako asset URL. Dla Go prostsze jest `public/wasm`.

### 23.3. Nagłówki dla zaawansowanych funkcji

Jeżeli użyjesz `SharedArrayBuffer`, wymagane będą nagłówki izolacji:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Dla samego WebGL2/WebGPU/OffscreenCanvas zwykle nie musisz od razu wprowadzać SAB.

---

## 24. Ryzyka techniczne

| Ryzyko | Skutek | Mitigacja |
|---|---|---|
| WebGPU nie działa wszędzie | brak renderera nowoczesnego | WebGL2 jako podstawowy backend |
| OffscreenCanvas niepełne wsparcie | render w main thread | fallback worker-main lub Canvas2D |
| Go/WASM overhead | wolniejsze niż TS dla drobnych wywołań | batch calls, duże bufory, brak per-pixel calls |
| CRT shader za ciężki | spadki FPS | presety quality: low/medium/high |
| różne DPR i resize | rozmycie pikseli | integer scaling + viewport |
| nietypowe font ROM | złe glyphy | testy fixture i podgląd fontu |
| alokacje per frame | GC stutter | prealokacja buforów |

---

## 25. Minimalny kod MVP do osiągnięcia szybko

Najkrótsza ścieżka:

```text
1. Vite/Preact canvas.
2. Framebuffer 256x192 Uint8Array.
3. Palette 16 kolorów.
4. Test pattern.
5. Canvas2D renderer.
6. TextModeDecoder 32x24, font 8x8.
7. WebGL2 renderer z R8 texture.
8. CRT shader: scanlines + mask.
9. Worker + OffscreenCanvas.
10. Profile ZX-like i C64-like.
```

---

## 26. Kolejność implementacji plików

### Etap A

```text
src/video/VideoMode.ts
src/video/Framebuffer.ts
src/video/Palette.ts
src/video/BitmapFont.ts
src/video/modes/IVideoModeDecoder.ts
src/video/modes/TextModeDecoder.ts
```

### Etap B

```text
src/video/renderers/IRenderer.ts
src/video/renderers/Canvas2DRenderer.ts
src/video/renderers/WebGL2Renderer.ts
src/video/renderers/RendererFactory.ts
src/video/shaders/webgl/screen.vert
src/video/shaders/webgl/palette.frag
src/video/shaders/webgl/crt.frag
```

### Etap C

```text
src/worker/WorkerProtocol.ts
src/worker/emulator.worker.ts
src/core/EmulatorRuntime.ts
src/app/EmulatorViewport.tsx
src/app/SettingsPanel.tsx
```

### Etap D

```text
src/video/modes/Bitmap1BppDecoder.ts
src/video/modes/AttributeBitmapDecoder.ts
src/video/modes/TilemapDecoder.ts
src/video/Sprite.ts
```

### Etap E

```text
go-core/cmd/wasm/main.go
src/wasm/GoWasmBridge.ts
src/wasm/WasmMemoryView.ts
```

---

## 27. Definition of Done

Projekt można uznać za gotowy technicznie, gdy:

- działa Vite build,
- działa Preact UI,
- działa Canvas2D fallback,
- działa WebGL2 renderer,
- CRT shader ma podstawowe efekty,
- render może działać w Workerze przez OffscreenCanvas,
- są testy jednostkowe dla dekoderów, palet i fontów,
- są profile przynajmniej dwóch maszyn,
- nie ma alokacji dużych buforów per frame,
- resize nie rozmywa pikseli,
- parametry CRT można zmieniać runtime,
- Go/WASM jest opcjonalne i nie blokuje aplikacji, jeśli nie zostanie zbudowane.

---

## 28. Dokumentacja źródłowa do sprawdzenia podczas implementacji

- Vite Getting Started: https://vite.dev/guide/
- Preact Getting Started: https://preactjs.com/guide/v10/getting-started/
- Preact preset for Vite: https://github.com/preactjs/preset-vite
- MDN WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- MDN OffscreenCanvas: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- Go WebAssembly Wiki: https://go.dev/wiki/WebAssembly
- WebAssembly official site: https://webassembly.org/

---

## 29. Rekomendacja końcowa

Najlepsza ścieżka implementacji:

```text
Vite + Preact + TypeScript
  -> Canvas2D fallback/debug
  -> WebGL2 renderer produkcyjny
  -> CRT shader MVP
  -> Worker + OffscreenCanvas
  -> tryby graficzne i fonty
  -> bloom/persistence
  -> Go/WASM, jeżeli rdzeń emulacji tego wymaga
  -> WebGPU jako backend eksperymentalny/zaawansowany
```

Najważniejsze decyzje:

- framebuffer indeksowany `Uint8Array`,
- paleta jako tekstura GPU,
- fonty bitmapowe jako ROM/bin/atlas,
- CRT jako post-process shader,
- WebGL2 jako stabilna baza,
- WebGPU dopiero po działającym WebGL2,
- Go/WASM tylko dla dużych bloków logiki, nie dla pojedynczych pikseli.
