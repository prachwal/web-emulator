/// <reference lib="webworker" />

import type { MainToWorkerMessage, WorkerToMainMessage } from './WorkerProtocol';
import { deserializeFont } from './WorkerProtocol';
import { EmulatorRuntime } from '../core/EmulatorRuntime';

let runtime: EmulatorRuntime | null = null;
let canvas: OffscreenCanvas | null = null;
let animFrameId: number | null = null;

self.onmessage = (e: MessageEvent<MainToWorkerMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'init': {
      runtime = new EmulatorRuntime(msg.config.profile.id);
      if (msg.config.crt) runtime.setCrt(msg.config.crt);
      if (msg.config.mode) runtime.setMode(msg.config.mode);

      if (msg.canvas) {
        canvas = msg.canvas;
        runtime.initCanvas(canvas).then(() => {
          postMessage({ type: 'ready', renderer: runtime!.renderer?.kind ?? 'none' });
        });
      } else {
        postMessage({ type: 'ready', renderer: 'none' });
      }
      runtime.start();
      startLoop();
      break;
    }

    case 'resize': {
      if (canvas) {
        canvas.width = Math.round(msg.width * msg.dpr);
        canvas.height = Math.round(msg.height * msg.dpr);
        runtime?.resizeCanvas(canvas);
      }
      break;
    }

    case 'set-crt': {
      runtime?.setCrt(msg.settings);
      break;
    }

    case 'load-font': {
      const font = deserializeFont(msg.font);
      runtime?.setFont(font);
      break;
    }

    case 'load-palette': {
      runtime?.loadPalette('zx-spectrum');
      break;
    }

    case 'set-mode': {
      runtime?.setMode(msg.mode);
      break;
    }

    case 'key-down':
    case 'key-up':
      break;

    case 'pause':
      runtime?.pause();
      stopLoop();
      break;

    case 'resume':
      runtime?.resume();
      startLoop();
      break;

    case 'step-frame':
      runtime?.stepFrame(msg.memory);
      break;

    case 'tick':
      runtime?.tick(msg.timestamp);
      break;
  }
};

function startLoop(): void {
  if (animFrameId !== null) return;
  const loop = (timestamp: number) => {
    if (!runtime || runtime.paused) {
      animFrameId = null;
      return;
    }
    runtime.tick(timestamp);
    animFrameId = self.requestAnimationFrame?.(loop) ?? 0;
    if (!animFrameId) {
      setTimeout(() => loop(performance.now()), 16);
    }
  };
  animFrameId = self.requestAnimationFrame?.(loop) ?? 0;
}

function stopLoop(): void {
  if (animFrameId !== null) {
    if (self.cancelAnimationFrame) {
      self.cancelAnimationFrame(animFrameId);
    }
    animFrameId = null;
  }
}
