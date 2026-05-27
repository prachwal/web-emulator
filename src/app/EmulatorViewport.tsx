import { useRef, useEffect } from 'preact/hooks';
import type { CrtSettings } from '../core/types';
import { EmulatorRuntime } from '../core/EmulatorRuntime';
import { paletteToRgbaBytes, paletteToMonochrome } from '../video/Palette';
import { createDefaultFont } from '../video/BitmapFont';
import { loadBitmapFont } from '../video/fonts/FontLoader';
import { globalFontRegistry } from '../video/fonts/FontRegistry';
import { getFontPreset, getMapperIdForFont } from '../video/fonts/fontPresets';
import type { Preset } from '../video/presets/index';
import { createDemoForMachine } from '../video/text/DemoTextScene';
import { renderAttributeTextToFramebuffer } from '../video/text/TextModeRenderer';
import { getMapper } from '../video/text/CharMapper';
import { loadImage, imageToIndexedFramebuffer } from '../video/image/ImageLoader';
import { displaySettings, parseHexColor } from './DisplaySettings';
import { getMonitor } from '../video/monitors/index';
import { createBootScreenForMachine } from '../video/text/BootScreenScene';
import { diagSignal, updateDiagFps } from './DebugOverlay';

export interface EmulatorViewportProps {
  crt: CrtSettings;
  preset: Preset;
  paused: boolean;
  activeFontId?: string;
  monitorId?: string;
  screenMode?: 'real' | 'demo';
  shiftLock?: boolean;
}

