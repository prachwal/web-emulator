import { useState, useCallback } from 'preact/hooks';
import { EmulatorViewport } from './EmulatorViewport';
import { SettingsPanel } from './SettingsPanel';
import { DebugOverlay } from './DebugOverlay';
import type { CrtSettings } from '../core/types';
import { defaultCrtSettings, machineProfiles } from '../core/types';
import { textVideoModes } from '../video/text/textModes';
import { fontPresets, fontComputerList } from '../video/fonts/fontPresets';

export function AppShell() {
  const [crt, setCrt] = useState<CrtSettings>(defaultCrtSettings);
  const [showDebug, setShowDebug] = useState(false);
  const [profileId, setProfileId] = useState('zx-spectrum-like');
  const [mode, setMode] = useState('attribute-bitmap');
  const [paused, setPaused] = useState(false);
  const [activeFontId, setActiveFontId] = useState('c64-chargen');
  const [showTextModes, setShowTextModes] = useState(false);

  const profile = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];
  const isTextMode = mode === 'attribute-text' || mode.startsWith('text-');

  const handleCrtChange = useCallback((update: Partial<CrtSettings>) => {
    setCrt(prev => ({ ...prev, ...update }));
  }, []);

  const handleProfileChange = useCallback((id: string) => {
    setProfileId(id);
    const p = machineProfiles[id] || machineProfiles['zx-spectrum-like'];
    setMode(p.supportedModes[0]);
    setShowTextModes(false);
  }, []);

  const handleModeChange = useCallback((m: string) => {
    setMode(m);
    setShowTextModes(m === 'attribute-text');
  }, []);

  const handlePauseToggle = useCallback(() => {
    setPaused(p => !p);
  }, []);

  const handleFontChange = useCallback((fontId: string) => {
    setActiveFontId(fontId);
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
        gap: '8px',
        padding: '4px 10px',
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
        flexWrap: 'wrap',
      }}>
        <h1 style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>
          CRT
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

        {!isTextMode && (
          <select
            value={mode}
            onChange={e => handleModeChange((e.target as HTMLSelectElement).value)}
            style={selectStyle}
          >
            {profile.supportedModes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}

        {isTextMode && (
          <select
            value={mode}
            onChange={e => handleModeChange((e.target as HTMLSelectElement).value)}
            style={selectStyle}
          >
            {textVideoModes.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        )}

        {showTextModes && (
          <>
            <select
              value={activeFontId}
              onChange={e => handleFontChange((e.target as HTMLSelectElement).value)}
              style={selectStyle}
            >
              {fontPresets.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowTextModes(s => !s)}
              style={{ ...btnStyle, background: isTextMode ? '#333' : '#222' }}
            >
              {isTextMode ? 'Font ✓' : 'Font'}
            </button>
          </>
        )}

        <button onClick={() => setShowTextModes(true)} style={{
          ...btnStyle,
          background: isTextMode ? '#2a4' : '#333',
          color: isTextMode ? '#000' : '#ccc',
        }}>
          Text
        </button>

        <button onClick={handlePauseToggle} style={btnStyle}>
          {paused ? '▶' : '⏸'}
        </button>

        <button onClick={() => setShowDebug(s => !s)} style={btnStyle}>
          {showDebug ? 'Dbg' : 'Debug'}
        </button>
      </header>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <EmulatorViewport
          crt={crt}
          profileId={profileId}
          mode={mode}
          paused={paused}
          activeFontId={isTextMode ? activeFontId : undefined}
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
  borderRadius: '3px',
  padding: '3px 6px',
  fontSize: '11px',
  maxWidth: '160px',
};

const btnStyle: Record<string, string> = {
  background: '#333',
  color: '#ccc',
  border: '1px solid #555',
  borderRadius: '3px',
  padding: '3px 8px',
  fontSize: '11px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};
