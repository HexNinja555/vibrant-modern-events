import React, { useState } from 'react';
import { useApp } from '@/store/AppStore';
import { EVENTS } from '@/lib/nightlife';
import { Chart, Plus, Crown, Check, X } from './icons';

export default function ManagerDashboard() {
  const { pushNotification } = useApp();
  const [events, setEvents] = useState(EVENTS.slice(0, 5));
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [genre, setGenre] = useState('EDM');
  const [vipPrice, setVipPrice] = useState('150');

  // Mock analytics
  const bookingsByDay = [12, 28, 19, 42, 35, 58, 47];
  const totalBookings = bookingsByDay.reduce((a, b) => a + b, 0);
  const revenue = totalBookings * 78;
  const maxBar = Math.max(...bookingsByDay);

  const createEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue) return;
    const base = EVENTS[0];
    const newEv = { ...base, id: 'new' + Date.now(), title, venue, genre, trending: false };
    setEvents((prev) => [newEv as typeof base, ...prev]);
    pushNotification({ id: 'n' + Date.now(), type: 'event', title: 'New event published', body: `${title} at ${venue} is now live!`, time: 'now', read: false });
    setTitle(''); setVenue(''); setShowForm(false);
  };

  const removeEvent = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="px-5 pb-28 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Club Manager Portal</p>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" />Event</button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <KPI label="Bookings" value={totalBookings.toString()} />
        <KPI label="Revenue" value={`$${(revenue / 1000).toFixed(1)}k`} accent />
        <KPI label="Events" value={events.length.toString()} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Chart className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-white">Bookings this week</h3>
        </div>
        <div className="flex h-36 items-end justify-between gap-2">
          {bookingsByDay.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-end" style={{ height: '100%' }}>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-fuchsia-600 to-cyan-400 transition-all" style={{ height: `${(v / maxBar) * 100}%` }} />
              </div>
              <span className="text-[10px] text-white/40">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mt-7 text-lg font-bold text-white">Your Events</h3>
      <div className="mt-3 space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <img src={e.image} className="h-14 w-14 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-white">{e.title}</p>
              <p className="text-xs text-white/50">{e.venue} · {e.genre}</p>
              <div className="mt-1 flex gap-2 text-[10px] text-white/40">
                <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-cyan-300">{Math.floor(Math.random() * 80 + 20)} booked</span>
                <span className="rounded bg-lime-400/15 px-1.5 py-0.5 text-lime-300 flex items-center gap-0.5"><Crown className="h-2.5 w-2.5" />VIP ${e.tiers[1].price}</span>
              </div>
            </div>
            <button onClick={() => removeEvent(e.id)} className="text-white/30 hover:text-red-400"><X className="h-5 w-5" /></button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={() => setShowForm(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={createEvent} className="w-full max-w-md space-y-3 rounded-t-3xl border border-white/10 bg-[#12121A] p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Create Event</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/50"><X className="h-6 w-6" /></button>
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none" />
            <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none" />
            <div className="flex gap-3">
              <select value={genre} onChange={(e) => setGenre(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                {['EDM', 'House', 'Hip-Hop', 'Techno', 'R&B'].map((g) => <option key={g} className="bg-[#12121A]">{g}</option>)}
              </select>
              <input value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} placeholder="VIP $" className="w-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none" />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-3.5 font-bold text-white"><Check className="h-5 w-5" />Publish Event</button>
          </form>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
      <p className={`text-xl font-black ${accent ? 'text-lime-400' : 'text-white'}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
    </div>
  );
}
