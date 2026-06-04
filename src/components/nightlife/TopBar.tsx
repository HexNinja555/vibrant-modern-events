import React from 'react';
import { useApp } from '@/store/AppStore';
import { Bell, User } from './icons';

export default function TopBar() {
  const { user, go, setAuthOpen, notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#0A0A0F]/80 px-4 py-3 backdrop-blur-xl">
      <button onClick={() => go('home')} className="flex items-center gap-2">
        <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-lime-400 bg-clip-text text-xl font-black tracking-tight text-transparent">PULSE</span>
      </button>
      <div className="flex items-center gap-2">
        <button onClick={() => go('notifications')} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
          <Bell className="h-5 w-5 text-white/70" />
          {unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-fuchsia-500" />}
        </button>
        {user ? (
          <button onClick={() => go('dashboard')} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-cyan-500 text-sm font-black text-white">{user.name[0]?.toUpperCase()}</button>
        ) : (
          <button onClick={() => setAuthOpen(true)} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white"><User className="h-4 w-4" />Sign in</button>
        )}
      </div>
    </header>
  );
}
