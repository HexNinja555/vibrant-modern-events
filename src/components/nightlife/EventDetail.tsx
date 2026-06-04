import React, { useState } from 'react';
import { EVENTS, fmtDate, fmtTime } from '@/lib/nightlife';
import { useApp } from '@/store/AppStore';
import { Back, MapPin, Clock, Heart, Crown, Check } from './icons';

export default function EventDetail() {
  const { selectedEventId, go, favorites, toggleFav } = useApp();
  const event = EVENTS.find((e) => e.id === selectedEventId);
  const [active, setActive] = useState(0);
  if (!event) return null;
  const fav = favorites.includes(event.id);

  return (
    <div className="pb-32">
      <div className="relative h-80">
        <img src={event.gallery[active]} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
        <button onClick={() => go('home')} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"><Back className="h-5 w-5" /></button>
        <button onClick={() => toggleFav(event.id)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur"><Heart className={`h-5 w-5 ${fav ? 'text-fuchsia-500' : 'text-white'}`} filled={fav} /></button>
      </div>

      <div className="-mt-6 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {event.gallery.map((g, i) => (
          <button key={i} onClick={() => setActive(i)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition ${active === i ? 'ring-fuchsia-500' : 'ring-white/10'}`}>
            <img src={g} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="px-5 pt-5">
        <div className="flex gap-2">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">{event.genre}</span>
          {event.trending && <span className="rounded-full bg-fuchsia-600/90 px-3 py-1 text-xs font-bold text-white">Trending</span>}
        </div>
        <h1 className="mt-3 text-3xl font-black text-white">{event.title}</h1>
        <div className="mt-3 space-y-2 text-sm text-white/70">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-fuchsia-400" />{event.venue}, {event.city}</div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-cyan-400" />{fmtDate(event.date)} · {fmtTime(event.date)}</div>
        </div>

        {event.promo && (
          <div className="mt-4 rounded-2xl border border-lime-400/40 bg-lime-400/10 p-4 text-sm font-semibold text-lime-300">🔥 {event.promo}</div>
        )}

        <p className="mt-5 leading-relaxed text-white/70">{event.description}</p>

        <div className="mt-6">
          <h3 className="mb-2 text-lg font-bold text-white">Lineup</h3>
          <div className="flex flex-wrap gap-2">
            {event.djs.map((d) => <span key={d} className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10">🎧 {d}</span>)}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Info label="Dress Code" value={event.dressCode} />
          <Info label="Age Limit" value={event.ageLimit} />
        </div>

        <div className="mt-7">
          <h3 className="mb-3 text-lg font-bold text-white">Choose your experience</h3>
          <div className="space-y-3">
            {event.tiers.map((t) => (
              <div key={t.id} className={`rounded-2xl border p-4 ${t.vip ? 'border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/40 to-transparent' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.vip && <Crown className="h-4 w-4 text-fuchsia-400" />}
                    <span className="font-bold text-white">{t.label}</span>
                  </div>
                  <span className="text-lg font-black text-white">${t.price}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {t.perks.map((p) => <li key={p} className="flex items-center gap-2 text-xs text-white/60"><Check className="h-3.5 w-3.5 text-lime-400" />{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md border-t border-white/10 bg-[#0A0A0F]/95 p-4 backdrop-blur-xl">
        <button onClick={() => go('booking', event.id)} className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-4 text-base font-bold text-white shadow-[0_0_24px_rgba(255,0,110,0.5)] active:scale-95 transition">
          Reserve · Book Now
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}
