import React, { useState } from 'react';
import { useApp } from '@/store/AppStore';
import Splash from './nightlife/Splash';
import TopBar from './nightlife/TopBar';
import BottomNav from './nightlife/BottomNav';
import AuthModal from './nightlife/AuthModal';
import EventFeed from './nightlife/EventFeed';
import EventDetail from './nightlife/EventDetail';
import BookingFlow from './nightlife/BookingFlow';
import UserDashboard from './nightlife/UserDashboard';
import ManagerDashboard from './nightlife/ManagerDashboard';
import NotificationsPanel from './nightlife/NotificationsPanel';

export default function AppLayout() {
  const { view } = useApp();
  const [splash, setSplash] = useState(true);

  return (
    <div className="min-h-screen bg-black">
      {splash && <Splash onDone={() => setSplash(false)} />}
      {/* Mobile-first frame centered on larger screens */}
      <div className="relative mx-auto min-h-screen max-w-md bg-[#0A0A0F] text-white shadow-2xl">
        <TopBar />
        <main className="min-h-[calc(100vh-56px)]">
          {view === 'home' && <EventFeed />}
          {view === 'detail' && <EventDetail />}
          {view === 'booking' && <BookingFlow />}
          {view === 'dashboard' && <UserDashboard />}
          {view === 'manager' && <ManagerDashboard />}
          {view === 'notifications' && <NotificationsPanel />}
        </main>
        <BottomNav />
        <AuthModal />
      </div>
    </div>
  );
}
