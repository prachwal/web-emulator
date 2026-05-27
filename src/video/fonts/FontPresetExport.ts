import type { FontDecodeParams } from './BinaryFontDecoder';

export interface FontExportMeta {
  id: string;
  name: string;
  computer: string;
  sourcePath: string;
  mapperId: 'ascii' | 'petscii';
}

export function validateId(id: string): string | null {
  if (!/^[a-z][a-z0-9_-]*$/.test(id)) {
    return 'ID must start with a letter and contain only lowercase letters, digits, hyphens, underscores';
  }
  return null;
}

export function generateJsonExport(params: FontDecodeParams, meta: FontExportMeta): string {
  const bitOrder = params.bitOrder === 'lsb-first' ? 'lsb-left' : 'msb-left';
  const xBits = params.bitOrder === 'lsb-first'
    ? '[0, 1, 2, 3, 4, 5, 6, 7]'
    : undefined;

  const obj: Record<string, unknown> = {
    id: meta.id,
    name: meta.name,
    url: `/fonts/${meta.computer.toLowerCase()}/${meta.id}.bin`,
    computer: meta.computer,
    description: `${meta.name} font (${params.glyphCount} glyphs, ${params.charWidth}x${params.charHeight})`,
    glyphCount: params.glyphCount,
    charWidth: params.charWidth, charHeight: params.charHeight, bytesPerGlyph: params.bytesPerGlyph, bytesPerRow: params.bytesPerRow,
    cellWidth: params.cellWidth, cellHeight: params.cellHeight,
    bitOrder,
    offset: params.offset,
    mapperId: meta.mapperId,
    sourcePath: meta.sourcePath,
  };
  if (params.invert) obj.invertBits = true;
  if (xBits) obj.xBits = xBits;

  return JSON.stringify(obj, null, 2);
}

export function generateTsExport(params: FontDecodeParams, meta: FontExportMeta): string {
  const err = validateId(meta.id);
  if (err) throw new Error(err);

  const lines: string[] = [];
  lines.push('{');
  lines.push(`  id: '${meta.id}',`);
  lines.push(`  name: '${meta.name}',`);
  lines.push(`  url: '/fonts/${meta.computer.toLowerCase()}/${meta.id}.bin',`);
  lines.push(`  computer: '${meta.computer}',`);
  lines.push(`  description: '${meta.name} font (${params.glyphCount} glyphs, ${params.charWidth}x${params.charHeight})',`);
  lines.push(`  glyphCount: ${params.glyphCount},`);
  lines.push(`  charWidth: ${params.charWidth}, charHeight: ${params.charHeight}, bytesPerGlyph: ${params.bytesPerGlyph}, bytesPerRow: ${params.bytesPerRow},`);
  lines.push(`  cellWidth: ${params.cellWidth}, cellHeight: ${params.cellHeight},`);
  lines.push(`  bitOrder: '${params.bitOrder === 'lsb-first' ? 'lsb-left' : 'msb-left'}', offset: ${params.offset},`);
  lines.push(`  xBits: ${params.bitOrder === 'lsb-first' ? 'lsb8' : 'msb8'},`);
  if (params.invert) lines.push('  invertBits: true,');
  lines.push(`  mapperId: '${meta.mapperId}',`);
  lines.push(`  sourcePath: '${meta.sourcePath}',`);
  lines.push('}');
  return lines.join('\n');
}
