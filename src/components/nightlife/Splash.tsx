import React, { useEffect, useState } from 'react';

export default function Splash({ onDone }: { onDone: () => void }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1900);
    const t2 = setTimeout(onDone, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0F] transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl animate-pulse" />
      <div className="absolute h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="relative text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-cyan-400" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-fuchsia-500" style={{ animationDelay: '0.15s' }} />
          <span className="h-3 w-3 animate-bounce rounded-full bg-lime-400" style={{ animationDelay: '0.3s' }} />
        </div>
        <h1 className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-lime-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_0_25px_rgba(255,0,110,0.5)]">
          PULSE
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.4em] text-white/60">Nightlife Unlocked</p>
      </div>
    </div>
  );
}
