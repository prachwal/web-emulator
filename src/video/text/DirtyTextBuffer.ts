import { AttributeTextScreen } from './AttributeTextScreen';
import type { BitmapFont } from '../BitmapFont';
import type { CharMapper } from './CharMapper';
import { asciiCharMapper } from './CharMapper';
import type { TextRenderOptions } from './TextModeRenderer';
import { renderGlyphToFramebuffer } from './TextModeRenderer';

/**
 * Tracks which cells have changed and only rerenders dirty cells.
 * Falls back to full render when font/palette/mode changes.
 */
export class DirtyTextBuffer {
  prevScreen: AttributeTextScreen | null = null;
  prevFontId: string = '';
  prevMapperId: string = '';
  private dirty: Set<number> = new Set();

  /** Call when screen content changes to mark changed cells */
  private snapshot: { chars: Uint8Array; fg: Uint8Array; bg: Uint8Array } | null = null;

  markDirty(screen: AttributeTextScreen): void {
    const size = screen.columns * screen.rows;
    if (!this.snapshot ||
        this.snapshot.chars.length !== size) {
      // Full dirty
      for (let i = 0; i < size; i++) this.dirty.add(i);
      this.snapshot = { chars: new Uint8Array(screen.chars), fg: new Uint8Array(screen.foreground), bg: new Uint8Array(screen.background) };
      return;
    }
    for (let i = 0; i < size; i++) {
      if (this.snapshot.chars[i] !== screen.chars[i] ||
          this.snapshot.fg[i] !== screen.foreground[i] ||
          this.snapshot.bg[i] !== screen.background[i]) {
        this.dirty.add(i);
      }
    }
    this.snapshot.chars.set(screen.chars);
    this.snapshot.fg.set(screen.foreground);
    this.snapshot.bg.set(screen.background);
  }

  /** Renders only dirty cells into framebuffer */
  render(
    screen: AttributeTextScreen,
    font: BitmapFont,
    framebuffer: Uint8Array,
    options: TextRenderOptions = {},
    mapper: CharMapper = asciiCharMapper,
  ): boolean {
    if (this.prevFontId !== font.id || this.prevMapperId !== mapper.id) {
      // Font or mapper changed -> full render
      for (let i = 0; i < screen.columns * screen.rows; i++) this.dirty.add(i);
      this.prevFontId = font.id;
      this.prevMapperId = mapper.id;
    }

    if (this.dirty.size === 0) return false; // nothing changed

    const cellW = font.cellWidth ?? font.charWidth;
    const cellH = font.cellHeight ?? font.charHeight;
    const outputWidth = screen.columns * cellW;
    const outputHeight = screen.rows * cellH;

    for (const cellIdx of this.dirty) {
      const row = Math.floor(cellIdx / screen.columns);
      const col = cellIdx % screen.columns;
      let charCode = mapper.mapCharCode(screen.chars[cellIdx]);
      const invertCell = !!(options.invertMsb && charCode >= 128);
      if (invertCell) charCode &= 0x7f;

      let fgColor = screen.foreground[cellIdx];
      let bgColor = screen.background[cellIdx];
      if (options.invert) { const t = fgColor; fgColor = bgColor; bgColor = t; }

      renderGlyphToFramebuffer(
        font, charCode, framebuffer,
        outputWidth, outputHeight,
        col * cellW, row * cellH,
        fgColor, bgColor,
      );
    }
    this.dirty.clear();
    return true;
  }
}
