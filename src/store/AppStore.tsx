import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NUser, Booking, NNotification, INITIAL_NOTIFICATIONS, Role } from '@/lib/nightlife';
import { supabase } from '@/lib/supabase';

export type View = 'home' | 'detail' | 'booking' | 'dashboard' | 'notifications' | 'manager';

interface Ctx {
  user: NUser | null;
  view: View;
  selectedEventId: string | null;
  bookings: Booking[];
  favorites: string[];
  notifications: NNotification[];
  authOpen: boolean;
  setAuthOpen: (b: boolean) => void;
  login: (name: string, email: string, role: Role) => void;
  logout: () => void;
  go: (v: View, eventId?: string) => void;
  toggleFav: (id: string) => void;
  addBooking: (b: Booking) => void;
  pushNotification: (n: NNotification) => void;
  markAllRead: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NUser | null>(null);
  const [view, setView] = useState<View>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NNotification[]>(INITIAL_NOTIFICATIONS);
  const [authOpen, setAuthOpen] = useState(false);

  // Load persisted data on mount / when user changes
  useEffect(() => {
    (async () => {
      const { data: bk } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (bk) setBookings(bk.map((r: any) => ({ id: r.id, eventId: r.event_id, tierId: r.tier_id, guests: r.guests, total: Number(r.total), status: r.status, date: r.created_at, code: r.code })));
      const { data: nt } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (nt && nt.length) setNotifications(nt.map((r: any) => ({ id: r.id, type: r.type, title: r.title, body: r.body, time: new Date(r.created_at).toLocaleString(), read: r.read })));
    })();
  }, [user?.email]);

  const login = useCallback(async (name: string, email: string, role: Role) => {
    setUser({ id: 'u1', name, email, role, points: 320 });
    setAuthOpen(false);
    await supabase.from('profiles').upsert({ name, email, role }, { onConflict: 'email' });
  }, []);

  const logout = useCallback(() => { setUser(null); setView('home'); }, []);

  const go = useCallback((v: View, eventId?: string) => {
    if (eventId) setSelectedEventId(eventId);
    setView(v);
    window.scrollTo({ top: 0 });
  }, []);

  const toggleFav = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const addBooking = useCallback((b: Booking) => {
    setBookings((prev) => [b, ...prev]);
    setUser((u) => (u ? { ...u, points: u.points + Math.round(b.total) } : u));
    supabase.from('bookings').insert({ id: b.id, event_id: b.eventId, tier_id: b.tierId, guests: b.guests, total: b.total, status: b.status, code: b.code });
  }, []);

  const pushNotification = useCallback((n: NNotification) => {
    setNotifications((prev) => [n, ...prev]);
    supabase.from('notifications').insert({ id: n.id, type: n.type, title: n.title, body: n.body, read: n.read });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    supabase.from('notifications').update({ read: true }).neq('id', '');
  }, []);

  return (
    <AppCtx.Provider value={{ user, view, selectedEventId, bookings, favorites, notifications, authOpen, setAuthOpen, login, logout, go, toggleFav, addBooking, pushNotification, markAllRead }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used in AppProvider');
  return c;
}
