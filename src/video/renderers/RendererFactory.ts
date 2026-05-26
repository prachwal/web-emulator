import type { IRenderer, RendererOptions } from './IRenderer';
import { WebGL2Renderer } from './WebGL2Renderer';
import { Canvas2DRenderer } from './Canvas2DRenderer';
import type { CrtSettings } from '../../core/types';

export async function createRenderer(options: {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  sourceWidth: number;
  sourceHeight: number;
  crt: CrtSettings;
  preferred?: 'auto' | 'webgl2' | 'webgpu' | 'canvas2d';
}): Promise<IRenderer> {
  if (options.preferred === 'canvas2d') {
    return createCanvas2D(options);
  }

  if (options.preferred === 'webgl2' || options.preferred === 'auto' || !options.preferred) {
    try {
      return createWebGL2(options);
    } catch (e) {
      if (options.preferred === 'webgl2') throw e;
    }
  }

  if (options.preferred === 'webgpu') {
    if ('gpu' in navigator) {
      try {
        const { WebGPURenderer } = await import('./WebGPURenderer');
        const renderer = new WebGPURenderer();
        await renderer.initialize(options as RendererOptions);
        return renderer;
      } catch {
        throw new Error('WebGPU not available');
      }
    }
    throw new Error('WebGPU not supported');
  }

  return createCanvas2D(options);
}

function createWebGL2(options: {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  sourceWidth: number;
  sourceHeight: number;
  crt: CrtSettings;
}): IRenderer {
  const renderer = new WebGL2Renderer();
  renderer.initialize({
    canvas: options.canvas,
    sourceWidth: options.sourceWidth,
    sourceHeight: options.sourceHeight,
    crt: options.crt,
  });
  return renderer;
}

function createCanvas2D(options: {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  sourceWidth: number;
  sourceHeight: number;
  crt: CrtSettings;
}): IRenderer {
  const renderer = new Canvas2DRenderer();
  renderer.initialize({
    canvas: options.canvas,
    sourceWidth: options.sourceWidth,
    sourceHeight: options.sourceHeight,
    crt: options.crt,
  });
  return renderer;
}