export function EmulatorViewport({ crt, preset, paused, activeFontId, monitorId, screenMode = 'demo', shiftLock = false }: EmulatorViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<EmulatorRuntime | null>(null);
  const rafRef = useRef<number>(0);
  const fontRef = useRef(createDefaultFont(8, 8));
  const screenRef = useRef(createDemoForMachine('generic', 40, 25));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const runtime = new EmulatorRuntime('zx-spectrum-like');
    runtimeRef.current = runtime;

    (async () => {
      await runtime.initCanvas(canvas, {
        sourceWidth: preset.framebufferWidth,
        sourceHeight: preset.framebufferHeight,
        pixelAspectRatio: preset.pixelAspectRatio,
      });
      if (runtime.renderer && preset.borderColor) {
        runtime.renderer.setBorderColor(parseHexColor(preset.borderColor));
      }
      const ds = displaySettings.value;
      if (!ds.showBorder && runtime.renderer) {
        runtime.renderer.setBorderColor([0, 0, 0]);
      }
      if (runtime.renderer) {
        runtime.renderer.setScaling(ds.parMultiplier, ds.scaleMode === 'integer');
        runtime.renderer.setZoom(ds.zoom);
      }
      let palette = preset.palette;
      if (monitorId) {
        const mon = getMonitor(monitorId);
        if (mon && mon.color === 'mono' && mon.phosphor && mon.phosphor !== 'rgb') {
          palette = paletteToMonochrome(palette, mon.phosphor);
        }
      }
      runtime.renderer?.uploadPalette(paletteToRgbaBytes(palette));
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

        const baseMapperId = activeFontId ? getMapperIdForFont(activeFontId) : 'ascii';
        const mapper = shiftLock && baseMapperId === 'petscii' ? getMapper('petscii-shifted') : getMapper(baseMapperId);

        const screen = screenMode === 'real'
          ? createBootScreenForMachine(preset.machineId, preset.cols)
          : createDemoForMachine(preset.machineId, preset.cols, preset.rows);
        screenRef.current = screen;

        const textOpts: {
  invertMsb?: boolean; flashPhase?: boolean; frameNumber?: number; zxAttr?: Uint8Array;
} = { invertMsb: preset.machineId === 'apple1' };
if (preset.machineId === 'zx' || preset.machineId === 'zx128') {
  textOpts.zxAttr = screen.foreground; // reuse foreground as attr byte
  textOpts.frameNumber = 0;
}
        renderAttributeTextToFramebuffer(screen, font, runtime.video.state.framebuffer, textOpts, mapper);

        runtime.start();

        const loop = () => {
          if (!runtimeRef.current) return;
          const r = runtimeRef.current;
          if (!r.renderer) { rafRef.current = requestAnimationFrame(loop); return; }
          if (r.paused) { rafRef.current = requestAnimationFrame(loop); return; }
          updateDiagFps();
          diagSignal.value = { ...diagSignal.value,
            rendererKind: r.renderer.kind,
            sourceW: r.video.state.sourceWidth, sourceH: r.video.state.sourceHeight,
            par: preset.pixelAspectRatio, zoom: 0.9,
            dpr: globalThis.devicePixelRatio || 1,
            fontId: fontRef.current?.id ?? '', machineName: preset.machineName,
          };
          const baseMid = activeFontId ? getMapperIdForFont(activeFontId) : 'ascii';
          const loopMapper = shiftLock && baseMid === 'petscii' ? getMapper('petscii-shifted') : getMapper(baseMid);
          const fb = r.video.state.framebuffer;
          textOpts.frameNumber = r.video.state.frameNumber;
          renderAttributeTextToFramebuffer(screenRef.current, fontRef.current, fb, textOpts, loopMapper);
          r.video.state.frameNumber++;
          r.renderer.uploadFrame(fb);
          r.renderer.render(r.video.state.frameNumber);
          rafRef.current = requestAnimationFrame(loop);
        };

        loop();
      } else {
        try {
          const img = await loadImage('/tukan-wielki.jpg');
          const indexed = imageToIndexedFramebuffer(img, fw, fh, preset.palette);
          runtime.video.state.framebuffer.set(indexed);
        } catch {
          runtime.video.state.framebuffer.fill(0);
        }

        runtime.start();

        const loop = () => {
          if (!runtimeRef.current) return;
          const r = runtimeRef.current;
          if (!r.renderer) { rafRef.current = requestAnimationFrame(loop); return; }
          if (r.paused) { rafRef.current = requestAnimationFrame(loop); return; }
          updateDiagFps();
          diagSignal.value = { ...diagSignal.value,
            rendererKind: r.renderer.kind,
            sourceW: r.video.state.sourceWidth, sourceH: r.video.state.sourceHeight,
            par: preset.pixelAspectRatio, zoom: 0.9,
            dpr: globalThis.devicePixelRatio || 1,
            fontId: fontRef.current?.id ?? '', machineName: preset.machineName,
          };
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
    }, [preset, activeFontId, screenMode, shiftLock]);

  useEffect(() => {
    const r = runtimeRef.current;
    if (!r?.renderer) return;
    let palette = preset.palette;
    if (monitorId) {
      const mon = getMonitor(monitorId);
      if (mon && mon.color === 'mono' && mon.phosphor && mon.phosphor !== 'rgb') {
        palette = paletteToMonochrome(palette, mon.phosphor);
      }
    }
    r.renderer.uploadPalette(paletteToRgbaBytes(palette));
  }, [monitorId, preset]);

  useEffect(() => {
    const r = runtimeRef.current;
    if (!r?.renderer) return;
    const ds = displaySettings.value;
    r.renderer.setScaling(ds.parMultiplier, ds.scaleMode === 'integer');
    r.renderer.setZoom(ds.zoom);
    const borderClr = ds.showBorder && preset.borderColor
      ? parseHexColor(preset.borderColor)
      : [0, 0, 0] as [number, number, number];
    r.renderer.setBorderColor(borderClr);
  }, [displaySettings.value, preset]);

  useEffect(() => {
    runtimeRef.current?.setCrt(crt);
  }, [crt]);

  useEffect(() => {
    if (!runtimeRef.current) return;
    paused ? runtimeRef.current.pause() : runtimeRef.current.resume();
  }, [paused]);

  return <canvas ref={canvasRef} />;
}
