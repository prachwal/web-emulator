import { describe, it, expect } from 'vitest';
import { loadDemoScript, demoScriptFromJson } from '../video/text/DemoScript';

describe('DemoScript', () => {
  it('loads demo script from JSON', () => {
    const json = JSON.stringify({
      machine: 'zx',
      mode: 'text',
      cols: 32, rows: 24,
      lines: [{ text: 'HELLO', y: 0, fg: 7 }, { text: 'WORLD', y: 1, fg: 6 }],
    });
    const script = demoScriptFromJson(json);
    expect(script.machine).toBe('zx');
    expect(script.lines.length).toBe(2);
  });

  it('renders script to AttributeTextScreen', () => {
    const screen = loadDemoScript({
      machine: 'test', mode: 'text', cols: 10, rows: 5,
      lines: [{ text: 'HELLO', y: 0, fg: 7 }],
    });
    expect(screen.columns).toBe(10);
    expect(screen.rows).toBe(5);
  });
});
