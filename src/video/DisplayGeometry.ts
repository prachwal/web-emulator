export interface VideoModeDefinition {
  id: string;
  width: number;
  height: number;
  refreshRate: number;
  pixelAspectRatio: number;
  recommendedDisplayAspectRatio: number;
}

export interface DisplayGeometry {
  sourceWidth: number;
  sourceHeight: number;
  pixelAspectRatio: number;
  integerScale: boolean;
  overscanX: number;
  overscanY: number;
  zoom: number;
}

export interface Viewport {
  scale: number;
  logicalWidth: number;
  logicalHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  offsetX: number;
  offsetY: number;
}

export function computeViewport(
  geometry: DisplayGeometry,
  canvasWidth: number,
  canvasHeight: number,
): Viewport {
  const logicalWidth = geometry.sourceWidth * geometry.pixelAspectRatio;
  const logicalHeight = geometry.sourceHeight;

  let scale: number;
  if (geometry.integerScale) {
    scale = Math.max(1, Math.floor(Math.min(
      canvasWidth / logicalWidth,
      canvasHeight / logicalHeight,
    )));
  } else {
    scale = Math.min(
      canvasWidth / logicalWidth,
      canvasHeight / logicalHeight,
    );
  }
  scale *= geometry.zoom;

  const viewportWidth = Math.round(logicalWidth * scale);
  const viewportHeight = Math.round(logicalHeight * scale);
  const offsetX = Math.floor((canvasWidth - viewportWidth) / 2);
  const offsetY = Math.floor((canvasHeight - viewportHeight) / 2);

  return { scale, logicalWidth, logicalHeight, viewportWidth, viewportHeight, offsetX, offsetY };
}

export function videoModeToGeometry(
  def: VideoModeDefinition,
  integerScale: boolean = true,
  overscanX: number = 0,
  overscanY: number = 0,
): DisplayGeometry {
  return {
    sourceWidth: def.width,
    sourceHeight: def.height,
    pixelAspectRatio: def.pixelAspectRatio,
    integerScale,
    overscanX,
    overscanY,
    zoom: 1,
  };
}

export const videoModeDefinitions: Record<string, VideoModeDefinition> = {
  'bitmap-320x200': {
    id: 'bitmap-320x200',
    width: 320,
    height: 200,
    refreshRate: 50,
    pixelAspectRatio: 5 / 6,
    recommendedDisplayAspectRatio: 4 / 3,
  },
  'text-320x200': {
    id: 'text-320x200',
    width: 320,
    height: 200,
    refreshRate: 50,
    pixelAspectRatio: 5 / 6,
    recommendedDisplayAspectRatio: 4 / 3,
  },
  'bitmap-256x192': {
    id: 'bitmap-256x192',
    width: 256,
    height: 192,
    refreshRate: 50,
    pixelAspectRatio: 1,
    recommendedDisplayAspectRatio: 4 / 3,
  },
  'text-256x192': {
    id: 'text-256x192',
    width: 256,
    height: 192,
    refreshRate: 50,
    pixelAspectRatio: 1,
    recommendedDisplayAspectRatio: 4 / 3,
  },
  'bitmap-320x240': {
    id: 'bitmap-320x240',
    width: 320,
    height: 240,
    refreshRate: 60,
    pixelAspectRatio: 1,
    recommendedDisplayAspectRatio: 4 / 3,
  },
};

export function getDefinitionForMode(mode: string, sourceWidth: number, sourceHeight: number): VideoModeDefinition {
  const key = `${mode}-${sourceWidth}x${sourceHeight}`;
  return videoModeDefinitions[key] ?? {
    id: key,
    width: sourceWidth,
    height: sourceHeight,
    refreshRate: 50,
    pixelAspectRatio: 1,
    recommendedDisplayAspectRatio: sourceWidth / sourceHeight,
  };
}
