export interface MachineKeyEvent {
  machineId: string;
  keyCode: string;
  pressed: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
}

export interface KeyboardMapper {
  machineId: string;
  mapBrowserKey(event: KeyboardEvent): MachineKeyEvent | null;
}

const defaultMapping: Record<string, string> = {
  ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
  Enter: 'RETURN', Escape: 'ESC', Backspace: 'DELETE', Tab: 'TAB',
  ShiftLeft: 'SHIFT', ShiftRight: 'SHIFT', ControlLeft: 'CTRL', ControlRight: 'CTRL',
  AltLeft: 'ALT', AltRight: 'ALT', Space: 'SPACE',
};

export class BrowserKeyboardMapper implements KeyboardMapper {
  machineId: string;

  constructor(machineId: string) {
    this.machineId = machineId;
  }

  mapBrowserKey(event: KeyboardEvent): MachineKeyEvent | null {
    const keyCode = defaultMapping[event.code] ?? (event.key.length === 1 ? event.key.toUpperCase() : event.code);
    return {
      machineId: this.machineId,
      keyCode,
      pressed: event.type === 'keydown',
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
    };
  }
}
