import { useRef, useEffect } from 'preact/hooks';
import type { CrtSettings } from '../core/types';
import { EmulatorRuntime } from '../core/EmulatorRuntime';
import { Framebuffer } from '../video/Framebuffer';
import { loadPalette, paletteToRgba } from '../video/Palette';
import { TextModeDecoder } from '../video/modes/TextModeDecoder';
import { AttributeBitmapDecoder } from '../video/modes/AttributeBitmapDecoder';
import { createDefaultFont } from '../video/BitmapFont';
import { loadBitmapFont } from '../video/fonts/FontLoader';
import { globalFontRegistry } from '../video/fonts/FontRegistry';
import { fontPresets, getFontPreset } from '../video/fonts/fontPresets';
import type { Preset } from '../video/presets';
import { createDemoTextScreen } from '../video/text/DemoTextScene';
import { renderAttributeTextToFramebuffer } from '../video/text/TextModeRenderer';
import { asciiCharMapper } from '../video/text/CharMapper';

export interface EmulatorViewportProps {
  crt: CrtSettings;
  preset: Preset;
  paused: boolean;
  activeFontId?: string;
}

export function EmulatorViewport({ crt, preset, paused, activeFontId }: EmulatorViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<EmulatorRuntime | null>(null);
  const rafRef = useRef<number>(0);
  const fontRef = useRef(createDefaultFont(8, 8));
  const screenRef = useRef(createDemoTextScreen(40, 25));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const runtime = new EmulatorRuntime('zx-spectrum-like');
    runtimeRef.current = runtime;

    (async () => {
      await runtime.initCanvas(canvas);
      const isText = preset.type === 'text';
      const fw = preset.framebufferWidth;
      const fh = preset.framebufferHeight;

      if (runtime.video.state.framebuffer.length !== fw * fh) {
        runtime.video.state.framebuffer = new Uint8Array(fw * fh);
      }
      runtime.video.state.sourceWidth = fw;
      runtime.video.state.sourceHeight = fh;

      if (isText) {
        let font = createDefaultFont(preset.charWidth, preset.charHeight);
        if (activeFontId) {
          const cached = globalFontRegistry.get(activeFontId);
          if (cached) {
            font = cached;
          } else {
            const fp = getFontPreset(activeFontId);
            if (fp) {
              try {
                font = await loadBitmapFont(fp);
                globalFontRegistry.register(font);
              } catch { /* keep default */ }
            }
          }
        }
        fontRef.current = font;

        const screen = createDemoTextScreen(preset.cols, preset.rows);
        screenRef.current = screen;

        renderAttributeTextToFramebuffer(screen, font, runtime.video.state.framebuffer, {}, asciiCharMapper);

        const pal = loadPalette('zx-spectrum');
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
        const fb = new Framebuffer(fw, fh);

        if (preset.videoMode === 'attribute-bitmap' || !preset.videoMode) {
          const decoder = new AttributeBitmapDecoder(fw, fh);
          const attrCols = 32;
          const attrRows = 24;
          const bitmapSize = fw * fh / 8;
          const bitmap = new Uint8Array(bitmapSize);

          for (let y = 0; y < fh; y++) {
            for (let x = 0; x < fw; x++) {
              const byteIdx = Math.floor(y * Math.ceil(fw / 8) + x / 8);
              const bit = (x + y) % 3 !== 0 ? 1 : 0;
              if (bit) bitmap[byteIdx] |= 1 << (7 - (x % 8));
            }
          }

          const attrs = new Uint8Array(attrCols * attrRows);
          for (let i = 0; i < attrs.length; i++) {
            attrs[i] = ((i + 1) % 15) + ((i % 2) << 3);
          }

          decoder.decode(
            { bitmap, attributes: attrs, width: fw, height: fh, attrCols, attrRows, borderColorIndex: 0, frameNumber: 0 },
            fb.data, 0,
          );
        } else {
          const decoder = new TextModeDecoder(40, 25, 8, 8);
          const screenRam = new Uint8Array(40 * 25);
          const colorRam = new Uint8Array(40 * 25);
          const text = 'HELLO CRT EMULATOR! 0123456789';
          for (let i = 0; i < screenRam.length; i++) {
            screenRam[i] = text.charCodeAt(i % text.length);
            colorRam[i] = (i % 15) + 1;
          }
          decoder.decode(
            { columns: 40, rows: 25, charWidth: 8, charHeight: 8, screenRam, colorRam, font: createDefaultFont(8, 8), backgroundColorIndex: 0 },
            fb.data, 0,
          );
        }

        runtime.video.state.framebuffer.set(fb.data);
        runtime.start();

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
  }, [preset, activeFontId]);

  useEffect(() => {
    runtimeRef.current?.setCrt(crt);
  }, [crt]);

  useEffect(() => {
    if (!runtimeRef.current) return;
    paused ? runtimeRef.current.pause() : runtimeRef.current.resume();
  }, [paused]);

  return <canvas ref={canvasRef} />;
}
