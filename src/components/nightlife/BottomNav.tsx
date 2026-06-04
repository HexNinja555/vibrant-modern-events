import React from 'react';
import { useApp, View } from '@/store/AppStore';
import { Home, Calendar, Bell, User, Chart } from './icons';

export default function BottomNav() {
  const { view, go, user, notifications, setAuthOpen } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const items: { v: View; label: string; icon: React.FC<{ className?: string }>; badge?: number; auth?: boolean }[] = [
    { v: 'home', label: 'Discover', icon: Home },
    { v: 'dashboard', label: 'Bookings', icon: Calendar, auth: true },
    { v: 'notifications', label: 'Alerts', icon: Bell, badge: unread },
    isManager
      ? { v: 'manager', label: 'Manage', icon: Chart }
      : { v: 'dashboard', label: 'Profile', icon: User, auth: true },
  ];

  const handle = (it: typeof items[number]) => {
    if (it.auth && !user) { setAuthOpen(true); return; }
    go(it.v);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-white/10 bg-[#0A0A0F]/95 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((it, i) => {
          const Icon = it.icon;
          const active = view === it.v;
          return (
            <button key={i} onClick={() => handle(it)} className="relative flex flex-1 flex-col items-center gap-1 py-1">
              <div className={`relative transition-transform ${active ? 'scale-110' : ''}`}>
                <Icon className={`h-6 w-6 transition-colors ${active ? 'text-fuchsia-500 drop-shadow-[0_0_8px_rgba(255,0,110,0.8)]' : 'text-white/50'}`} />
                {it.badge ? <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">{it.badge}</span> : null}
              </div>
              <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-white/40'}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
