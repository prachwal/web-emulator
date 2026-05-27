import type { BitmapFont } from '../BitmapFont';
import type { AttributeTextScreen } from './AttributeTextScreen';
import type { TextScreen } from './TextScreen';
import type { CharMapper } from './CharMapper';
import { asciiCharMapper } from './CharMapper';
import type { TextRenderOptions } from './TextModeRenderer';
import { renderAttributeTextToFramebuffer } from './TextModeRenderer';

export interface HeadlessInput {
  screen: AttributeTextScreen | TextScreen;
  font: BitmapFont;
  mapper?: CharMapper;
  options?: TextRenderOptions;
  palette?: string[];
  outputRgba?: boolean;
}

export interface HeadlessResult {
  width: number;
  height: number;
  indexed: Uint8Array;
  rgba?: Uint8Array;
}

/**
 * Headless text renderer — no DOM/canvas/WebGL required.
 * Produces a deterministic indexed framebuffer (and optionally RGBA).
 */
export function renderHeadlessText(input: HeadlessInput): HeadlessResult {
  const { font, mapper = asciiCharMapper, options = {}, palette } = input;

  const cellW = font.cellWidth ?? font.charWidth;
  const cellH = font.cellHeight ?? font.charHeight;
  const cols = input.screen.columns;
  const rows = input.screen.rows;
  const width = cols * cellW;
  const height = rows * cellH;

  const indexed = new Uint8Array(width * height);
  renderAttributeTextToFramebuffer(
    input.screen as AttributeTextScreen,
    font,
    indexed,
    options,
    mapper,
  );

  const result: HeadlessResult = { width, height, indexed };

  if (palette && palette.length > 0) {
    const rgba = new Uint8Array(width * height * 4);
    for (let i = 0; i < indexed.length; i++) {
      const idx = indexed[i];
      const hex = idx < palette.length ? palette[idx] : '#000000';
      rgba[i * 4] = parseInt(hex.slice(1, 3), 16);
      rgba[i * 4 + 1] = parseInt(hex.slice(3, 5), 16);
      rgba[i * 4 + 2] = parseInt(hex.slice(5, 7), 16);
      rgba[i * 4 + 3] = 255;
    }
    result.rgba = rgba;
  }

  return result;
}
