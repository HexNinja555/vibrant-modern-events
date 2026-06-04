import React from 'react';
import { useApp } from '@/store/AppStore';
import { Bell, Crown, Star, Check } from './icons';

const iconFor = (t: string) => (t === 'vip' ? Crown : t === 'promo' ? Star : t === 'booking' ? Check : Bell);
const colorFor = (t: string) => (t === 'vip' ? 'text-fuchsia-400' : t === 'promo' ? 'text-lime-400' : t === 'booking' ? 'text-cyan-400' : 'text-cyan-400');

export default function NotificationsPanel() {
  const { notifications, markAllRead } = useApp();
  return (
    <div className="px-5 pb-28 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Notifications</h1>
        <button onClick={markAllRead} className="text-xs font-bold text-cyan-400">Mark all read</button>
      </div>
      <div className="mt-5 space-y-3">
        {notifications.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <div key={n.id} className={`flex gap-3 rounded-2xl border p-4 ${n.read ? 'border-white/5 bg-white/5' : 'border-fuchsia-500/30 bg-fuchsia-950/20'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon className={`h-5 w-5 ${colorFor(n.type)}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-cyan-400" />}
                </div>
                <p className="mt-0.5 text-sm text-white/60">{n.body}</p>
                <p className="mt-1 text-xs text-white/30">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
