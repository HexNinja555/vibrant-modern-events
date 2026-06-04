import React, { useMemo, useState } from 'react';
import { EVENTS, GENRES, HERO_IMG } from '@/lib/nightlife';
import { useApp } from '@/store/AppStore';
import EventCard from './EventCard';
import { Search, Crown } from './icons';

export default function EventFeed() {
  const { user, setAuthOpen } = useApp();
  const [genre, setGenre] = useState('All');
  const [vipOnly, setVipOnly] = useState(false);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      if (genre !== 'All' && e.genre !== genre) return false;
      if (vipOnly && !e.tiers.some((t) => t.vip)) return false;
      if (q && !(`${e.title} ${e.venue} ${e.city} ${e.djs.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [genre, vipOnly, q]);

  return (
    <div className="pb-28">
      {/* Hero */}
      <div className="relative h-[340px] overflow-hidden">
        <img src={HERO_IMG} alt="hero" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-[#0A0A0F]/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <span className="mb-2 w-fit rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 backdrop-blur">Tonight · 12 events live</span>
          <h1 className="text-4xl font-black leading-none text-white">Find your <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">night.</span></h1>
          <p className="mt-2 max-w-sm text-sm text-white/70">Discover the hottest events, book VIP tables, and skip the line.</p>
          {!user && (
            <button onClick={() => setAuthOpen(true)} className="mt-4 flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(255,0,110,0.5)]">
              <Crown className="h-4 w-4" /> Join the list
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-20 -mt-4 bg-[#0A0A0F]/90 px-4 pt-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <Search className="h-5 w-5 text-white/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, venues, DJs..." className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none" />
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-3">
          {GENRES.map((g) => (
            <button key={g} onClick={() => setGenre(g)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all ${genre === g ? 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white' : 'bg-white/5 text-white/60 ring-1 ring-white/10'}`}>{g}</button>
          ))}
          <button onClick={() => setVipOnly((v) => !v)} className={`flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all ${vipOnly ? 'bg-lime-400 text-black' : 'bg-white/5 text-white/60 ring-1 ring-white/10'}`}><Crown className="h-3.5 w-3.5" /> VIP</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 px-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
      {filtered.length === 0 && <p className="mt-12 text-center text-white/50">No events match your filters.</p>}
    </div>
  );
}
