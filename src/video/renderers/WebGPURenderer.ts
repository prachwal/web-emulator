import type { IRenderer, RendererOptions } from './IRenderer';
import type { CrtSettings } from '../../core/types';

export class WebGPURenderer implements IRenderer {
  readonly kind = 'webgpu' as const;

  async initialize(_options: RendererOptions): Promise<void> {
    throw new Error('WebGPU not implemented yet');
  }

  resize(_displayWidth: number, _displayHeight: number, _devicePixelRatio: number): void {
    // noop
  }

  uploadPalette(_palette: Uint8Array): void {
    // noop
  }

  uploadFrame(_framebuffer: Uint8Array): void {
    // noop
  }

  updateCrt(_settings: CrtSettings): void {
    // noop
  }

  render(_frameNumber: number): void {
    // noop
  }

  dispose(): void {
    // noop
  }
}
