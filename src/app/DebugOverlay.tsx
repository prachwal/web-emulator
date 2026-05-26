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
    <div class="debug-overlay">
      <div>FPS: {stats.fps}</div>
      <div>Frame: ~{stats.frameTime}ms</div>
    </div>
  );
}
