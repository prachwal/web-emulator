import { useState, useCallback } from 'preact/hooks';
import { EmulatorViewport } from './EmulatorViewport';
import { SettingsPanel } from './SettingsPanel';
import { DebugOverlay } from './DebugOverlay';
import type { CrtSettings, VideoMode } from '../core/types';
import { defaultCrtSettings, machineProfiles } from '../core/types';
import { textVideoModes } from '../video/text/textModes';
import { fontPresets } from '../video/fonts/fontPresets';

function defaultTextModeForProfile(profileId: string): string {
  if (profileId.includes('c64') || profileId.includes('cga')) return 'text-40x25';
  if (profileId.includes('trs80')) return 'text-64x16';
  if (profileId.includes('vic')) return 'text-22x23';
  return 'text-32x24';
}

export function AppShell() {
  const [crt, setCrt] = useState<CrtSettings>(defaultCrtSettings);
  const [showDebug, setShowDebug] = useState(false);
  const [profileId, setProfileId] = useState('zx-spectrum-like');
  const [mode, setMode] = useState('attribute-bitmap');
  const [paused, setPaused] = useState(false);
  const [activeFontId, setActiveFontId] = useState('c64-chargen');

  const profile = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];
  const isTextMode = mode.startsWith('text-') || mode === 'attribute-text';

  const handleCrtChange = useCallback((update: Partial<CrtSettings>) => {
    setCrt(prev => ({ ...prev, ...update }));
  }, []);

  const handleProfileChange = useCallback((id: string) => {
    setProfileId(id);
    if (isTextMode) {
      const textId = defaultTextModeForProfile(id);
      setMode(textId);
    } else {
      const p = machineProfiles[id] || machineProfiles['zx-spectrum-like'];
      setMode(p.supportedModes[0]);
    }
  }, [isTextMode]);

  const handleModeChange = useCallback((m: string) => {
    setMode(m);
  }, []);

  const switchToText = useCallback(() => {
    setMode(defaultTextModeForProfile(profileId));
  }, [profileId]);

  const switchToBitmap = useCallback(() => {
    const p = machineProfiles[profileId] || machineProfiles['zx-spectrum-like'];
    setMode(p.supportedModes[0]);
  }, [profileId]);

  const handlePauseToggle = useCallback(() => {
    setPaused(p => !p);
  }, []);

  const handleFontChange = useCallback((fontId: string) => {
    setActiveFontId(fontId);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#111', color: '#ccc', fontFamily: 'system-ui, sans-serif', fontSize: '13px',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '4px 10px', background: '#1a1a1a', borderBottom: '1px solid #333', flexWrap: 'wrap',
      }}>
        <h1 style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>
          CRT
        </h1>

        <select value={profileId} onChange={e => handleProfileChange((e.target as HTMLSelectElement).value)} style={s}>
          {Object.entries(machineProfiles).map(([id, p]) => (
            <option key={id} value={id}>{p.name}</option>
          ))}
        </select>

        <div style={{ width: '1px', height: '18px', background: '#444' }} />

        <button onClick={switchToBitmap}
          style={{ ...b, background: !isTextMode ? '#2a4' : '#333', color: !isTextMode ? '#000' : '#ccc' }}>
          Bitmap
        </button>
        <button onClick={switchToText}
          style={{ ...b, background: isTextMode ? '#2a4' : '#333', color: isTextMode ? '#000' : '#ccc' }}>
          Text
        </button>

        {!isTextMode && (
          <select value={mode} onChange={e => handleModeChange((e.target as HTMLSelectElement).value)} style={s}>
            {profile.supportedModes.map(m => (
              <option key={m} value={m}>{modeLabel(m)}</option>
            ))}
          </select>
        )}

        {isTextMode && (
          <>
            <select value={mode} onChange={e => handleModeChange((e.target as HTMLSelectElement).value)} style={s}>
              {textVideoModes.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>

            <select value={activeFontId} onChange={e => handleFontChange((e.target as HTMLSelectElement).value)} style={{ ...s, maxWidth: '130px' }}>
              {fontPresets.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </>
        )}

        <div style={{ width: '1px', height: '18px', background: '#444' }} />

        <button onClick={handlePauseToggle} style={b}>{paused ? '▶' : '⏸'}</button>
        <button onClick={() => setShowDebug(s => !s)} style={b}>{showDebug ? 'Dbg' : 'Debug'}</button>
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

      <SettingsPanel crt={crt} onCrtChange={handleCrtChange} />
      {showDebug && <DebugOverlay />}
    </div>
  );
}

function modeLabel(m: VideoMode): string {
  switch (m) {
    case 'text': return 'Text (legacy)';
    case 'attribute-text': return 'Text (attribute)';
    case 'bitmap-1bpp': return 'Bitmap 1bpp';
    case 'bitmap-2bpp': return 'Bitmap 2bpp';
    case 'attribute-bitmap': return 'Attribute Bitmap';
    case 'tilemap': return 'Tilemap';
    case 'c64-text': return 'C64 Text';
  }
}

const s: Record<string, string> = {
  background: '#222', color: '#ccc', border: '1px solid #444',
  borderRadius: '3px', padding: '3px 6px', fontSize: '11px', maxWidth: '150px',
};

const b: Record<string, string> = {
  background: '#333', color: '#ccc', border: '1px solid #555',
  borderRadius: '3px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer',
};
