import { useState, useEffect } from 'preact/hooks';

export function DebugOverlay() {
  const [stats, setStats] = useState({ fps: 0, frameTime: 0 });

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;

    const id = setInterval(() => {
      const now = performance.now();
      frames++;
      if (now - lastTime >= 1000) {
        setStats({ fps: frames, frameTime: Math.round(1000 / frames) });
        frames = 0;
        lastTime = now;
      }
    }, 200);

    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: 'rgba(0,0,0,0.85)',
      color: '#0f0',
      padding: '8px 12px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '12px',
      lineHeight: '1.6',
      pointerEvents: 'none',
      zIndex: 100,
    }}>
      <div>FPS: {stats.fps}</div>
      <div>Frame: ~{stats.frameTime}ms</div>
      <div>Canvas2D fallback</div>
    </div>
  );
}
