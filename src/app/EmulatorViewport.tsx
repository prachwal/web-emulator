import { useRef, useEffect } from 'preact/hooks';
import type { CrtSettings } from '../core/types';
import { EmulatorRuntime } from '../core/EmulatorRuntime';
import { Framebuffer } from '../video/Framebuffer';
import { loadPalette, paletteToRgba } from '../video/Palette';
import { TextModeDecoder } from '../video/modes/TextModeDecoder';
import { AttributeBitmapDecoder } from '../video/modes/AttributeBitmapDecoder';
import { createDefaultFont } from '../video/BitmapFont';
import { machineProfiles } from '../core/types';
import { loadBitmapFont } from '../video/fonts/FontLoader';
import { globalFontRegistry } from '../video/fonts/FontRegistry';
import { fontPresets, getFontPreset } from '../video/fonts/fontPresets';
import { createDemoTextScreen } from '../video/text/DemoTextScene';
import { renderAttributeTextToFramebuffer } from '../video/text/TextModeRenderer';
import { textVideoModes, getTextMode } from '../video/text/textModes';
import { asciiCharMapper } from '../video/text/CharMapper';

export interface EmulatorViewportProps {
  crt: CrtSettings;
  profileId: string;
  mode: string;
  paused: boolean;
  activeFontId?: string;
}

export function EmulatorViewport({ crt, profileId, mode, paused, activeFontId }: EmulatorViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<EmulatorRuntime | null>(null);
  const rafRef = useRef<number>(0);
  const modeRef = useRef(mode);

  // Track active text font across re-renders
  const fontRef = useRef(createDefaultFont(8, 8));
  const screenRef = useRef(createDemoTextScreen(40, 25));

  const isTextMode = mode.startsWith('text-') || mode === 'attribute-text';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    modeRef.current = mode;
    const textMode = isTextMode;
    const currentMode = mode;

    const runtime = new EmulatorRuntime(profileId);
    runtimeRef.current = runtime;

    (async () => {
      await runtime.initCanvas(canvas);

      if (textMode) {
        const textModeDef = getTextMode(currentMode) ?? textVideoModes[1];
        const profile = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];
        const fbWidth = textModeDef.framebufferWidth;
        const fbHeight = textModeDef.framebufferHeight;

        if (runtime.video.state.framebuffer.length !== fbWidth * fbHeight) {
          runtime.video.state.framebuffer = new Uint8Array(fbWidth * fbHeight);
        }
        runtime.video.state.sourceWidth = fbWidth;
        runtime.video.state.sourceHeight = fbHeight;

        let font = createDefaultFont(8, 8);
        if (activeFontId) {
          const cached = globalFontRegistry.get(activeFontId);
          if (cached) {
            font = cached;
          } else {
            const preset = getFontPreset(activeFontId);
            if (preset) {
              try {
                font = await loadBitmapFont(preset);
                globalFontRegistry.register(font);
              } catch {
                font = createDefaultFont(8, 8);
              }
            }
          }
        }
        fontRef.current = font;

        const screen = createDemoTextScreen(textModeDef.columns, textModeDef.rows);
        screenRef.current = screen;

        renderAttributeTextToFramebuffer(screen, font, runtime.video.state.framebuffer, {}, asciiCharMapper);

        const pal = loadPalette(profile.defaultPalette);
        if (pal && runtime.renderer) {
          runtime.video.state.palette = pal.colors;
          runtime.renderer.uploadPalette(paletteToRgba(pal));
        }

        runtime.start();

        const loop = () => {
          if (!runtimeRef.current) return;
          const r = runtimeRef.current;
          if (!r.renderer) { rafRef.current = requestAnimationFrame(loop); return; }
          renderAttributeTextToFramebuffer(screenRef.current, fontRef.current, r.video.state.framebuffer, {}, asciiCharMapper);
          r.video.state.frameNumber++;
          r.renderer.uploadFrame(r.video.state.framebuffer);
          r.renderer.render(r.video.state.frameNumber);
          rafRef.current = requestAnimationFrame(loop);
        };

        loop();
      } else {
        runtime.setMode(currentMode);
        runtime.setCrt(crt);
        runtime.start();

        const profile = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];
        const font = createDefaultFont(8, 8);
        const fb = new Framebuffer(profile.sourceWidth, profile.sourceHeight);

        if (currentMode === 'text') {
          const decoder = new TextModeDecoder(40, 25, 8, 8);
          const screenRam = new Uint8Array(40 * 25);
          const colorRam = new Uint8Array(40 * 25);
          const text = 'HELLO CRT EMULATOR! 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          for (let i = 0; i < screenRam.length; i++) {
            screenRam[i] = text.charCodeAt(i % text.length);
            colorRam[i] = (i % 15) + 1;
          }
          decoder.decode(
            { columns: 40, rows: 25, charWidth: 8, charHeight: 8, screenRam, colorRam, font, backgroundColorIndex: 0 },
            fb.data, 0,
          );
        } else {
          const decoder = new AttributeBitmapDecoder(profile.sourceWidth, profile.sourceHeight);
          const attrCols = 32;
          const attrRows = 24;
          const bitmapSize = profile.sourceWidth * profile.sourceHeight / 8;
          const bitmap = new Uint8Array(bitmapSize);

          for (let y = 0; y < profile.sourceHeight; y++) {
            for (let x = 0; x < profile.sourceWidth; x++) {
              const byteIdx = Math.floor(y * Math.ceil(profile.sourceWidth / 8) + x / 8);
              const bit = (x + y) % 3 !== 0 ? 1 : 0;
              if (bit) bitmap[byteIdx] |= 1 << (7 - (x % 8));
            }
          }

          const attrs = new Uint8Array(attrCols * attrRows);
          for (let i = 0; i < attrs.length; i++) {
            attrs[i] = ((i + 1) % 15) + ((i % 2) << 3);
          }

          decoder.decode(
            { bitmap, attributes: attrs, width: profile.sourceWidth, height: profile.sourceHeight, attrCols, attrRows, borderColorIndex: 0, frameNumber: 0 },
            fb.data, 0,
          );
        }

        runtime.video.state.framebuffer.set(fb.data);

        const loop = () => {
          if (!runtimeRef.current) return;
          const r = runtimeRef.current;
          if (!r.renderer) { rafRef.current = requestAnimationFrame(loop); return; }
          r.renderer.uploadFrame(r.video.state.framebuffer);
          r.renderer.render(r.video.state.frameNumber);
          r.video.state.frameNumber++;
          rafRef.current = requestAnimationFrame(loop);
        };

        loop();
      }
    })();

    const observer = new ResizeObserver(() => runtime.resizeCanvas(canvas));
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      runtime.dispose();
      runtimeRef.current = null;
    };
  }, [profileId, mode]);

  // Update CRT settings independently
  useEffect(() => {
    runtimeRef.current?.setCrt(crt);
  }, [crt]);

  // Pause/resume independently
  useEffect(() => {
    if (!runtimeRef.current) return;
    paused ? runtimeRef.current.pause() : runtimeRef.current.resume();
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block', width: '100%', height: '100%',
        imageRendering: 'pixelated',
      }}
    />
  );
}
