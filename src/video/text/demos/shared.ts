import { AttributeTextScreen } from '../AttributeTextScreen';

export function bar(cols: number, chr = '-'): string {
  return '+' + chr.repeat(Math.max(0, cols - 2)) + '+';
}

export function spacer(cols: number, label: string): string {
  const inner = '| ' + label + ' '.repeat(Math.max(0, cols - label.length - 4)) + '|';
  return inner;
}

export function colorRow(s: AttributeTextScreen, x: number, y: number, start: number, count: number, bg: number): void {
  for (let i = 0; i < count && x + i < s.columns; i++) {
    s.writeText(x + i, y, `${(start + i) % 16}`, (start + i) % 16, bg);
  }
}

export const commodoreGraphics = [
  192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,
];
