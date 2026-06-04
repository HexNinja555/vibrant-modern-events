import React from 'react';
import { NEvent, fmtDate, fmtTime } from '@/lib/nightlife';
import { useApp } from '@/store/AppStore';
import { Heart, MapPin, Crown } from './icons';

export default function EventCard({ event }: { event: NEvent }) {
  const { go, favorites, toggleFav } = useApp();
  const fav = favorites.includes(event.id);
  const minPrice = Math.min(...event.tiers.map((t) => t.price));

  return (
    <button
      onClick={() => go('detail', event.id)}
      className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_rgba(255,0,110,0.25)]"
    >
      <div className="relative h-60 overflow-hidden">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {event.trending && (
            <span className="rounded-full bg-fuchsia-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(255,0,110,0.6)]">Trending</span>
          )}
          <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 ring-1 ring-cyan-400/40">{event.genre}</span>
        </div>
        <span
          onClick={(e) => { e.stopPropagation(); toggleFav(event.id); }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <Heart className={`h-5 w-5 transition-colors ${fav ? 'text-fuchsia-500' : 'text-white'}`} filled={fav} />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-lime-400">
          <span>{fmtDate(event.date)}</span><span className="text-white/40">·</span><span>{fmtTime(event.date)}</span>
        </div>
        <h3 className="text-xl font-black leading-tight text-white">{event.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-white/60">
          <MapPin className="h-4 w-4" /><span>{event.venue}, {event.city}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-white/70">from <span className="font-bold text-white">${minPrice}</span></span>
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-1.5 text-xs font-bold text-white">
            <Crown className="h-3.5 w-3.5" /> Book
          </span>
        </div>
      </div>
    </button>
  );
}
