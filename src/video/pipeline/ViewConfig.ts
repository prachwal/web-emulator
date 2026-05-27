export interface ViewConfigExport {
  version: number;
  computer: string;
  machineId: string;
  presetId: string;
  monitorId: string;
  displayProfileId: string;
  parMultiplier: number;
  zoom: number;
  screenMode: 'real' | 'demo';
  shiftLock: boolean;
  showBorder: boolean;
}

export function exportViewConfig(params: {
  computer: string; machineId: string; presetId: string; monitorId: string;
  displayProfileId: string; parMultiplier: number; zoom: number;
  screenMode: 'real' | 'demo'; shiftLock: boolean; showBorder: boolean;
}): string {
  const cfg: ViewConfigExport = { version: 1, ...params };
  return JSON.stringify(cfg, null, 2);
}

export function importViewConfig(json: string): ViewConfigExport | null {
  try {
    const obj = JSON.parse(json) as ViewConfigExport;
    if (obj.version !== 1) return null;
    return obj;
  } catch { return null; }
}
