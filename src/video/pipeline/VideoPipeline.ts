import type { FrameSource, DisplayOutput } from './FrameSource';

export type PipelineStage = 'source' | 'palette' | 'border' | 'signal' | 'crt' | 'output';

export class VideoPipeline {
  stages: PipelineStage[] = ['source', 'palette', 'border', 'signal', 'crt', 'output'];
  enabled: Record<PipelineStage, boolean> = {
    source: true, palette: true, border: true, signal: true, crt: true, output: true,
  };

  constructor(public output: DisplayOutput) {}

  setStage(stage: PipelineStage, enabled: boolean): void {
    this.enabled[stage] = enabled;
  }

  get effectiveWidth(): number {
    const b = this.output.border;
    return b ? this.output.source.width - b.left - b.right : this.output.source.width;
  }
  get effectiveHeight(): number {
    const b = this.output.border;
    return b ? this.output.source.height - b.top - b.bottom : this.output.source.height;
  }
}
