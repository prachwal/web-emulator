import { AttributeTextScreen } from './AttributeTextScreen';

export interface DemoScriptLine {
  text: string;
  x?: number;
  y: number;
  fg?: number;
  bg?: number;
}

export interface DemoScript {
  machine: string;
  mode: 'text' | 'bitmap';
  cols: number;
  rows: number;
  lines: DemoScriptLine[];
}

export function loadDemoScript(script: DemoScript): AttributeTextScreen {
  const screen = new AttributeTextScreen(script.cols, script.rows);
  screen.clear(32, 7, 0);
  for (const line of script.lines) {
    screen.writeText(line.x ?? 0, line.y, line.text, line.fg ?? 7, line.bg ?? 0);
  }
  return screen;
}

export function demoScriptFromJson(json: string): DemoScript {
  return JSON.parse(json) as DemoScript;
}
