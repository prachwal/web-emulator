export interface MonitorDef {
  id: string;
  name: string;
  type: 'crt' | 'lcd' | 'plasma';
  color: 'mono' | 'color';
  phosphor?: 'green' | 'amber' | 'white' | 'rgb';
  sizeInches: number;
  aspectRatio: number;
  parOverride?: number;
  notes: string;
}
