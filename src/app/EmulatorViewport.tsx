import { useRef, useEffect } from 'preact/hooks';
import type { CrtSettings } from '../core/types';
import { EmulatorRuntime } from '../core/EmulatorRuntime';
import { Framebuffer } from '../video/Framebuffer';
import { loadPalette, paletteToRgba } from '../video/Palette';
import { TextModeDecoder } from '../video/modes/TextModeDecoder';
import { AttributeBitmapDecoder } from '../video/modes/AttributeBitmapDecoder';
import { createDefaultFont } from '../video/BitmapFont';
import { machineProfiles } from '../core/types';

export interface EmulatorViewportProps {
  crt: CrtSettings;
  profileId: string;
  mode: string;
  paused: boolean;
}

export function EmulatorViewport({ crt, profileId, mode, paused }: EmulatorViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<EmulatorRuntime | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const runtime = new EmulatorRuntime(profileId);
    runtimeRef.current = runtime;

    runtime.initCanvas(canvas).then(() => {
      runtime.setMode(mode);
      runtime.setCrt(crt);
      runtime.start();

      const profile = runtime.config.profile;
      const palette = loadPalette(profile.defaultPalette);
      const font = createDefaultFont(8, 8);
      const fb = new Framebuffer(profile.sourceWidth, profile.sourceHeight);

      if (profile.supportedModes[0] === 'text') {
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
        const attrWidth = Math.ceil(profile.sourceWidth / attrCols);
        const attrHeight = Math.ceil(profile.sourceHeight / attrRows);
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
        if (!r.renderer) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        r.renderer.uploadFrame(r.video.state.framebuffer);
        r.renderer.render(r.video.state.frameNumber);
        r.video.state.frameNumber++;
        rafRef.current = requestAnimationFrame(loop);
      };

      loop();
    });

    const observer = new ResizeObserver(() => {
      runtime.resizeCanvas(canvas);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      runtime.dispose();
      runtimeRef.current = null;
    };
  }, [profileId]);

  useEffect(() => {
    if (runtimeRef.current) {
      runtimeRef.current.setCrt(crt);
    }
  }, [crt]);

  useEffect(() => {
    if (runtimeRef.current) {
      runtimeRef.current.setMode(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (!runtimeRef.current) return;
    if (paused) {
      runtimeRef.current.pause();
    } else {
      runtimeRef.current.resume();
    }
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
      }}
    />
  );
}
