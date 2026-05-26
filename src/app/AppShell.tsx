import { useState, useCallback } from 'preact/hooks';
import { EmulatorViewport } from './EmulatorViewport';
import { SettingsPanel } from './SettingsPanel';
import { DebugOverlay } from './DebugOverlay';
import type { CrtSettings } from '../core/types';
import { defaultCrtSettings, machineProfiles } from '../core/types';

export function AppShell() {
  const [crt, setCrt] = useState<CrtSettings>(defaultCrtSettings);
  const [showDebug, setShowDebug] = useState(false);
  const [profileId, setProfileId] = useState('zx-spectrum-like');
  const [mode, setMode] = useState('attribute-bitmap');
  const [paused, setPaused] = useState(false);

  const profile = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];

  const handleCrtChange = useCallback((update: Partial<CrtSettings>) => {
    setCrt(prev => ({ ...prev, ...update }));
  }, []);

  const handleProfileChange = useCallback((id: string) => {
    setProfileId(id);
    const p = machineProfiles[id] || machineProfiles['zx-spectrum-like'];
    setMode(p.supportedModes[0]);
  }, []);

  const handlePauseToggle = useCallback(() => {
    setPaused(p => !p);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#111',
      color: '#ccc',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 12px',
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
      }}>
        <h1 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#fff' }}>
          CRT Emulator
        </h1>
        <select
          value={profileId}
          onChange={e => handleProfileChange((e.target as HTMLSelectElement).value)}
          style={selectStyle}
        >
          {Object.entries(machineProfiles).map(([id, p]) => (
            <option key={id} value={id}>{p.name}</option>
          ))}
        </select>
        <select
          value={mode}
          onChange={e => setMode((e.target as HTMLSelectElement).value)}
          style={selectStyle}
        >
          {profile.supportedModes.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button onClick={handlePauseToggle} style={btnStyle}>
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button onClick={() => setShowDebug(s => !s)} style={btnStyle}>
          {showDebug ? 'Hide Debug' : 'Debug'}
        </button>
      </header>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <EmulatorViewport
          crt={crt}
          profileId={profileId}
          mode={mode}
          paused={paused}
        />
      </div>

      <SettingsPanel
        crt={crt}
        onCrtChange={handleCrtChange}
      />

      {showDebug && <DebugOverlay />}
    </div>
  );
}

const selectStyle: Record<string, string> = {
  background: '#222',
  color: '#ccc',
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '12px',
};

const btnStyle: Record<string, string> = {
  background: '#333',
  color: '#ccc',
  border: '1px solid #555',
  borderRadius: '4px',
  padding: '4px 10px',
  fontSize: '12px',
  cursor: 'pointer',
};
