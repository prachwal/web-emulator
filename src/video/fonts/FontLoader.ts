import type { BitmapFont, BitOrder } from '../BitmapFont';
import { loadFontFromBin } from '../BitmapFont';

export type LoadBitmapFontOptions = {
  id: string;
  name: string;
  url: string;
  charWidth?: number;
  charHeight?: number;
  cellWidth?: number;
  cellHeight?: number;
  glyphCount?: number;
  bitOrder?: BitOrder;
  offset?: number;
  bytesPerGlyph?: number;
  xBits?: number[];
  invertBits?: boolean;
  sourcePath?: string;
};

export async function loadBitmapFont(
  options: LoadBitmapFontOptions,
): Promise<BitmapFont> {
  const {
    id, name, url,
    charWidth = 8,
    charHeight = 8,
    cellWidth,
    cellHeight,
    glyphCount = 256,
    bitOrder = 'msb-left',
    offset = 0,
    bytesPerGlyph = charHeight * Math.ceil(charWidth / 8),
    xBits,
    invertBits,
    sourcePath,
  } = options;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Font not found: ${url} (${response.status})`);
  }

  const buf = await response.arrayBuffer();
  const data = new Uint8Array(buf);

  const expectedSize = glyphCount * bytesPerGlyph;

  if (data.length < offset + expectedSize) {
    throw new Error(
      `Font file too small. Expected at least ${offset + expectedSize} bytes, ` +
      `got ${data.length}.`,
    );
  }

  const fontData = offset > 0 ? data.slice(offset, offset + expectedSize) : data;

  return loadFontFromBin(
    id, name, fontData, glyphCount, charWidth, charHeight,
    bitOrder, sourcePath ?? url, xBits, invertBits, cellWidth, cellHeight,
  );
}

export async function loadBitmapFontWithFallback(
  options: LoadBitmapFontOptions,
  fallbacks: string[] = [],
): Promise<BitmapFont> {
  const tryUrls = [options.url, ...fallbacks.map(f => {
    const last = options.url.split('/').pop()!;
    return options.url.replace(last, f);
  })];

  for (const url of tryUrls) {
    try {
      return await loadBitmapFont({ ...options, url });
    } catch {
      continue;
    }
  }

  throw new Error(`Font not found: ${options.url} and no fallbacks worked`);
}
