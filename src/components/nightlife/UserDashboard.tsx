import React from 'react';
import { useApp } from '@/store/AppStore';
import { EVENTS, fmtDate, fmtTime } from '@/lib/nightlife';
import { Crown, Star, MapPin, Calendar } from './icons';

export default function UserDashboard() {
  const { user, bookings, favorites, go, logout, setAuthOpen } = useApp();

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <Crown className="mb-4 h-12 w-12 text-fuchsia-500" />
        <h2 className="text-2xl font-black text-white">Sign in to PULSE</h2>
        <p className="mt-2 text-white/50">Track your bookings, favorites and loyalty points.</p>
        <button onClick={() => setAuthOpen(true)} className="mt-5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-8 py-3 font-bold text-white">Sign in</button>
      </div>
    );
  }

  const favEvents = EVENTS.filter((e) => favorites.includes(e.id));

  return (
    <div className="px-5 pb-28 pt-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-cyan-500 text-2xl font-black text-white">{user.name[0]?.toUpperCase()}</div>
        <div>
          <h1 className="text-2xl font-black text-white">{user.name}</h1>
          <p className="text-sm capitalize text-white/50">{user.role} · {user.email}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Bookings" value={bookings.length} />
        <Stat label="Favorites" value={favEvents.length} />
        <Stat label="Points" value={user.points} accent />
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4">
        <Star className="h-6 w-6 text-lime-400" />
        <div>
          <p className="font-bold text-lime-300">Gold Member · {user.points} pts</p>
          <p className="text-xs text-white/50">{1000 - (user.points % 1000)} pts to your next free VIP upgrade</p>
        </div>
      </div>

      <h3 className="mt-7 text-lg font-bold text-white">Upcoming Bookings</h3>
      {bookings.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/50">
          No bookings yet. <button onClick={() => go('home')} className="font-bold text-cyan-400">Explore events</button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {bookings.map((b) => {
            const ev = EVENTS.find((e) => e.id === b.eventId)!;
            const tier = ev.tiers.find((t) => t.id === b.tierId)!;
            return (
              <button key={b.id} onClick={() => go('detail', ev.id)} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
                <img src={ev.image} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-white">{ev.title}</p>
                  <p className="flex items-center gap-1 text-xs text-white/50"><Calendar className="h-3.5 w-3.5" />{fmtDate(ev.date)} · {fmtTime(ev.date)}</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-fuchsia-600/20 px-2 py-0.5 text-[10px] font-bold text-fuchsia-300">{tier.vip && <Crown className="h-3 w-3" />}{tier.label}</span>
                </div>
                <span className="rounded-lg bg-lime-400/20 px-2 py-1 text-[10px] font-bold text-lime-300">{b.code}</span>
              </button>
            );
          })}
        </div>
      )}

      {favEvents.length > 0 && (
        <>
          <h3 className="mt-7 text-lg font-bold text-white">Favorite Venues</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {favEvents.map((e) => (
              <button key={e.id} onClick={() => go('detail', e.id)} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left">
                <img src={e.image} className="h-24 w-full object-cover" />
                <div className="p-2">
                  <p className="truncate text-sm font-bold text-white">{e.title}</p>
                  <p className="flex items-center gap-1 text-xs text-white/50"><MapPin className="h-3 w-3" />{e.city}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <button onClick={logout} className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 py-3 font-bold text-white/60">Log out</button>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
      <p className={`text-2xl font-black ${accent ? 'text-lime-400' : 'text-white'}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
    </div>
  );
}
