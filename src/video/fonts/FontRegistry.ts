import type { BitmapFont } from '../BitmapFont';

export class FontRegistry {
  private readonly fonts = new Map<string, BitmapFont>();

  register(font: BitmapFont): void {
    this.fonts.set(font.id, font);
  }

  get(id: string): BitmapFont | undefined {
    return this.fonts.get(id);
  }

  has(id: string): boolean {
    return this.fonts.has(id);
  }

  list(): BitmapFont[] {
    return Array.from(this.fonts.values());
  }

  remove(id: string): void {
    this.fonts.delete(id);
  }

  clear(): void {
    this.fonts.clear();
  }
}

export const globalFontRegistry = new FontRegistry();
