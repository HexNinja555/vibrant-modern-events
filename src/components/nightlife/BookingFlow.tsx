import React, { useState } from 'react';
import { EVENTS, fmtDate, fmtTime, Booking } from '@/lib/nightlife';
import { useApp } from '@/store/AppStore';
import { supabase } from '@/lib/supabase';
import { Back, Check, Crown } from './icons';
import PaymentForm from './PaymentForm';


export default function BookingFlow() {
  const { selectedEventId, go, addBooking, pushNotification, user, setAuthOpen } = useApp();
  const event = EVENTS.find((e) => e.id === selectedEventId);
  const [step, setStep] = useState(0);
  const [tierId, setTierId] = useState(event?.tiers[0].id || 'ga');
  const [guests, setGuests] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [done, setDone] = useState<Booking | null>(null);

  if (!event) return null;
  const tier = event.tiers.find((t) => t.id === tierId)!;
  const total = tier.price * (tier.vip && tier.id === 'table' ? 1 : guests);

  const startPayment = async () => {
    if (!user) { setAuthOpen(true); return; }
    setLoadingPay(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: Math.round(total * 100), currency: 'usd', metadata: { eventId: event.id, tier: tier.label } },
      });
      if (error || !data?.clientSecret) throw new Error('Could not start payment');
      setClientSecret(data.clientSecret);
      setStep(2);
    } catch {
      alert('Payment init failed. Please try again.');
    } finally {
      setLoadingPay(false);
    }
  };

  const completeBooking = () => {
    const b: Booking = {
      id: 'b' + Date.now(), eventId: event.id, tierId, guests,
      total, status: 'confirmed', date: new Date().toISOString(),
      code: 'PLS-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    };
    addBooking(b);
    pushNotification({ id: 'n' + Date.now(), type: 'booking', title: 'Booking Confirmed!', body: `${tier.label} for ${event.title} is locked in.`, time: 'now', read: false });
    setDone(b);
    setStep(3);
  };

  if (step === 3 && done) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 pb-28 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-cyan-500 shadow-[0_0_40px_rgba(57,255,20,0.6)]">
          <Check className="h-12 w-12 text-black" />
        </div>
        <h2 className="text-3xl font-black text-white">You're in!</h2>
        <p className="mt-2 text-white/60">{tier.label} · {event.title}</p>
        <div className="mt-6 w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">Entry Code</p>
          <p className="mt-1 text-2xl font-black tracking-widest text-lime-400">{done.code}</p>
          <div className="mt-4 grid grid-cols-8 gap-1">
            {Array.from({ length: 32 }).map((_, i) => <span key={i} className={`h-8 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-white/20'}`} />)}
          </div>
          <p className="mt-3 text-xs text-white/50">{fmtDate(event.date)} · {fmtTime(event.date)} · {event.venue}</p>
        </div>
        <button onClick={() => go('dashboard')} className="mt-6 w-full max-w-xs rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-4 font-bold text-white">View My Bookings</button>
        <button onClick={() => go('home')} className="mt-3 text-sm text-white/50">Back to events</button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-28 pt-4">
      <button onClick={() => (step > 0 ? setStep(step - 1) : go('detail', event.id))} className="mb-4 flex items-center gap-1 text-sm text-white/60"><Back className="h-4 w-4" /> Back</button>
      <div className="mb-6 flex gap-2">
        {[0, 1, 2].map((s) => <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400' : 'bg-white/10'}`} />)}
      </div>

      {step === 0 && (
        <>
          <h2 className="text-2xl font-black text-white">Select package</h2>
          <div className="mt-4 space-y-3">
            {event.tiers.map((t) => (
              <button key={t.id} onClick={() => setTierId(t.id)} className={`w-full rounded-2xl border p-4 text-left transition ${tierId === t.id ? 'border-fuchsia-500 bg-fuchsia-950/30' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-white">{t.vip && <Crown className="h-4 w-4 text-fuchsia-400" />}{t.label}</span>
                  <span className="text-lg font-black text-white">${t.price}</span>
                </div>
                <p className="mt-1 text-xs text-white/50">{t.perks.join(' · ')}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-4 font-bold text-white">Continue</button>
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-2xl font-black text-white">Guest count</h2>
          <p className="mt-1 text-sm text-white/50">How many in your party?</p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">−</button>
            <span className="w-16 text-center text-5xl font-black text-white">{guests}</span>
            <button onClick={() => setGuests((g) => Math.min(20, g + 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">+</button>
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Row label={tier.label} value={`$${tier.price}`} />
            {tier.id !== 'table' && <Row label={`Guests × ${guests}`} value={`$${tier.price * guests}`} />}
            <div className="my-2 h-px bg-white/10" />
            <Row label="Total" value={`$${total}`} bold />
          </div>
          <button onClick={startPayment} disabled={loadingPay} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-4 font-bold text-white disabled:opacity-50">
            {loadingPay ? 'Loading...' : user ? 'Continue to Payment' : 'Sign in to Book'}
          </button>
        </>
      )}

      {step === 2 && clientSecret && (
        <>
          <h2 className="text-2xl font-black text-white">Payment</h2>
          <p className="mt-1 text-sm text-white/50">{event.title} · {tier.label} · ${total}</p>
          <div className="mt-5">
            <PaymentForm amount={total} clientSecret={clientSecret} onSuccess={completeBooking} />
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between py-1 ${bold ? 'text-lg font-black text-white' : 'text-sm text-white/70'}`}><span>{label}</span><span>{value}</span></div>;
}
